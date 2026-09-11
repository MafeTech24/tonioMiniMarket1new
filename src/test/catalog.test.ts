import { describe, expect, it } from "vitest";
import { mapOferta, mapProducto } from "@/hooks/useCatalog";

describe("adaptadores del catálogo", () => {
  it("convierte correctamente los campos de un producto de Supabase", () => {
    const product = mapProducto({
      id: 787,
      nombre: "Café La Virginia Torrado 125g",
      precio: "3800",
      imagen: "/products/desayuno/cafeLaVirginiaTorrado125.jpg",
      categoria: "Almacén",
      subcategoria: "Desayuno",
      descripcion: "Café molido",
      stock: 20,
      unidad_precio: null,
      es_a_granel: false,
      es_factura: false,
      es_empanada: false,
      precios_multiples: null,
      sabores: null,
      presentaciones: null,
      activo: true,
      orden: 1,
    });

    expect(product.precio).toBe(3800);
    expect(product.subcategoria).toBe("Desayuno");
    expect(product.esAGranel).toBe(false);
  });

  it("formatea una oferta y conserva los valores numéricos", () => {
    const offer = mapOferta({
      id: 1,
      nombre: "Promo",
      precio_anterior: "10000",
      precio_actual: "8500",
      descripcion: "Combo",
      imagen: "/promo.png",
      imagenes: null,
      stock: 5,
      categoria: "Almacén",
      activa: true,
      fecha_inicio: null,
      fecha_fin: null,
      orden: 1,
    });

    expect(offer.precioActual).toBe(8500);
    expect(offer.ahora).toBe("$8.500");
  });
});
