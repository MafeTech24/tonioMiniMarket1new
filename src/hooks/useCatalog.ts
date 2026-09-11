import { useQuery } from "@tanstack/react-query";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { Oferta, PreciosMultiples, Presentacion, Producto } from "@/types/store";

interface ProductoRow {
  id: number;
  nombre: string;
  precio: number | string;
  imagen: string;
  categoria: string;
  subcategoria: string | null;
  descripcion: string;
  stock: number;
  unidad_precio: string | null;
  es_a_granel: boolean | null;
  es_factura: boolean | null;
  es_empanada: boolean | null;
  precios_multiples: PreciosMultiples | null;
  sabores: string[] | null;
  presentaciones: Presentacion[] | null;
  activo: boolean;
  orden: number;
}

interface OfertaRow {
  id: number;
  nombre: string;
  precio_anterior: number | string;
  precio_actual: number | string;
  descripcion: string;
  imagen: string;
  imagenes: string[] | null;
  stock: number;
  categoria: string;
  activa: boolean;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  orden: number;
}

const formatPrice = (price: number) => `$${price.toLocaleString("es-AR")}`;

export const mapProducto = (row: ProductoRow): Producto => ({
  id: Number(row.id),
  nombre: row.nombre,
  precio: Number(row.precio),
  imagen: row.imagen,
  categoria: row.categoria,
  subcategoria: row.subcategoria || undefined,
  descripcion: row.descripcion,
  stock: Number(row.stock),
  unidadPrecio: row.unidad_precio || undefined,
  esAGranel: Boolean(row.es_a_granel),
  esFactura: Boolean(row.es_factura),
  esEmpanada: Boolean(row.es_empanada),
  preciosMultiples: row.precios_multiples || undefined,
  sabores: row.sabores || undefined,
  presentaciones: row.presentaciones || undefined,
  activo: row.activo,
  orden: Number(row.orden),
});

export const mapOferta = (row: OfertaRow): Oferta => {
  const precioAnterior = Number(row.precio_anterior);
  const precioActual = Number(row.precio_actual);
  return {
    id: Number(row.id),
    nombre: row.nombre,
    antes: formatPrice(precioAnterior),
    ahora: formatPrice(precioActual),
    precioAnterior,
    precioActual,
    desc: row.descripcion,
    img: row.imagen,
    images: row.imagenes || undefined,
    stock: Number(row.stock),
    categoria: row.categoria,
    activa: row.activa,
    fechaInicio: row.fecha_inicio || undefined,
    fechaFin: row.fecha_fin || undefined,
    orden: Number(row.orden),
  };
};

export async function fetchProductos(includeInactive = false) {
  if (!isSupabaseConfigured) throw new Error("Supabase no está configurado.");

  let query = supabase
    .from("productos")
    .select("*")
    .order("orden", { ascending: true })
    .order("id", { ascending: true });

  if (!includeInactive) query = query.eq("activo", true);
  const { data, error } = await query;
  if (error) throw error;
  return (data as ProductoRow[]).map(mapProducto);
}

export async function fetchOfertas(includeInactive = false) {
  if (!isSupabaseConfigured) throw new Error("Supabase no está configurado.");

  let query = supabase
    .from("ofertas")
    .select("*")
    .order("orden", { ascending: true })
    .order("id", { ascending: true });

  if (!includeInactive) query = query.eq("activa", true);
  const { data, error } = await query;
  if (error) throw error;
  return (data as OfertaRow[]).map(mapOferta);
}

export const useProductos = () => useQuery({
  queryKey: ["productos", "publicos"],
  queryFn: () => fetchProductos(false),
  staleTime: 60_000,
  retry: 2,
});

export const useOfertas = () => useQuery({
  queryKey: ["ofertas", "publicas"],
  queryFn: () => fetchOfertas(false),
  staleTime: 60_000,
  retry: 2,
});
