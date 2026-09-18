// Cargador de Leaflet vía CDN.
//
// El proyecto no tiene `leaflet`/`react-leaflet` como dependencia de npm:
// se carga en runtime desde un CDN (como ya se hace con las fuentes de
// Google Fonts), así no hace falta agregar un paquete nuevo ni tocar el
// bundle para algo que solo se usa en el paso de delivery del checkout.
//
// Se inyecta una sola vez y se cachea la promesa para que abrir/cerrar el
// carrito varias veces no vuelva a descargar el script.

declare global {
  interface Window {
    L?: any;
  }
}

const LEAFLET_VERSION = "1.9.4";
const LEAFLET_CSS_URL = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;
const LEAFLET_JS_URL = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;

let leafletPromise: Promise<any> | null = null;

function ensureStylesheet() {
  if (document.querySelector(`link[data-leaflet-css]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = LEAFLET_CSS_URL;
  link.setAttribute("data-leaflet-css", "true");
  document.head.appendChild(link);
}

export function loadLeaflet(): Promise<any> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Leaflet solo puede cargarse en el navegador."));
  }

  if (window.L) {
    return Promise.resolve(window.L);
  }

  if (leafletPromise) {
    return leafletPromise;
  }

  leafletPromise = new Promise((resolve, reject) => {
    ensureStylesheet();

    const existingScript = document.querySelector<HTMLScriptElement>("script[data-leaflet-js]");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.L));
      existingScript.addEventListener("error", () => reject(new Error("No se pudo cargar el mapa.")));
      return;
    }

    const script = document.createElement("script");
    script.src = LEAFLET_JS_URL;
    script.async = true;
    script.setAttribute("data-leaflet-js", "true");
    script.onload = () => {
      if (window.L) {
        resolve(window.L);
      } else {
        reject(new Error("Leaflet no se inicializó correctamente."));
      }
    };
    script.onerror = () => reject(new Error("No se pudo cargar el mapa."));
    document.head.appendChild(script);
  }).catch((error) => {
    // Si falló, no dejamos la promesa cacheada — permitimos reintentar
    // (por ejemplo si fue un problema de red momentáneo).
    leafletPromise = null;
    throw error;
  });

  return leafletPromise;
}
