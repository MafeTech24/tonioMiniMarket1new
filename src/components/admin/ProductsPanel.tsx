import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  deleteProducto,
  fetchAdminProductos,
  saveProducto,
  setProductoActivo,
  uploadCatalogImage,
  type ProductoInput,
} from "@/services/admin";
import type { Producto } from "@/types/store";

const subcategoriasPorCategoria: Record<string, readonly string[]> = {
  "Almacén": [
    "",
    "Aderezos",
    "Condimentos",
    "Conservas",
    "Desayuno",
    "Fiambres",
    "Lácteos",
    "Pastas frescas y secas",
  ],
  "Bebidas": ["Con alcohol", "Sin alcohol"],
  "Comidas listas": [""],
  "Congelados": [""],
  "Kiosco": [""],
  "Limpieza y Perfumería": [""],
  "Panificación": [""],
  "Pollería": [""],
};

const categorias = Object.keys(subcategoriasPorCategoria);

interface Draft {
  id?: number;
  nombre: string;
  precio: string;
  imagen: string;
  categoria: string;
  subcategoria: string;
  descripcion: string;
  stock: string;
  unidadPrecio: string;
  esAGranel: boolean;
  esFactura: boolean;
  esEmpanada: boolean;
  sabores: string;
  presentaciones: string;
  precioUnidad: string;
  precioMediaDocena: string;
  precioDocena: string;
  activo: boolean;
  orden: string;
}

const emptyDraft = (): Draft => ({
  nombre: "",
  precio: "",
  imagen: "",
  categoria: "Almacén",
  subcategoria: "",
  descripcion: "",
  stock: "0",
  unidadPrecio: "",
  esAGranel: false,
  esFactura: false,
  esEmpanada: false,
  sabores: "",
  presentaciones: "",
  precioUnidad: "",
  precioMediaDocena: "",
  precioDocena: "",
  activo: true,
  orden: "0",
});

const toDraft = (product: Producto): Draft => ({
  id: product.id,
  nombre: product.nombre,
  precio: String(product.precio),
  imagen: product.imagen,
  categoria: product.categoria,
  subcategoria: product.subcategoria || "",
  descripcion: product.descripcion,
  stock: String(product.stock),
  unidadPrecio: product.unidadPrecio || "",
  esAGranel: Boolean(product.esAGranel),
  esFactura: Boolean(product.esFactura),
  esEmpanada: Boolean(product.esEmpanada),
  sabores: product.sabores?.join(", ") || "",
  presentaciones: product.presentaciones?.map((item) => `${item.nombre} | ${item.precio}`).join("\n") || "",
  precioUnidad: product.preciosMultiples ? String(product.preciosMultiples.unidad) : "",
  precioMediaDocena: product.preciosMultiples ? String(product.preciosMultiples.mediaDocena) : "",
  precioDocena: product.preciosMultiples ? String(product.preciosMultiples.docena) : "",
  activo: product.activo,
  orden: String(product.orden),
});

function parsePresentaciones(value: string) {
  if (!value.trim()) return undefined;
  return value.split("\n").filter(Boolean).map((line) => {
    const [nombre, precio] = line.split("|").map((part) => part.trim());
    if (!nombre || !precio || Number.isNaN(Number(precio))) {
      throw new Error("Usá una presentación por línea con el formato Nombre | Precio.");
    }
    return { nombre, precio: Number(precio) };
  });
}

export default function ProductsPanel() {
  const queryClient = useQueryClient();
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["productos", "admin"],
    queryFn: fetchAdminProductos,
  });
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Producto | null>(null);
  const subcategoriasDisponibles = draft
    ? subcategoriasPorCategoria[draft.categoria] || []
    : [];

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("es");
    if (!term) return products;
    return products.filter((product) =>
      `${product.nombre} ${product.categoria} ${product.subcategoria || ""}`
        .toLocaleLowerCase("es")
        .includes(term),
    );
  }, [products, search]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!draft) return;
      const subcategoriasValidas = subcategoriasPorCategoria[draft.categoria];
      if (!subcategoriasValidas?.includes(draft.subcategoria)) {
        throw new Error("Seleccioná una combinación válida de categoría y subcategoría.");
      }

      let imagen = draft.imagen;
      if (imageFile) imagen = await uploadCatalogImage(imageFile, "productos");
      if (!imagen) throw new Error("Seleccioná una imagen o indicá su URL.");

      const preciosMultiples = draft.precioUnidad && draft.precioMediaDocena && draft.precioDocena
        ? {
            unidad: Number(draft.precioUnidad),
            mediaDocena: Number(draft.precioMediaDocena),
            docena: Number(draft.precioDocena),
          }
        : undefined;

      const input: ProductoInput = {
        id: draft.id,
        nombre: draft.nombre,
        precio: Number(draft.precio),
        imagen,
        categoria: draft.categoria,
        subcategoria: draft.subcategoria || undefined,
        descripcion: draft.descripcion,
        stock: Number(draft.stock),
        unidadPrecio: draft.unidadPrecio || undefined,
        esAGranel: draft.esAGranel,
        esFactura: draft.esFactura,
        esEmpanada: draft.esEmpanada,
        preciosMultiples,
        sabores: draft.sabores.split(",").map((item) => item.trim()).filter(Boolean),
        presentaciones: parsePresentaciones(draft.presentaciones),
        activo: draft.activo,
        orden: Number(draft.orden) || 0,
      };
      if (!input.nombre.trim() || !Number.isFinite(input.precio) || input.precio < 0) {
        throw new Error("Completá un nombre y un precio válido.");
      }
      if (!Number.isInteger(input.stock) || input.stock < 0) {
        throw new Error("El stock debe ser un número entero igual o mayor que cero.");
      }
      await saveProducto(input);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["productos"] });
      setDraft(null);
      setImageFile(null);
      toast.success("Producto guardado.");
    },
    onError: (mutationError: Error) => toast.error(mutationError.message),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, activo }: { id: number; activo: boolean }) => setProductoActivo(id, activo),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["productos"] }),
    onError: () => toast.error("No se pudo cambiar el estado del producto."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProducto(id),
    onSuccess: async () => {
      setPendingDelete(null);
      await queryClient.invalidateQueries({ queryKey: ["productos"] });
      toast.success("Producto eliminado.");
    },
    onError: (mutationError: Error) => {
      setPendingDelete(null);
      toast.error(mutationError.message || "No se pudo eliminar el producto.");
    },
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    saveMutation.mutate();
  };

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Productos</h2>
          <p className="text-sm text-gray-500">{products.length} productos registrados</p>
        </div>
        <button onClick={() => setDraft(emptyDraft())} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 font-bold text-white">
          <Plus size={18} /> Nuevo producto
        </button>
      </div>

      <label className="mb-5 flex items-center gap-3 rounded-xl border bg-white px-4 py-3">
        <Search size={18} className="text-gray-400" />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar producto…" className="w-full outline-none" />
      </label>

      {isLoading && <p className="p-6 text-center text-gray-500">Cargando productos…</p>}
      {error && <p className="p-6 text-center text-red-700">No se pudieron cargar los productos.</p>}

      {!isLoading && !error && (
        <div className="overflow-x-auto rounded-2xl border bg-white">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr><th className="p-4">Producto</th><th>Precio</th><th>Stock</th><th>Categoría</th><th>Estado</th><th className="pr-4 text-right">Acciones</th></tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((product) => (
                <tr key={product.id} className={!product.activo ? "opacity-55" : ""}>
                  <td className="p-4"><div className="flex items-center gap-3"><img src={product.imagen} alt="" className="h-12 w-12 rounded-lg bg-gray-100 object-contain" /><div><p className="font-bold text-gray-900">{product.nombre}</p><p className="text-xs text-gray-400">ID {product.id}</p></div></div></td>
                  <td className="font-bold">${product.precio.toLocaleString("es-AR")}</td>
                  <td>{product.stock}</td>
                  <td>{product.categoria}</td>
                  <td><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${product.activo ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"}`}>{product.activo ? "Activo" : "Inactivo"}</span></td>
                  <td className="pr-4"><div className="flex justify-end gap-2"><button onClick={() => setDraft(toDraft(product))} className="rounded-lg border p-2" title="Editar"><Pencil size={17} /></button><button onClick={() => toggleMutation.mutate({ id: product.id, activo: !product.activo })} className="rounded-lg border px-3 py-2 text-xs font-bold">{product.activo ? "Desactivar" : "Activar"}</button><button onClick={() => setPendingDelete(product)} className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50" title="Eliminar"><Trash2 size={17} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {draft && (
        <div className="fixed inset-0 z-[120] grid place-items-center bg-black/55 p-3" role="dialog" aria-modal="true">
          <form onSubmit={submit} className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between"><h3 className="text-2xl font-black">{draft.id ? "Editar producto" : "Nuevo producto"}</h3><button type="button" onClick={() => setDraft(null)} className="rounded-full p-2 hover:bg-gray-100"><X /></button></div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Nombre" hint="Ej.: Coca-Cola 2.25L"><input required placeholder="Ej.: Coca-Cola 2.25L" value={draft.nombre} onChange={(e) => setDraft({ ...draft, nombre: e.target.value })} /></Field>
              <Field label="Precio" hint="En pesos, sin el símbolo $. Ej.: 2500"><input required type="number" min="0" step="1" placeholder="Ej.: 2500" value={draft.precio} onChange={(e) => setDraft({ ...draft, precio: e.target.value })} /></Field>
              <Field label="Stock" hint="Cantidad disponible. Si no controlás stock exacto, poné un número alto (ej.: 100)."><input required type="number" min="0" step="1" placeholder="Ej.: 20" value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: e.target.value })} /></Field>
              <Field label="Categoría" hint="La sección de la tienda donde va a aparecer el producto."><select value={draft.categoria} onChange={(e) => setDraft({ ...draft, categoria: e.target.value, subcategoria: "" })}>{categorias.map((item) => <option key={item}>{item}</option>)}</select></Field>
              <Field label="Subcategoría" hint="Sólo aplica a algunas categorías (por ejemplo, Bebidas).">
                <select required={draft.categoria === "Bebidas"} value={draft.subcategoria} onChange={(e) => setDraft({ ...draft, subcategoria: e.target.value })}>
                  {draft.categoria === "Bebidas" && <option value="">Seleccioná una subcategoría</option>}
                  {subcategoriasDisponibles.map((item) => <option key={item || "sin-subcategoria"} value={item}>{item || "Sin subcategoría"}</option>)}
                </select>
              </Field>
              <Field label="Unidad de precio" hint="Completalo sólo si el producto se vende a granel (tildado más abajo)."><input placeholder="Ej.: por kg o por 100 g" value={draft.unidadPrecio} onChange={(e) => setDraft({ ...draft, unidadPrecio: e.target.value })} /></Field>
              <Field label="Sabores (separados por coma)" hint="Dejalo vacío si el producto no tiene variantes de sabor."><input placeholder="Ej.: Vainilla, Chocolate, Dulce de leche" value={draft.sabores} onChange={(e) => setDraft({ ...draft, sabores: e.target.value })} /></Field>
              <div className="md:col-span-2"><Field label="Descripción" hint="Texto corto que ve el cliente en la tienda."><textarea rows={3} required placeholder="Ej.: Gaseosa cola, botella de 2.25 litros" value={draft.descripcion} onChange={(e) => setDraft({ ...draft, descripcion: e.target.value })} /></Field></div>
              <div className="md:col-span-2"><Field label="URL de imagen" hint="Sólo si ya tenés el link de una imagen subida a internet. Si no, usá el botón de abajo para subir una foto."><input placeholder="https://…" value={draft.imagen} onChange={(e) => setDraft({ ...draft, imagen: e.target.value })} /></Field></div>
              <label className="md:col-span-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 font-bold text-gray-600"><ImagePlus size={20} />{imageFile ? imageFile.name : "Seleccionar una imagen nueva"}<input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} /></label>
              <div className="md:col-span-2"><Field label="Presentaciones (una por línea: Nombre | Precio)" hint="Sólo si el producto tiene variantes con precios distintos (ej. tamaños). Formato por línea: Nombre | Precio. Ejemplo: 1L | 5900"><textarea rows={3} placeholder={"1L | 5900\nLATA | 3700"} value={draft.presentaciones} onChange={(e) => setDraft({ ...draft, presentaciones: e.target.value })} /></Field></div>
              <div className="md:col-span-2 grid grid-cols-3 gap-3"><Field label="Precio unidad" hint="Sólo para Facturas o Empanadas/combos."><input type="number" min="0" placeholder="Ej.: 200" value={draft.precioUnidad} onChange={(e) => setDraft({ ...draft, precioUnidad: e.target.value })} /></Field><Field label="Precio x6"><input type="number" min="0" placeholder="Ej.: 1100" value={draft.precioMediaDocena} onChange={(e) => setDraft({ ...draft, precioMediaDocena: e.target.value })} /></Field><Field label="Precio x12"><input type="number" min="0" placeholder="Ej.: 2000" value={draft.precioDocena} onChange={(e) => setDraft({ ...draft, precioDocena: e.target.value })} /></Field></div>
              <div className="md:col-span-2 rounded-xl bg-gray-50 p-4">
                <p className="mb-3 text-xs font-normal text-gray-500">Tildá lo que corresponda: si se vende suelto/por peso (a granel), si es una factura o una empanada/combo (se cobra por unidad, x6 o x12), y si el producto tiene que verse en la tienda (activo).</p>
                <div className="flex flex-wrap gap-5">{([['esAGranel','Venta a granel'],['esFactura','Facturas'],['esEmpanada','Empanadas/combos'],['activo','Producto activo']] as const).map(([key,label]) => <label key={key} className="flex items-center gap-2 font-semibold"><input type="checkbox" checked={draft[key]} onChange={(e) => setDraft({ ...draft, [key]: e.target.checked })} />{label}</label>)}</div>
              </div>
            </div>
            <div className="mt-7 flex justify-end gap-3"><button type="button" onClick={() => setDraft(null)} className="rounded-xl border px-5 py-3 font-bold">Cancelar</button><button type="submit" disabled={saveMutation.isPending} className="rounded-xl bg-primary px-6 py-3 font-black text-white disabled:opacity-60">{saveMutation.isPending ? "Guardando…" : "Guardar producto"}</button></div>
          </form>
        </div>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-delete-producto-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 id="confirm-delete-producto-title" className="text-xl font-black text-gray-900">Eliminar producto</h3>
            <p className="mt-2 text-sm text-gray-600">
              ¿Seguro que querés eliminar <strong>{pendingDelete.nombre}</strong>? Esta acción no se puede deshacer. Si sólo querés dejar de mostrarlo en la tienda sin perderlo, usá "Desactivar" en vez de esto.
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

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-bold text-gray-700">
      {label}
      <div className="mt-1 [&>*]:w-full [&>*]:rounded-xl [&>*]:border [&>*]:px-3 [&>*]:py-2.5 [&>*]:font-normal [&>*]:outline-none focus-within:[&>*]:ring-2 focus-within:[&>*]:ring-primary/25">{children}</div>
      {hint && <p className="mt-1 text-xs font-normal text-gray-400">{hint}</p>}
    </label>
  );
}
