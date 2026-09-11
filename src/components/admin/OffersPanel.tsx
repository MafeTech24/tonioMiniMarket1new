import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  deleteOferta,
  fetchAdminOfertas,
  saveOferta,
  setOfertaActiva,
  uploadCatalogImage,
  type OfertaInput,
} from "@/services/admin";
import type { Oferta } from "@/types/store";

const categorias = [
  "Almacén",
  "Bebidas",
  "Comidas listas",
  "Congelados",
  "Kiosco",
  "Limpieza y Perfumería",
  "Panificación",
  "Pollería",
] as const;

interface Draft {
  id?: number;
  nombre: string;
  precioAnterior: string;
  precioActual: string;
  desc: string;
  img: string;
  stock: string;
  categoria: string;
  activa: boolean;
  fechaInicio: string;
  fechaFin: string;
  orden: string;
}

const emptyDraft = (): Draft => ({
  nombre: "",
  precioAnterior: "",
  precioActual: "",
  desc: "",
  img: "",
  stock: "0",
  categoria: "Almacén",
  activa: true,
  fechaInicio: "",
  fechaFin: "",
  orden: "0",
});

const toDraft = (offer: Oferta): Draft => ({
  id: offer.id,
  nombre: offer.nombre,
  precioAnterior: String(offer.precioAnterior),
  precioActual: String(offer.precioActual),
  desc: offer.desc,
  img: offer.img,
  stock: String(offer.stock),
  categoria: offer.categoria,
  activa: offer.activa,
  fechaInicio: offer.fechaInicio || "",
  fechaFin: offer.fechaFin || "",
  orden: String(offer.orden),
});

type OfferStatus = "Activa" | "Inactiva" | "Futura" | "Vencida";

const getOfferStatus = (offer: Oferta): OfferStatus => {
  if (!offer.activa) return "Inactiva";

  const today = new Date().toISOString().slice(0, 10);
  if (offer.fechaInicio && offer.fechaInicio > today) return "Futura";
  if (offer.fechaFin && offer.fechaFin < today) return "Vencida";
  return "Activa";
};

const offerStatusClasses: Record<OfferStatus, string> = {
  Activa: "bg-green-100 text-green-800",
  Inactiva: "bg-gray-200 text-gray-600",
  Futura: "bg-blue-100 text-blue-800",
  Vencida: "bg-amber-100 text-amber-800",
};

export default function OffersPanel() {
  const queryClient = useQueryClient();
  const { data: offers = [], isLoading, error } = useQuery({
    queryKey: ["ofertas", "admin"],
    queryFn: fetchAdminOfertas,
  });
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Oferta | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("es");
    return term
      ? offers.filter((offer) => `${offer.nombre} ${offer.categoria}`.toLocaleLowerCase("es").includes(term))
      : offers;
  }, [offers, search]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!draft) return;

      const nombre = draft.nombre.trim();
      const descripcion = draft.desc.trim();
      const precioAnterior = Number(draft.precioAnterior);
      const precioActual = Number(draft.precioActual);
      const stock = Number(draft.stock);

      if (!nombre || !descripcion || !categorias.includes(draft.categoria as typeof categorias[number])) {
        throw new Error("Completá el nombre, la descripción y una categoría válida.");
      }
      if (!Number.isFinite(precioAnterior) || !Number.isFinite(precioActual) || precioAnterior <= 0 || precioActual <= 0) {
        throw new Error("Los precios deben ser números positivos.");
      }
      if (precioActual >= precioAnterior) {
        throw new Error("El precio promocional debe ser menor que el precio anterior.");
      }
      if (!Number.isInteger(stock) || stock < 0) {
        throw new Error("El stock debe ser un número entero igual o mayor que cero.");
      }
      if (draft.fechaInicio && draft.fechaFin && draft.fechaFin < draft.fechaInicio) {
        throw new Error("La fecha de finalización no puede ser anterior a la fecha de inicio.");
      }
      if (!imageFile && !draft.img.trim()) {
        throw new Error("Seleccioná una imagen o indicá su URL.");
      }

      let image = draft.img;
      if (imageFile) image = await uploadCatalogImage(imageFile, "ofertas");

      const input: OfertaInput = {
        id: draft.id,
        nombre,
        precioAnterior,
        precioActual,
        desc: descripcion,
        img: image,
        stock,
        categoria: draft.categoria,
        activa: draft.activa,
        fechaInicio: draft.fechaInicio || undefined,
        fechaFin: draft.fechaFin || undefined,
        orden: Number(draft.orden) || 0,
      };

      await saveOferta(input);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ofertas"] });
      setDraft(null);
      setImageFile(null);
      toast.success("Oferta guardada.");
    },
    onError: (mutationError: Error) => toast.error(mutationError.message),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, activa }: { id: number; activa: boolean }) => setOfertaActiva(id, activa),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ofertas"] }),
    onError: () => toast.error("No se pudo cambiar el estado de la oferta."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteOferta(id),
    onSuccess: async () => {
      setPendingDelete(null);
      await queryClient.invalidateQueries({ queryKey: ["ofertas"] });
      toast.success("Oferta eliminada.");
    },
    onError: (mutationError: Error) => {
      setPendingDelete(null);
      toast.error(mutationError.message || "No se pudo eliminar la oferta.");
    },
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    saveMutation.mutate();
  };

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div><h2 className="text-2xl font-black text-gray-900">Ofertas</h2><p className="text-sm text-gray-500">{offers.length} promociones registradas</p></div>
        <button onClick={() => setDraft(emptyDraft())} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 font-bold text-white"><Plus size={18} /> Nueva oferta</button>
      </div>

      <label className="mb-5 flex items-center gap-3 rounded-xl border bg-white px-4 py-3"><Search size={18} className="text-gray-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar oferta…" className="w-full outline-none" /></label>
      {isLoading && <p className="p-6 text-center text-gray-500">Cargando ofertas…</p>}
      {error && <p className="p-6 text-center text-red-700">No se pudieron cargar las ofertas.</p>}

      {!isLoading && !error && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((offer) => (
            <article key={offer.id} className={`rounded-2xl border bg-white p-4 ${getOfferStatus(offer) === "Activa" ? "" : "opacity-70"}`}>
              <img src={offer.img} alt="" className="h-44 w-full rounded-xl bg-gray-100 object-contain" />
              <div className="mt-4 flex items-start justify-between gap-3"><h3 className="font-black text-gray-900">{offer.nombre}</h3><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${offerStatusClasses[getOfferStatus(offer)]}`}>{getOfferStatus(offer)}</span></div>
              <div className="mt-2 flex items-center gap-2"><span className="text-xl font-black text-primary">${offer.precioActual.toLocaleString("es-AR")}</span><span className="text-sm text-gray-400 line-through">${offer.precioAnterior.toLocaleString("es-AR")}</span></div>
              <p className="mt-1 text-sm text-gray-500">Stock: {offer.stock} · {offer.categoria}</p>
              <div className="mt-4 flex gap-2"><button onClick={() => setDraft(toDraft(offer))} className="flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 font-bold"><Pencil size={16} /> Editar</button><button onClick={() => toggleMutation.mutate({ id: offer.id, activa: !offer.activa })} className="rounded-xl border px-3 py-2 text-xs font-bold">{offer.activa ? "Desactivar" : "Activar"}</button><button onClick={() => setPendingDelete(offer)} className="rounded-xl border border-red-200 p-2 text-red-600 hover:bg-red-50" title="Eliminar"><Trash2 size={16} /></button></div>
            </article>
          ))}
        </div>
      )}

      {draft && (
        <div className="fixed inset-0 z-[120] grid place-items-center bg-black/55 p-3" role="dialog" aria-modal="true">
          <form onSubmit={submit} className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between"><h3 className="text-2xl font-black">{draft.id ? "Editar oferta" : "Nueva oferta"}</h3><button type="button" onClick={() => setDraft(null)} className="rounded-full p-2 hover:bg-gray-100"><X /></button></div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Nombre"><input required value={draft.nombre} onChange={(e) => setDraft({ ...draft, nombre: e.target.value })} /></Field>
              <Field label="Categoría"><select required value={draft.categoria} onChange={(e) => setDraft({ ...draft, categoria: e.target.value })}>{categorias.map((item) => <option key={item}>{item}</option>)}</select></Field>
              <Field label="Precio anterior"><input required type="number" min="0" value={draft.precioAnterior} onChange={(e) => setDraft({ ...draft, precioAnterior: e.target.value })} /></Field>
              <Field label="Precio promocional"><input required type="number" min="0" value={draft.precioActual} onChange={(e) => setDraft({ ...draft, precioActual: e.target.value })} /></Field>
              <Field label="Stock"><input required type="number" min="0" step="1" value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: e.target.value })} /></Field>
              <Field label="Orden"><input type="number" min="0" value={draft.orden} onChange={(e) => setDraft({ ...draft, orden: e.target.value })} /></Field>
              <Field label="Fecha de inicio"><input type="date" value={draft.fechaInicio} onChange={(e) => setDraft({ ...draft, fechaInicio: e.target.value })} /></Field>
              <Field label="Fecha de finalización"><input type="date" value={draft.fechaFin} onChange={(e) => setDraft({ ...draft, fechaFin: e.target.value })} /></Field>
              <div className="md:col-span-2"><Field label="Descripción del combo"><textarea rows={4} required value={draft.desc} onChange={(e) => setDraft({ ...draft, desc: e.target.value })} /></Field></div>
              <div className="md:col-span-2"><Field label="URL de imagen"><input value={draft.img} onChange={(e) => setDraft({ ...draft, img: e.target.value })} /></Field></div>
              <label className="md:col-span-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 font-bold text-gray-600"><ImagePlus size={20} />{imageFile ? imageFile.name : "Seleccionar una imagen nueva"}<input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} /></label>
              <label className="md:col-span-2 flex items-center gap-2 rounded-xl bg-gray-50 p-4 font-bold"><input type="checkbox" checked={draft.activa} onChange={(e) => setDraft({ ...draft, activa: e.target.checked })} />Oferta activa</label>
            </div>
            <div className="mt-7 flex justify-end gap-3"><button type="button" onClick={() => setDraft(null)} className="rounded-xl border px-5 py-3 font-bold">Cancelar</button><button type="submit" disabled={saveMutation.isPending} className="rounded-xl bg-primary px-6 py-3 font-black text-white disabled:opacity-60">{saveMutation.isPending ? "Guardando…" : "Guardar oferta"}</button></div>
          </form>
        </div>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-delete-oferta-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 id="confirm-delete-oferta-title" className="text-xl font-black text-gray-900">Eliminar oferta</h3>
            <p className="mt-2 text-sm text-gray-600">
              ¿Seguro que querés eliminar <strong>{pendingDelete.nombre}</strong>? Esta acción no se puede deshacer. Si sólo querés dejar de mostrarla en la tienda sin perderla, usá "Desactivar" en vez de esto.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" disabled={deleteMutation.isPending} onClick={() => setPendingDelete(null)} className="rounded-xl border px-4 py-2.5 font-bold text-gray-700">Cancelar</button>
              <button type="button" disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate(pendingDelete.id)} className="rounded-xl bg-red-600 px-4 py-2.5 font-bold text-white disabled:opacity-60">{deleteMutation.isPending ? "Eliminando…" : "Eliminar definitivamente"}</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-sm font-bold text-gray-700">{label}<div className="mt-1 [&>*]:w-full [&>*]:rounded-xl [&>*]:border [&>*]:px-3 [&>*]:py-2.5 [&>*]:font-normal [&>*]:outline-none focus-within:[&>*]:ring-2 focus-within:[&>*]:ring-primary/25">{children}</div></label>;
}
