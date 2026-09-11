import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Download, MessageCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { fetchPedidos, updatePedidoEstado } from "@/services/admin";
import { downloadCsv, toCsv } from "@/lib/csv";
import type { EstadoPedido, Pedido } from "@/types/store";

const estados: EstadoPedido[] = [
  "pendiente", "confirmado", "en preparación", "en camino", "entregado", "cancelado",
];

const estadoClasses: Record<EstadoPedido, string> = {
  pendiente: "bg-amber-100 text-amber-800",
  confirmado: "bg-blue-100 text-blue-800",
  "en preparación": "bg-violet-100 text-violet-800",
  "en camino": "bg-cyan-100 text-cyan-800",
  entregado: "bg-emerald-100 text-emerald-800",
  cancelado: "bg-red-100 text-red-800",
};

const money = (value: number) => `$${value.toLocaleString("es-AR")}`;

function whatsappPhone(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (!digits.startsWith("54")) digits = `549${digits}`;
  return digits;
}

function exportPedidosCsv(orders: Pedido[]) {
  const headers = [
    "Número de pedido", "Fecha", "Cliente", "Teléfono", "Método de entrega", "Dirección",
    "Método de pago", "Subtotal", "Costo de envío", "Total", "Estado", "Notas", "Productos",
  ];
  const rows = orders.map((order) => [
    order.numero_pedido,
    new Date(order.fecha).toLocaleString("es-AR"),
    order.cliente_nombre,
    order.cliente_telefono,
    order.metodo_entrega,
    order.direccion_completa || "Retiro en el local",
    order.metodo_pago,
    order.subtotal,
    order.costo_envio,
    order.total,
    order.estado,
    order.notas || "",
    order.productos.map((item) => `${item.cantidad}x ${item.nombre}`).join(" | "),
  ]);
  downloadCsv(`pedidos-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(headers, rows));
}

export default function OrdersPanel({ isOwner }: { isOwner: boolean }) {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"todos" | EstadoPedido>("todos");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] = useState<{
    id: string;
    numeroPedido: string;
    actual: EstadoPedido;
    nuevo: EstadoPedido;
  } | null>(null);
  const { data: orders = [], isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["pedidos", "admin"],
    queryFn: fetchPedidos,
    refetchInterval: 60_000,
  });

  const filtered = useMemo(
    () => filter === "todos" ? orders : orders.filter((order) => order.estado === filter),
    [filter, orders],
  );

  const updateMutation = useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: EstadoPedido }) => updatePedidoEstado(id, estado),
    onSuccess: () => {
      setPendingStatus(null);
      toast.success("Estado del pedido actualizado.");
      return queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    },
    onError: () => {
      setPendingStatus(null);
      toast.error("No se pudo actualizar el pedido. Se conservó el estado anterior.");
    },
  });

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div><h2 className="text-2xl font-black text-gray-900">Pedidos</h2><p className="text-sm text-gray-500">Últimos {orders.length} pedidos</p></div>
        <div className="flex gap-2">
          {isOwner && <button onClick={() => exportPedidosCsv(filtered)} disabled={filtered.length === 0} className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-3 font-bold disabled:opacity-50"><Download size={18} /> Exportar CSV</button>}
          <button onClick={() => refetch()} disabled={isFetching} className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-3 font-bold"><RefreshCw size={18} className={isFetching ? "animate-spin" : ""} /> Actualizar</button>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {(["todos", ...estados] as const).map((state) => (
          <button key={state} onClick={() => setFilter(state)} className={`rounded-full px-4 py-2 text-sm font-bold ${filter === state ? "bg-primary text-white" : "border bg-white text-gray-600"}`}>{state}</button>
        ))}
      </div>

      {isLoading && <p className="p-6 text-center text-gray-500">Cargando pedidos…</p>}
      {error && <p className="p-6 text-center text-red-700">No se pudieron cargar los pedidos.</p>}
      {!isLoading && !error && filtered.length === 0 && <p className="rounded-2xl border bg-white p-8 text-center text-gray-500">No hay pedidos con este estado.</p>}

      <div className="space-y-3">
        {filtered.map((order) => {
          const isExpanded = expanded === order.id;
          return (
            <article key={order.id} className="overflow-hidden rounded-2xl border bg-white">
              <div className="grid items-center gap-3 p-4 md:grid-cols-[1fr_1.3fr_1fr_1fr_auto]">
                <div><p className="text-xs font-bold uppercase text-gray-400">Pedido</p><p className="font-black text-gray-900">#{order.numero_pedido}</p><p className="text-xs text-gray-500">{new Date(order.fecha).toLocaleString("es-AR")}</p></div>
                <div><p className="font-bold text-gray-900">{order.cliente_nombre}</p><p className="text-sm text-gray-500">{order.cliente_telefono}</p></div>
                <div><p className="text-xs font-bold uppercase text-gray-400">Entrega</p><p className="font-semibold">{order.metodo_entrega}</p></div>
                <div><p className="text-xs font-bold uppercase text-gray-400">Total</p><p className="text-lg font-black text-primary">{money(order.total)}</p><span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-black capitalize ${estadoClasses[order.estado]}`}>{order.estado}</span></div>
                <button onClick={() => setExpanded(isExpanded ? null : order.id)} className="justify-self-end rounded-lg border p-2" aria-label="Ver detalle">{isExpanded ? <ChevronUp /> : <ChevronDown />}</button>
              </div>

              {isExpanded && (
                <div className="border-t bg-gray-50 p-5">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div><h3 className="font-black text-gray-900">Productos</h3><div className="mt-3 space-y-2">{order.productos.map((item, index) => <div key={`${item.nombre}-${index}`} className="flex justify-between gap-4 text-sm"><span>{item.cantidad} × {item.nombre}</span><strong>{money(item.precio * item.cantidad)}</strong></div>)}</div><div className="mt-4 border-t pt-3 text-sm"><div className="flex justify-between"><span>Subtotal</span><strong>{money(order.subtotal)}</strong></div><div className="flex justify-between"><span>Envío</span><strong>{money(order.costo_envio)}</strong></div></div></div>
                    <div><h3 className="font-black text-gray-900">Datos</h3><dl className="mt-3 space-y-2 text-sm"><div><dt className="font-bold text-gray-500">Dirección</dt><dd>{order.direccion_completa || "Retiro en el local"}</dd></div><div><dt className="font-bold text-gray-500">Pago</dt><dd>{order.metodo_pago}</dd></div><div><dt className="font-bold text-gray-500">Notas</dt><dd>{order.notas || "Sin notas"}</dd></div></dl><a href={`https://wa.me/${whatsappPhone(order.cliente_telefono)}`} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 font-bold text-white"><MessageCircle size={18} /> Contactar cliente</a></div>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-3 border-t pt-4"><label className="text-sm font-bold text-gray-700">Estado:</label><select value={order.estado} disabled={updateMutation.isPending} onChange={(event) => { const nuevo = event.target.value as EstadoPedido; if (nuevo !== order.estado) setPendingStatus({ id: order.id, numeroPedido: order.numero_pedido, actual: order.estado, nuevo }); }} className="rounded-xl border bg-white px-4 py-2.5 font-bold">{estados.map((state) => <option key={state}>{state}</option>)}</select></div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {pendingStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-status-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 id="confirm-status-title" className="text-xl font-black text-gray-900">Confirmar cambio de estado</h3>
            <p className="mt-2 text-sm text-gray-600">Pedido #{pendingStatus.numeroPedido}</p>
            <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
              <div><p className="text-xs font-bold uppercase text-gray-400">Estado actual</p><p className="mt-1 font-black capitalize text-gray-900">{pendingStatus.actual}</p></div>
              <span aria-hidden="true" className="text-gray-400">→</span>
              <div><p className="text-xs font-bold uppercase text-gray-400">Nuevo estado</p><p className="mt-1 font-black capitalize text-primary">{pendingStatus.nuevo}</p></div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" disabled={updateMutation.isPending} onClick={() => setPendingStatus(null)} className="rounded-xl border px-4 py-2.5 font-bold text-gray-700">Cancelar</button>
              <button type="button" disabled={updateMutation.isPending} onClick={() => updateMutation.mutate({ id: pendingStatus.id, estado: pendingStatus.nuevo })} className="rounded-xl bg-primary px-4 py-2.5 font-bold text-white disabled:opacity-60">{updateMutation.isPending ? "Guardando…" : "Confirmar cambio"}</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
