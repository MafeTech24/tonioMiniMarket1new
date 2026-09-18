const STORE_LOCATION = {
  latitude: -31.402824695487222,
  longitude: -64.24479778959648,
} as const;

// Tabla de costos de envío definida por los dueños de Tonio MiniMarket
// (septiembre 2026). Cada tramo es "hasta X km desde el local" -> costo fijo.
// Se aplica sobre routeDistanceKm (la distancia estimada de recorrido, no la
// línea recta), que es el mismo número que se le muestra al cliente en el
// checkout como "recorrido estimado". Más allá del último tramo, no hay envío.
const DELIVERY_RATE_TABLE: Array<{ uptoKm: number; cost: number }> = [
  { uptoKm: 2, cost: 0 },
  { uptoKm: 3, cost: 1500 },
  { uptoKm: 4, cost: 2000 },
  { uptoKm: 5, cost: 2500 },
  { uptoKm: 6, cost: 3000 },
  { uptoKm: 7, cost: 3500 },
  { uptoKm: 8, cost: 4000 },
  { uptoKm: 9, cost: 4500 },
  { uptoKm: 10, cost: 5000 },
];

// Solución temporal mientras no está configurado Google Maps (GOOGLE_MAPS_API_KEY).
// En vez de la Routes API de Google, geocodificamos la dirección con Nominatim
// (OpenStreetMap, gratis, sin API key) y estimamos la distancia de la ruta como
// la distancia en línea recta multiplicada por este factor (aproximación típica
// de trazado de calles urbanas). Cuando se configure Google Maps, este archivo
// se puede volver a la versión con Routes API sin tocar la fórmula de costos.
const ROUTE_DISTANCE_ESTIMATE_FACTOR = 1.3;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type NominatimResult = Array<{
  lat: string;
  lon: string;
}>;

function isValidCoordinate(latitude: unknown, longitude: unknown): latitude is number {
  return (
    typeof latitude === "number"
    && typeof longitude === "number"
    && Number.isFinite(latitude)
    && Number.isFinite(longitude)
    && latitude >= -90 && latitude <= 90
    && longitude >= -180 && longitude <= 180
  );
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const earthRadiusKm = 6371;
  const latDelta = (lat2 - lat1) * Math.PI / 180;
  const lonDelta = (lon2 - lon1) * Math.PI / 180;
  const value = Math.sin(latDelta / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180)
    * Math.cos(lat2 * Math.PI / 180)
    * Math.sin(lonDelta / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

/**
 * Busca el costo de envío según la tabla de tramos de los dueños.
 * Devuelve null si la distancia queda fuera del último tramo (no llegamos).
 */
function calculateDeliveryCost(routeDistanceKm: number): number | null {
  const band = DELIVERY_RATE_TABLE.find((entry) => routeDistanceKm <= entry.uptoKm);
  return band ? band.cost : null;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Método no permitido." }, 405);
  }

  try {
    const payload = await request.json() as {
      street?: unknown;
      latitude?: unknown;
      longitude?: unknown;
    };

    let destinationLat: number;
    let destinationLon: number;
    let geocodedFromStreet = false;

    if (isValidCoordinate(payload.latitude, payload.longitude)) {
      // El cliente ya confirmó su ubicación arrastrando el pin en el mapa:
      // usamos esa coordenada directamente, sin pasar por Nominatim de nuevo.
      destinationLat = payload.latitude as number;
      destinationLon = payload.longitude as number;
    } else {
      const street = typeof payload.street === "string" ? payload.street.trim() : "";

      if (street.length < 4 || street.length > 160) {
        return jsonResponse({ error: "Ingresá una calle y número válidos." }, 400);
      }

      const nominatimUrl = new URL("https://nominatim.openstreetmap.org/search");
      nominatimUrl.searchParams.set("q", `${street}, Córdoba Capital, Córdoba, Argentina`);
      nominatimUrl.searchParams.set("format", "json");
      nominatimUrl.searchParams.set("limit", "1");

      const nominatimResponse = await fetch(nominatimUrl, {
        headers: {
          // Nominatim exige un User-Agent que identifique la aplicación.
          "User-Agent": "TonioMiniMarket-CalculoEnvio/1.0 (contacto@toniominimarket.com)",
          "Accept-Language": "es",
        },
      });

      if (!nominatimResponse.ok) {
        console.error("Nominatim respondió con estado", nominatimResponse.status);
        return jsonResponse({ error: "No pudimos calcular la ruta para esa dirección." }, 502);
      }

      const nominatimData = await nominatimResponse.json() as NominatimResult;
      const match = nominatimData?.[0];
      const parsedLat = match ? Number(match.lat) : NaN;
      const parsedLon = match ? Number(match.lon) : NaN;

      if (!match || Number.isNaN(parsedLat) || Number.isNaN(parsedLon)) {
        // No la encontramos automáticamente: el frontend debe ofrecer ubicar
        // el pin a mano en el mapa en vez de cortar el flujo acá.
        return jsonResponse({
          error: "No encontramos esa dirección automáticamente. Ubicá tu punto en el mapa para calcular el envío.",
          needsManualPin: true,
          storeLatitude: STORE_LOCATION.latitude,
          storeLongitude: STORE_LOCATION.longitude,
        }, 404);
      }

      destinationLat = parsedLat;
      destinationLon = parsedLon;
      geocodedFromStreet = true;
    }

    const radialDistanceKm = calculateDistanceKm(
      STORE_LOCATION.latitude,
      STORE_LOCATION.longitude,
      destinationLat,
      destinationLon,
    );
    // Estimación: no tenemos una ruta real de calles (eso requiere Google Maps),
    // así que aproximamos la distancia recorrida a partir de la distancia en línea recta.
    const routeDistanceKm = radialDistanceKm * ROUTE_DISTANCE_ESTIMATE_FACTOR;

    const responseBase = {
      routeDistanceKm: Math.round(routeDistanceKm * 10) / 10,
      radialDistanceKm: Math.round(radialDistanceKm * 10) / 10,
      duration: null,
      // El frontend usa esto para centrar/mostrar el pin arrastrable cuando
      // la cotización vino de un texto de calle en vez de un pin confirmado.
      latitude: destinationLat,
      longitude: destinationLon,
      geocodedFromStreet,
    };

    const cost = calculateDeliveryCost(routeDistanceKm);

    if (cost === null) {
      return jsonResponse({
        ...responseBase,
        available: false,
        free: false,
        cost: null,
        error: "Lo sentimos, por ahora no llegamos a tu zona. Podés retirar en Falucho 275, Bº Las Palmas.",
      });
    }

    return jsonResponse({
      ...responseBase,
      available: true,
      free: cost === 0,
      cost,
    });
  } catch (error) {
    console.error("Error inesperado calculando el envío", error);
    return jsonResponse({ error: "Hubo un error calculando el envío. Intentá de nuevo." }, 500);
  }
});
