import { supabase } from "@/lib/supabase";
import { fetchOfertas, fetchProductos } from "@/hooks/useCatalog";
import type { Cliente, EstadoPedido, Oferta, Pedido, PedidoProducto, Producto } from "@/types/store";

export type ProductoInput = Omit<Producto, "id"> & { id?: number };
export type OfertaInput = Omit<Oferta, "id" | "antes" | "ahora"> & { id?: number };
export type AdminRole = "propietario" | "empleado";

export type AdminProfile = {
  user_id: string;
  email: string | null;
  nombre: string | null;
  rol: AdminRole;
};

export async function checkIsAdmin() {
  const { data, error } = await supabase.rpc("is_admin");
  if (error) throw error;
  return data === true;
}

export async function fetchCurrentAdminProfile() {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!authData.user) throw new Error("No hay una sesión activa.");

  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id,email,nombre,rol")
    .eq("user_id", authData.user.id)
    .single();
  if (error) throw error;
  return data as AdminProfile;
}

export const fetchAdminProductos = () => fetchProductos(true);
export const fetchAdminOfertas = () => fetchOfertas(true);

export async function saveProducto(producto: ProductoInput) {
  const payload = {
    nombre: producto.nombre.trim(),
    precio: producto.precio,
    imagen: producto.imagen.trim(),
    categoria: producto.categoria,
    subcategoria: producto.subcategoria || null,
    descripcion: producto.descripcion.trim(),
    stock: producto.stock,
    unidad_precio: producto.unidadPrecio || null,
    es_a_granel: Boolean(producto.esAGranel),
    es_factura: Boolean(producto.esFactura),
    es_empanada: Boolean(producto.esEmpanada),
    precios_multiples: producto.preciosMultiples || null,
    sabores: producto.sabores?.length ? producto.sabores : null,
    presentaciones: producto.presentaciones?.length ? producto.presentaciones : null,
    activo: producto.activo,
    orden: producto.orden,
  };

  if (producto.id) {
    const { error } = await supabase.from("productos").update(payload).eq("id", producto.id);
    if (error) throw error;
    return producto.id;
  }

  const { data, error } = await supabase
    .from("productos")
    .insert(payload)
    .select("id")
    .single();
  if (error) throw error;
  return Number(data.id);
}

export async function setProductoActivo(id: number, activo: boolean) {
  const { error } = await supabase.from("productos").update({ activo }).eq("id", id);
  if (error) throw error;
}

export async function deleteProducto(id: number) {
  const { data, error } = await supabase.from("productos").delete().eq("id", id).select("id");
  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error("No se pudo eliminar: no tenés permiso, o el producto ya no existe.");
  }
}

export async function saveOferta(oferta: OfertaInput) {
  const payload = {
    nombre: oferta.nombre.trim(),
    precio_anterior: oferta.precioAnterior,
    precio_actual: oferta.precioActual,
    descripcion: oferta.desc.trim(),
    imagen: oferta.img.trim(),
    imagenes: oferta.images?.length ? oferta.images : null,
    stock: oferta.stock,
    categoria: oferta.categoria,
    activa: oferta.activa,
    fecha_inicio: oferta.fechaInicio || null,
    fecha_fin: oferta.fechaFin || null,
    orden: oferta.orden,
  };

  if (oferta.id) {
    const { error } = await supabase.from("ofertas").update(payload).eq("id", oferta.id);
    if (error) throw error;
    return oferta.id;
  }

  const { data, error } = await supabase
    .from("ofertas")
    .insert(payload)
    .select("id")
    .single();
  if (error) throw error;
  return Number(data.id);
}

export async function setOfertaActiva(id: number, activa: boolean) {
  const { error } = await supabase.from("ofertas").update({ activa }).eq("id", id);
  if (error) throw error;
}

export async function deleteOferta(id: number) {
  const { data, error } = await supabase.from("ofertas").delete().eq("id", id).select("id");
  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error("No se pudo eliminar: no tenés permiso, o la oferta ya no existe.");
  }
}

interface PedidoRow extends Omit<Pedido, "numero_pedido" | "subtotal" | "costo_envio" | "total"> {
  numero_pedido: number | string;
  subtotal: number | string;
  costo_envio: number | string;
  total: number | string;
}

export async function fetchPedidos() {
  const { data, error } = await supabase
    .from("pedidos")
    .select("*")
    .order("fecha", { ascending: false })
    .limit(200);
  if (error) throw error;
  return (data as PedidoRow[]).map((row) => ({
    ...row,
    numero_pedido: String(row.numero_pedido),
    subtotal: Number(row.subtotal),
    costo_envio: Number(row.costo_envio),
    total: Number(row.total),
  }));
}

export async function updatePedidoEstado(id: string, estado: EstadoPedido) {
  const { error } = await supabase.from("pedidos").update({ estado }).eq("id", id);
  if (error) throw error;
}

export type Resumen = {
  ventasHoy: { cantidadPedidos: number; total: number };
  ventasSemana: { cantidadPedidos: number; total: number };
  masVendidoSemana: { nombre: string; cantidad: number } | null;
  pedidosPendientes: number;
};

export async function fetchResumen(): Promise<Resumen> {
  const ahora = new Date();
  const inicioHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const inicioSemana = new Date(inicioHoy);
  inicioSemana.setDate(inicioSemana.getDate() - 6); // últimos 7 días, incluyendo hoy

  const [semanaResult, pendientesResult] = await Promise.all([
    supabase
      .from("pedidos")
      .select("fecha,total,productos")
      .gte("fecha", inicioSemana.toISOString()),
    supabase
      .from("pedidos")
      .select("id", { count: "exact", head: true })
      .eq("estado", "pendiente"),
  ]);

  if (semanaResult.error) throw semanaResult.error;
  if (pendientesResult.error) throw pendientesResult.error;

  const filas = (semanaResult.data ?? []) as Array<{
    fecha: string;
    total: number | string;
    productos: PedidoProducto[] | null;
  }>;

  let ventasHoyCantidad = 0;
  let ventasHoyTotal = 0;
  let ventasSemanaCantidad = 0;
  let ventasSemanaTotal = 0;
  const cantidadPorProducto = new Map<string, number>();

  for (const fila of filas) {
    const total = Number(fila.total);
    ventasSemanaCantidad += 1;
    ventasSemanaTotal += total;

    if (new Date(fila.fecha) >= inicioHoy) {
      ventasHoyCantidad += 1;
      ventasHoyTotal += total;
    }

    for (const item of fila.productos ?? []) {
      cantidadPorProducto.set(item.nombre, (cantidadPorProducto.get(item.nombre) ?? 0) + item.cantidad);
    }
  }

  let masVendidoSemana: { nombre: string; cantidad: number } | null = null;
  for (const [nombre, cantidad] of cantidadPorProducto) {
    if (!masVendidoSemana || cantidad > masVendidoSemana.cantidad) {
      masVendidoSemana = { nombre, cantidad };
    }
  }

  return {
    ventasHoy: { cantidadPedidos: ventasHoyCantidad, total: ventasHoyTotal },
    ventasSemana: { cantidadPedidos: ventasSemanaCantidad, total: ventasSemanaTotal },
    masVendidoSemana,
    pedidosPendientes: pendientesResult.count ?? 0,
  };
}

interface ClienteRow extends Omit<Cliente, "cantidad_pedidos" | "total_gastado"> {
  cantidad_pedidos: number | string;
  total_gastado: number | string;
}

export async function fetchClientes() {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .order("ultimo_pedido", { ascending: false })
    .limit(500);
  if (error) throw error;
  return (data as ClienteRow[]).map((row) => ({
    ...row,
    cantidad_pedidos: Number(row.cantidad_pedidos),
    total_gastado: Number(row.total_gastado),
  }));
}

const MAX_IMAGE_DIMENSION = 1600;
const IMAGE_QUALITY = 0.82;

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

// Redimensiona y comprime la imagen en el navegador antes de subirla, para que
// el catálogo cargue rápido en la tienda. No agranda imágenes chicas, sólo
// reduce las que superan MAX_IMAGE_DIMENSION, y convierte todo a WebP (con
// JPEG como respaldo si el navegador no puede generar WebP).
async function compressImage(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la imagen en este navegador.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const webp = await canvasToBlob(canvas, "image/webp", IMAGE_QUALITY);
  if (webp) return { blob: webp, extension: "webp" };

  const jpeg = await canvasToBlob(canvas, "image/jpeg", IMAGE_QUALITY);
  if (jpeg) return { blob: jpeg, extension: "jpg" };

  throw new Error("No se pudo comprimir la imagen en este navegador.");
}

export async function uploadCatalogImage(file: File, folder: "productos" | "ofertas") {
  if (!file.type.startsWith("image/")) throw new Error("El archivo debe ser una imagen.");
  if (file.size > 15 * 1024 * 1024) throw new Error("La imagen no puede superar los 15 MB.");

  const { blob, extension } = await compressImage(file);
  const storagePath = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from("productos-imagenes")
    .upload(storagePath, blob, {
      cacheControl: "31536000",
      upsert: false,
      contentType: extension === "webp" ? "image/webp" : "image/jpeg",
    });
  if (error) throw error;

  const { data } = supabase.storage.from("productos-imagenes").getPublicUrl(storagePath);
  return data.publicUrl;
}
