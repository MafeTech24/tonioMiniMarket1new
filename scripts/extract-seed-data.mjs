import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(projectRoot, "data");
const catalogSourcePath = "data/sources/Catalogo.definitivo.tsx";
const offersSourcePath = "data/sources/Ofertas.actualizadas.tsx";
const migrationPath = "supabase/migrations/202609080001_sincronizar_catalogo_aprobado.sql";
const removedProductIds = [5, 26, 27, 113, 127, 411, 412];
const correctedLegacyBulkIds = [413, 414, 415, 416, 417, 418];
const directLocalImageIds = new Set([787, 788, 789, 790, 500]);

function findArrayLiteral(source, declaration) {
  const declarationIndex = source.indexOf(declaration);
  if (declarationIndex < 0) {
    throw new Error(`No se encontró la declaración: ${declaration}`);
  }

  const assignmentIndex = source.indexOf("=", declarationIndex);
  const start = source.indexOf("[", assignmentIndex);
  let depth = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (lineComment) {
      if (char === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        index += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }
    if (char === "/" && next === "/") {
      lineComment = true;
      index += 1;
      continue;
    }
    if (char === "/" && next === "*") {
      blockComment = true;
      index += 1;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === "[") depth += 1;
    if (char === "]") {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }

  throw new Error(`No se pudo cerrar el array: ${declaration}`);
}

function readArray(relativePath, declaration) {
  const source = fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
  const literal = findArrayLiteral(source, declaration);
  return Function(`"use strict"; return (${literal});`)();
}

function assertUnique(items, field, label) {
  const seen = new Set();
  for (const item of items) {
    if (seen.has(item[field])) {
      throw new Error(`${label}: valor duplicado en ${field}: ${item[field]}`);
    }
    seen.add(item[field]);
  }
}

function parseCurrency(value) {
  return Number(String(value).replace(/[^0-9]/g, ""));
}

function sqlText(value) {
  if (value === undefined || value === null || value === "") return "NULL";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlJson(value) {
  if (value === undefined || value === null) return "NULL";
  return `${sqlText(JSON.stringify(value))}::jsonb`;
}

function bool(value) {
  return value === true ? "true" : "false";
}

function buildSeedSql(productos, ofertas) {
  const dataHash = createHash("sha256")
    .update(JSON.stringify({ productos, ofertas }))
    .digest("hex");
  const productRows = productos.map((product, index) => `(
    ${product.id}, ${sqlText(product.nombre)}, ${product.precio}, ${sqlText(product.imagen)},
    ${sqlText(product.categoria)}, ${sqlText(product.subcategoria)}, ${sqlText(product.descripcion)}, ${product.stock},
    ${sqlText(product.unidadPrecio)}, ${bool(product.esAGranel)}, ${bool(product.esFactura)}, ${bool(product.esEmpanada)},
    ${sqlJson(product.preciosMultiples)}, ${sqlJson(product.sabores)}, ${sqlJson(product.presentaciones)}, true, ${index + 1}
  )`).join(",\n");

  const offerRows = ofertas.map((offer) => `(
    ${offer.id}, ${sqlText(offer.nombre)}, ${offer.precioAnterior}, ${offer.precioActual},
    ${sqlText(offer.descripcion)}, ${sqlText(offer.imagen)}, ${sqlJson(offer.imagenes)}, ${offer.stock}, ${sqlText(offer.categoria)},
    true, ${offer.orden}
  )`).join(",\n");

  return `-- Sincronización transaccional del catálogo aprobado.
-- Fuentes: ${catalogSourcePath} y ${offersSourcePath}.
-- SHA-256 datos: ${dataHash}
-- No elimina filas ni modifica pedidos o historial.
-- Las únicas bajas aplicadas son los 7 IDs de producto confirmados.
-- Corrección legacy deliberada: los IDs 413-418 se venden c/u y no a granel.

BEGIN;

UPDATE public.productos
SET activo = false
WHERE id IN (${removedProductIds.join(", ")})
  AND activo IS DISTINCT FROM false;

-- Corrige el dato legacy remoto. Durante la transición, el trigger de
-- compatibilidad replica este false hacia "esAGranel".
UPDATE public.productos
SET es_a_granel = false
WHERE id IN (${correctedLegacyBulkIds.join(", ")})
  AND es_a_granel IS DISTINCT FROM false;

INSERT INTO public.productos (
  id, nombre, precio, imagen, categoria, subcategoria, descripcion, stock,
  unidad_precio, es_a_granel, es_factura, es_empanada,
  precios_multiples, sabores, presentaciones, activo, orden
) VALUES
${productRows}
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  precio = EXCLUDED.precio,
  imagen = EXCLUDED.imagen,
  categoria = EXCLUDED.categoria,
  subcategoria = EXCLUDED.subcategoria,
  descripcion = EXCLUDED.descripcion,
  stock = EXCLUDED.stock,
  unidad_precio = EXCLUDED.unidad_precio,
  es_a_granel = EXCLUDED.es_a_granel,
  es_factura = EXCLUDED.es_factura,
  es_empanada = EXCLUDED.es_empanada,
  precios_multiples = EXCLUDED.precios_multiples,
  sabores = EXCLUDED.sabores,
  presentaciones = EXCLUDED.presentaciones,
  activo = true,
  orden = EXCLUDED.orden;

select setval(
  'public.productos_id_seq',
  greatest(coalesce((select max(id) from public.productos), 0), 1),
  true
);

INSERT INTO public.ofertas (
  id, nombre, precio_anterior, precio_actual, descripcion, imagen, imagenes,
  stock, categoria, activa, orden
) VALUES
${offerRows}
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  precio_anterior = EXCLUDED.precio_anterior,
  precio_actual = EXCLUDED.precio_actual,
  descripcion = EXCLUDED.descripcion,
  imagen = EXCLUDED.imagen,
  imagenes = EXCLUDED.imagenes,
  stock = EXCLUDED.stock,
  categoria = EXCLUDED.categoria,
  activa = true,
  orden = EXCLUDED.orden;

select setval(
  pg_get_serial_sequence('public.ofertas', 'id'),
  greatest(coalesce((select max(id) from public.ofertas), 0), 1),
  true
);

DO $$
DECLARE
  v_productos_activos integer;
  v_ofertas_activas integer;
BEGIN
  SELECT count(*) INTO v_productos_activos
  FROM public.productos
  WHERE activo = true;

  IF v_productos_activos <> 389 THEN
    RAISE EXCEPTION
      'Sincronización cancelada: se esperaban 389 productos activos y hay %',
      v_productos_activos;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.productos
    WHERE id IN (${removedProductIds.join(", ")}) AND activo = true
  ) THEN
    RAISE EXCEPTION 'Sincronización cancelada: una baja confirmada quedó activa';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.productos
    WHERE id IN (${correctedLegacyBulkIds.join(", ")})
      AND (
        unidad_precio IS DISTINCT FROM 'c/u'
        OR es_a_granel IS DISTINCT FROM false
      )
  ) THEN
    RAISE EXCEPTION
      'Sincronización cancelada: la corrección legacy de los IDs 413-418 no quedó aplicada';
  END IF;

  SELECT count(*) INTO v_ofertas_activas
  FROM public.ofertas
  WHERE activa = true;

  IF v_ofertas_activas <> 17 THEN
    RAISE EXCEPTION
      'Sincronización cancelada: se esperaban 17 ofertas activas y hay %',
      v_ofertas_activas;
  END IF;
END $$;

COMMIT;
`;
}

fs.mkdirSync(dataDir, { recursive: true });

const legacyMap = JSON.parse(
  fs.readFileSync(path.join(dataDir, "mapeo-imagenes-legacy.json"), "utf8"),
);

const rawProducts = readArray(catalogSourcePath, "const productos: Producto[] =");

const productos = rawProducts.map((product) => {
  const correctedLocalPath = product.id === 787
    ? "/products/desayuno/cafeLaVirginiaTorrado125.jpg"
    : product.imagen;

  return {
    ...product,
    imagen: directLocalImageIds.has(product.id)
      ? correctedLocalPath
      : legacyMap[correctedLocalPath] || legacyMap[product.imagen] || correctedLocalPath,
  };
});

const ofertas = readArray(offersSourcePath, "const ofertas =").map((offer, index) => ({
      id: index + 1,
      nombre: offer.nombre,
      precioAnterior: parseCurrency(offer.antes),
      precioActual: parseCurrency(offer.ahora),
      descripcion: offer.desc,
      imagen: legacyMap[offer.img] || offer.img,
      imagenes: offer.images?.map((image) => legacyMap[image] || image) ?? null,
      stock: offer.stock,
      categoria: offer.categoria,
      activa: true,
      orden: index + 1,
    }));

assertUnique(productos, "id", "Productos");
assertUnique(productos, "nombre", "Productos");
assertUnique(ofertas, "id", "Ofertas");
assertUnique(ofertas, "nombre", "Ofertas");

if (productos.length !== 389) {
  throw new Error(`Se esperaban 389 productos activos y se obtuvieron ${productos.length}.`);
}
if (ofertas.length !== 17) {
  throw new Error(`Se esperaban 17 ofertas activas y se obtuvieron ${ofertas.length}.`);
}
if (productos.some((product) => removedProductIds.includes(product.id))) {
  throw new Error("La fuente definitiva contiene uno de los 7 productos retirados.");
}
const invalidCorrectedLegacyBulkIds = correctedLegacyBulkIds.filter((id) => {
  const product = productos.find((candidate) => candidate.id === id);
  return !product || product.unidadPrecio !== "c/u" || product.esAGranel !== false;
});
if (invalidCorrectedLegacyBulkIds.length > 0) {
  throw new Error(
    `Corrección legacy inválida: los IDs ${invalidCorrectedLegacyBulkIds.join(", ")} `
      + 'deben existir con unidadPrecio="c/u" y esAGranel=false.',
  );
}
const localProducts = productos.filter((product) => product.imagen.startsWith("/products/"));
if (localProducts.length !== 5 || localProducts.some((product) => !directLocalImageIds.has(product.id))) {
  throw new Error("El conjunto de productos con imagen local directa no coincide con los 5 IDs aprobados.");
}
if (productos.some((product) => !directLocalImageIds.has(product.id) && !legacyMap[rawProducts.find((raw) => raw.id === product.id)?.imagen])) {
  throw new Error("Hay productos históricos sin mapeo de imagen legacy.");
}
if (ofertas.some((offer) => offer.imagen.startsWith("/products/"))) {
  throw new Error("Hay ofertas sin mapeo de imagen legacy.");
}

fs.writeFileSync(
  path.join(dataDir, "productos.json"),
  `${JSON.stringify(productos, null, 2)}\n`,
);
fs.writeFileSync(
  path.join(dataDir, "ofertas.json"),
  `${JSON.stringify(ofertas, null, 2)}\n`,
);
fs.writeFileSync(
  path.join(projectRoot, "supabase", "seed.sql"),
  buildSeedSql(productos, ofertas),
);
fs.writeFileSync(
  path.join(projectRoot, migrationPath),
  buildSeedSql(productos, ofertas),
);

console.log(`Productos exportados: ${productos.length}`);
console.log(`Ofertas exportadas: ${ofertas.length}`);
console.log(`Migración generada: ${migrationPath}`);
console.log("Archivos generados: data/productos.json, data/ofertas.json, supabase/seed.sql");
