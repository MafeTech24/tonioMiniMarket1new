import { useEffect, useRef, useState } from "react";
import { loadLeaflet } from "@/lib/leafletLoader";

export type LatLng = { lat: number; lng: number };

interface LocationPickerProps {
  /** Posición inicial del pin (guess por dirección, o el local si no hay guess). */
  position: LatLng;
  /** Se dispara cada vez que el cliente suelta el pin en un nuevo lugar. */
  onChange: (position: LatLng) => void;
  height?: number;
}

export function LocationPicker({ position, onChange, height = 260 }: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  // Montaje del mapa: se hace una sola vez.
  useEffect(() => {
    let cancelled = false;

    loadLeaflet()
      .then((L) => {
        if (cancelled || !containerRef.current || mapRef.current) return;

        const map = L.map(containerRef.current, {
          center: [position.lat, position.lng],
          zoom: 16,
          scrollWheelZoom: false,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        const marker = L.marker([position.lat, position.lng], { draggable: true }).addTo(map);
        marker.on("dragend", () => {
          const { lat, lng } = marker.getLatLng();
          onChangeRef.current({ lat, lng });
        });

        mapRef.current = map;
        markerRef.current = marker;
        setStatus("ready");
      })
      .catch((error) => {
        console.error("No se pudo cargar el mapa de ubicación:", error);
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
    // Solo al montar: recentrar ante cambios de `position` lo maneja el efecto de abajo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Si llega un nuevo guess (ej: el cliente volvió a buscar otra calle),
  // recentramos el mapa y movemos el pin sin recrear todo.
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      mapRef.current.setView([position.lat, position.lng]);
      markerRef.current.setLatLng([position.lat, position.lng]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position.lat, position.lng]);

  if (status === "error") {
    return (
      <div className="rounded-md border border-red-100 bg-red-50/30 p-3 text-sm font-semibold text-[#E65100]">
        No pudimos cargar el mapa. Revisá tu conexión y volvé a intentar.
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        style={{ height }}
        className="w-full rounded-md overflow-hidden border border-border"
      />
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/70 rounded-md text-sm font-semibold text-muted-foreground">
          Cargando mapa...
        </div>
      )}
    </div>
  );
}
