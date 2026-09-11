import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Award, CalendarDays, ShoppingBag } from "lucide-react";
import { fetchResumen } from "@/services/admin";

const money = (value: number) => `$${value.toLocaleString("es-AR")}`;

export default function ResumenPanel({ onVerPedidos }: { onVerPedidos: () => void }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["resumen", "admin"],
    queryFn: fetchResumen,
    refetchInterval: 60_000,
  });

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900">Resumen</h2>
        <p className="text-sm text-gray-500">Un vistazo rápido a cómo viene el negocio</p>
      </div>

      {isLoading && <p className="p-6 text-center text-gray-500">Cargando resumen…</p>}
      {error && <p className="p-6 text-center text-red-700">No se pudo cargar el resumen.</p>}

      {data && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border bg-white p-5">
            <div className="flex items-center gap-2 text-gray-400"><CalendarDays size={18} /><p className="text-xs font-bold uppercase">Ventas de hoy</p></div>
            <p className="mt-3 text-2xl font-black text-gray-900">{money(data.ventasHoy.total)}</p>
            <p className="mt-1 text-sm text-gray-500">{data.ventasHoy.cantidadPedidos} pedido{data.ventasHoy.cantidadPedidos === 1 ? "" : "s"}</p>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <div className="flex items-center gap-2 text-gray-400"><CalendarDays size={18} /><p className="text-xs font-bold uppercase">Ventas de la semana</p></div>
            <p className="mt-3 text-2xl font-black text-gray-900">{money(data.ventasSemana.total)}</p>
            <p className="mt-1 text-sm text-gray-500">{data.ventasSemana.cantidadPedidos} pedido{data.ventasSemana.cantidadPedidos === 1 ? "" : "s"} · últimos 7 días</p>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <div className="flex items-center gap-2 text-gray-400"><Award size={18} /><p className="text-xs font-bold uppercase">Más vendido (semana)</p></div>
            {data.masVendidoSemana ? (
              <>
                <p className="mt-3 text-lg font-black text-gray-900">{data.masVendidoSemana.nombre}</p>
                <p className="mt-1 text-sm text-gray-500">{data.masVendidoSemana.cantidad} unidades vendidas</p>
              </>
            ) : (
              <p className="mt-3 text-sm text-gray-500">Todavía no hay ventas esta semana.</p>
            )}
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <div className="flex items-center gap-2 text-gray-400"><AlertCircle size={18} /><p className="text-xs font-bold uppercase">Pedidos pendientes</p></div>
            <p className="mt-3 text-2xl font-black text-gray-900">{data.pedidosPendientes}</p>
            <button onClick={onVerPedidos} className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
              <ShoppingBag size={15} /> Ver pedidos
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
