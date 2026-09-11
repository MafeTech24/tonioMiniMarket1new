const STORE_LOCATION = {
  latitude: -31.402824695487222,
  longitude: -64.24479778959648,
} as const;

const FREE_DELIVERY_RADIUS_KM = 2;
const MAX_DELIVERY_ROUTE_KM = 10;
const SMALL_CAR_KM_PER_LITER = 10;
const FUEL_PRICE_PER_LITER = 2500;
const DELIVERY_ROUNDING_STEP = 500;

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

function calculatePaidDeliveryCost(routeDistanceKm: number) {
  const roundTripFuelCost = (
    (routeDistanceKm * 2) / SMALL_CAR_KM_PER_LITER
  ) * FUEL_PRICE_PER_LITER;

  return Math.ceil(roundTripFuelCost / DELIVERY_ROUNDING_STEP)
    * DELIVERY_ROUNDING_STEP;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Método no permitido." }, 405);
  }

  try {
    const payload = await request.json() as { street?: unknown };
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
    const destinationLat = match ? Number(match.lat) : NaN;
    const destinationLon = match ? Number(match.lon) : NaN;

    if (!match || Number.isNaN(destinationLat) || Number.isNaN(destinationLon)) {
      return jsonResponse({ error: "No encontramos esa dirección. Revisá que esté bien escrita." }, 404);
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
    };

    if (radialDistanceKm <= FREE_DELIVERY_RADIUS_KM) {
      return jsonResponse({
        ...responseBase,
        available: true,
        free: true,
        cost: 0,
      });
    }

    if (routeDistanceKm > MAX_DELIVERY_ROUTE_KM) {
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
      free: false,
      cost: calculatePaidDeliveryCost(routeDistanceKm),
    });
  } catch (error) {
    console.error("Error inesperado calculando el envío", error);
    return jsonResponse({ error: "Hubo un error calculando el envío. Intentá de nuevo." }, 500);
  }
});
