export interface Presentacion {
  nombre: string;
  precio: number;
}

export interface PreciosMultiples {
  unidad: number;
  mediaDocena: number;
  docena: number;
}

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  subcategoria?: string;
  descripcion: string;
  stock: number;
  unidadPrecio?: string;
  esAGranel?: boolean;
  esFactura?: boolean;
  esEmpanada?: boolean;
  preciosMultiples?: PreciosMultiples;
  sabores?: string[];
  presentaciones?: Presentacion[];
  activo: boolean;
  orden: number;
}

export interface Oferta {
  id: number;
  nombre: string;
  antes: string;
  ahora: string;
  precioAnterior: number;
  precioActual: number;
  desc: string;
  img: string;
  images?: string[];
  stock: number;
  categoria: string;
  activa: boolean;
  fechaInicio?: string;
  fechaFin?: string;
  orden: number;
}

export interface PedidoProducto {
  producto_id?: number;
  tipo: "producto" | "oferta";
  nombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;
}

export interface Pedido {
  id: string;
  numero_pedido: string;
  fecha: string;
  cliente_nombre: string;
  cliente_telefono: string;
  productos: PedidoProducto[];
  subtotal: number;
  costo_envio: number;
  total: number;
  calle?: string;
  piso_dpto?: string;
  barrio?: string;
  direccion_completa?: string;
  metodo_entrega: "Delivery" | "Retiro en local";
  metodo_pago: "Efectivo" | "Transferencia";
  notas?: string;
  estado: EstadoPedido;
}

export interface Cliente {
  telefono: string;
  nombre: string;
  cantidad_pedidos: number;
  ultimo_pedido: string;
  total_gastado: number;
}

export type EstadoPedido =
  | "pendiente"
  | "confirmado"
  | "en preparación"
  | "en camino"
  | "entregado"
  | "cancelado";
