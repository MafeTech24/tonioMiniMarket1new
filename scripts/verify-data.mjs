import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const products = JSON.parse(fs.readFileSync(path.join(root, "data/productos.json"), "utf8"));
const offers = JSON.parse(fs.readFileSync(path.join(root, "data/ofertas.json"), "utf8"));
const legacyMap = JSON.parse(fs.readFileSync(path.join(root, "data/mapeo-imagenes-legacy.json"), "utf8"));
const removedIds = new Set([5, 26, 27, 113, 127, 411, 412]);
const directLocalImageIds = new Set([787, 788, 789, 790, 500]);

function findArrayLiteral(source, declaration) {
  const declarationIndex = source.indexOf(declaration);
  if (declarationIndex < 0) throw new Error(`No se encontró la declaración: ${declaration}`);
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
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = null;
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
    if (char === "]" && --depth === 0) return source.slice(start, index + 1);
  }
  throw new Error(`No se pudo cerrar el array: ${declaration}`);
}

function readArray(relativePath, declaration) {
  const source = fs.readFileSync(path.join(root, relativePath), "utf8");
  return Function(`"use strict"; return (${findArrayLiteral(source, declaration)});`)();
}

function parseCurrency(value) {
  return Number(String(value).replace(/[^0-9]/g, ""));
}

function fail(message) {
  throw new Error(message);
}

if (products.length !== 389) fail(`Se esperaban 389 productos y se encontraron ${products.length}.`);
if (offers.length !== 17) fail(`Se esperaban 17 ofertas y se encontraron ${offers.length}.`);
if (new Set(products.map((item) => item.id)).size !== products.length) fail("Hay IDs de productos duplicados.");
if (new Set(products.map((item) => item.nombre)).size !== products.length) fail("Hay nombres de productos duplicados.");
if (new Set(offers.map((item) => item.id)).size !== offers.length) fail("Hay IDs de ofertas duplicados.");
if (new Set(offers.map((item) => item.nombre)).size !== offers.length) fail("Hay nombres de ofertas duplicados.");
if (products.some((item) => removedIds.has(item.id))) fail("Una baja confirmada continúa activa en el catálogo.");

const invalidProducts = products.filter((item) =>
  !item.nombre || !item.imagen || !item.categoria || !Number.isFinite(item.precio) || item.precio < 0
  || !Number.isInteger(item.stock) || item.stock < 0,
);
if (invalidProducts.length) fail(`Hay ${invalidProducts.length} productos con datos inválidos.`);

const invalidOffers = offers.filter((item) =>
  !item.nombre || !item.imagen || !item.categoria
  || !Number.isFinite(item.precioAnterior) || item.precioAnterior < 0
  || !Number.isFinite(item.precioActual) || item.precioActual < 0
  || !Number.isInteger(item.stock) || item.stock < 0,
);
if (invalidOffers.length) fail(`Hay ${invalidOffers.length} ofertas con datos inválidos.`);

const localImages = products.filter((item) => item.imagen.startsWith("/products/"));
for (const item of localImages) {
  const localPath = path.join(root, "public", item.imagen.replace(/^\//, ""));
  if (!fs.existsSync(localPath)) fail(`Falta la imagen local de ${item.nombre}: ${item.imagen}`);
}
if (localImages.length !== 5) fail(`Se esperaban 5 imágenes locales directas y hay ${localImages.length}.`);
if (localImages.some((item) => !directLocalImageIds.has(item.id))) fail("Hay una imagen local directa en un ID no aprobado.");
if ([...directLocalImageIds].some((id) => !localImages.some((item) => item.id === id))) fail("Falta un ID aprobado entre las imágenes locales directas.");

const sourceProducts = readArray("data/sources/Catalogo.definitivo.tsx", "const productos: Producto[] =").map((item) => {
  const sourceImage = item.id === 787 ? "/products/desayuno/cafeLaVirginiaTorrado125.jpg" : item.imagen;
  return {
    ...item,
    imagen: directLocalImageIds.has(item.id) ? sourceImage : legacyMap[sourceImage] || sourceImage,
  };
});
const sourceOffers = readArray("data/sources/Ofertas.actualizadas.tsx", "const ofertas =").map((item, index) => ({
  id: index + 1,
  nombre: item.nombre,
  precioAnterior: parseCurrency(item.antes),
  precioActual: parseCurrency(item.ahora),
  descripcion: item.desc,
  imagen: legacyMap[item.img] || item.img,
  imagenes: item.images?.map((image) => legacyMap[image] || image) ?? null,
  stock: item.stock,
  categoria: item.categoria,
  activa: true,
  orden: index + 1,
}));
if (JSON.stringify(products) !== JSON.stringify(sourceProducts)) fail("productos.json no coincide con Catalogo.definitivo.tsx transformado.");
if (JSON.stringify(offers) !== JSON.stringify(sourceOffers)) fail("ofertas.json no coincide con Ofertas.actualizadas.tsx transformado.");

const seedSql = fs.readFileSync(path.join(root, "supabase/seed.sql"), "utf8");
const migrationSql = fs.readFileSync(path.join(root, "supabase/migrations/202609080001_sincronizar_catalogo_aprobado.sql"), "utf8");
const dataHash = createHash("sha256").update(JSON.stringify({ productos: products, ofertas: offers })).digest("hex");
if (!seedSql.includes(`-- SHA-256 datos: ${dataHash}`)) fail("seed.sql no corresponde al hash de los JSON vigentes.");
if (seedSql !== migrationSql) fail("La migración revisable y seed.sql no contienen la misma sincronización.");
if (/\b(DROP\s+TABLE|TRUNCATE|DELETE\s+FROM)\b/i.test(seedSql)) fail("El SQL contiene una sentencia destructiva prohibida.");
if (/\bpublic\.pedidos\b/i.test(seedSql)) fail("El SQL de catálogo hace referencia a la tabla de pedidos.");

console.log(`Productos verificados: ${products.length}`);
console.log(`Ofertas verificadas: ${offers.length}`);
console.log(`Imágenes nuevas verificadas: ${localImages.length}`);
console.log(`Imágenes históricas de productos verificadas: ${products.length - localImages.length}`);
console.log(`Imágenes históricas de ofertas verificadas: ${offers.length}`);
console.log("Bajas confirmadas ausentes del catálogo activo: 7");
console.log(`Hash de consistencia JSON/SQL: ${dataHash}`);
