import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, MessageCircle, RefreshCw, Search } from "lucide-react";
import { fetchClientes } from "@/services/admin";
import { downloadCsv, toCsv } from "@/lib/csv";
import type { Cliente } from "@/types/store";

const money = (value: number) => `$${value.toLocaleString("es-AR")}`;

function whatsappPhone(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (!digits.startsWith("54")) digits = `549${digits}`;
  return digits;
}

function exportClientesCsv(clientes: Cliente[]) {
  const headers = ["Nombre", "Teléfono", "Cantidad de pedidos", "Último pedido", "Total gastado"];
  const rows = clientes.map((cliente) => [
    cliente.nombre || "Sin nombre",
    cliente.telefono,
    cliente.cantidad_pedidos,
    new Date(cliente.ultimo_pedido).toLocaleDateString("es-AR"),
    cliente.total_gastado,
  ]);
  downloadCsv(`clientes-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(headers, rows));
}

export default function ClientsPanel() {
  const [search, setSearch] = useState("");
  const { data: clientes = [], isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["clientes", "admin"],
    queryFn: fetchClientes,
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return clientes;
    return clientes.filter(
      (cliente) =>
        cliente.nombre?.toLowerCase().includes(term) ||
        cliente.telefono?.toLowerCase().includes(term),
    );
  }, [search, clientes]);

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Clientes</h2>
          <p className="text-sm text-gray-500">
            {clientes.length} clientes con al menos un pedido registrado
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportClientesCsv(filtered)}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-3 font-bold disabled:opacity-50"
          >
            <Download size={18} /> Exportar CSV
          </button>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-3 font-bold"
          >
            <RefreshCw size={18} className={isFetching ? "animate-spin" : ""} /> Actualizar
          </button>
        </div>
      </div>

      <div className="mb-5 relative">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nombre o teléfono…"
          className="w-full rounded-xl border bg-white py-3 pl-11 pr-4 font-normal outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {isLoading && <p className="p-6 text-center text-gray-500">Cargando clientes…</p>}
      {error && <p className="p-6 text-center text-red-700">No se pudieron cargar los clientes.</p>}
      {!isLoading && !error && filtered.length === 0 && (
        <p className="rounded-2xl border bg-white p-8 text-center text-gray-500">
          {clientes.length === 0 ? "Todavía no hay pedidos registrados." : "No hay clientes que coincidan con la búsqueda."}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border bg-white">
        {filtered.map((cliente, index) => (
          <div
            key={cliente.telefono}
            className={`grid items-center gap-3 p-4 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto] ${index !== 0 ? "border-t" : ""}`}
          >
            <div>
              <p className="font-bold text-gray-900">{cliente.nombre || "Sin nombre"}</p>
              <p className="text-sm text-gray-500">{cliente.telefono}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-gray-400">Pedidos</p>
              <p className="font-semibold text-gray-900">{cliente.cantidad_pedidos}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-gray-400">Último pedido</p>
              <p className="font-semibold text-gray-900">
                {new Date(cliente.ultimo_pedido).toLocaleDateString("es-AR")}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-gray-400">Total histórico</p>
              <p className="font-black text-primary">{money(cliente.total_gastado)}</p>
            </div>
            <a
              href={`https://wa.me/${whatsappPhone(cliente.telefono)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 justify-self-start rounded-xl bg-[#25D366] px-4 py-2.5 font-bold text-white md:justify-self-end"
            >
              <MessageCircle size={18} /> WhatsApp
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
