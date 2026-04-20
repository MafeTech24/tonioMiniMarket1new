import { useState, useEffect } from "react";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";

// Pollería Assets
import alitasPolloImg from "@/assets/products/polleria/alitasPollo.png";
import medioPolloImg from "@/assets/products/polleria/medioPollo.png";
import milaPolloImg from "@/assets/products/polleria/milaPollo.png";
import pataMusloImg from "@/assets/products/polleria/pataMuslo.png";
import pataPolloImg from "@/assets/products/polleria/pataPollo.png";
import pechugasdePolloImg from "@/assets/products/polleria/pechugasdePollo.png";
import polloEnteroImg from "@/assets/products/polleria/polloEntero.png";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  subcategoria?: string;
  descripcion: string;
  stock: number;
  unidadPrecio?: string;
}

const CATEGORIAS = [
  "Todos",
  "Almacén",
  "Bebidas",
  "Congelados",
  "Kiosco",
  "Pollería",
  "Comidas listas",
  "Limpieza",
  "Perfumería",
  "Mascotas"
];

const SUBCATEGORIAS: Record<string, string[]> = {
  "Almacén": ["Aderezos", "Condimentos", "Conservas", "Desayuno", "Fiambres", "Lácteos", "Panadería", "Pastas frescas y secas", "Snacks"],
  "Bebidas": ["Con alcohol", "Sin alcohol"]
};

const productos: Producto[] = [
  {
    id: 1,
    nombre: "Azúcar Ledesma Clásica 1kg",
    precio: 1200,
    imagen: "/products/desayuno/azucarLedesma1000.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Azúcar común tipo A, libre de gluten. Ideal para endulzar infusiones y preparaciones.",
    stock: 20
  },
  {
    id: 2,
    nombre: "Nesquik Original 360g",
    precio: 2800,
    imagen: "/products/desayuno/cacaoNesquik360.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Cacao en polvo instantáneo Nestlé, enriquecido con vitaminas y minerales. Sin gluten.",
    stock: 20
  },
  {
    id: 3,
    nombre: "Café Dolca Original Doy Pack 170g",
    precio: 3200,
    imagen: "/products/desayuno/cafeDolcaOriginalDoyPack170.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Café instantáneo Nescafé Dolca sabor original, en formato doy pack económico de 170g. Ideal para batir.",
    stock: 20
  },
  {
    id: 4,
    nombre: "Café Dolca Suave Doy Pack 170g",
    precio: 3200,
    imagen: "/products/desayuno/cafeDolcaSuaveDoyPack170.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Café instantáneo Nescafé Dolca de sabor suave, en formato doy pack económico de 170g.",
    stock: 20
  },
  {
    id: 5,
    nombre: "Café Instantáneo Dolca 170g",
    precio: 3800,
    imagen: "/products/desayuno/cafeInstantaneoDolca170.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Café instantáneo Nescafé Dolca Original en frasco de 170g. 100% café de origen responsable.",
    stock: 20
  },
  {
    id: 6,
    nombre: "Café La Virginia Doy Pack 170g",
    precio: 2900,
    imagen: "/products/desayuno/cafeLaVirginiaDoyPack170.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Café instantáneo torrado La Virginia en formato doy pack recargable de 170g.",
    stock: 20
  },
  {
    id: 7,
    nombre: "Café La Virginia en Saquitos x20",
    precio: 2200,
    imagen: "/products/desayuno/cafeLaVirginiaenSaquitos20unid.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Café molido torrado La Virginia en saquitos individuales, caja x20 unidades de 5g cada uno.",
    stock: 20
  },
  {
    id: 8,
    nombre: "Café La Virginia Torrado 200g",
    precio: 2600,
    imagen: "/products/desayuno/cafeLaVirginiaTorrado200.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Café molido torrado clásico La Virginia, paquete de 200g. Sabor equilibrado y tradicional.",
    stock: 20
  },
  {
    id: 9,
    nombre: "Chocolino La Virginia 180g",
    precio: 1900,
    imagen: "/products/desayuno/chocolino180.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Chispitas granuladas de chocolate La Virginia para agregar a la leche. Con vitamina B y zinc, 180g.",
    stock: 20
  },
  {
    id: 10,
    nombre: "Copos de Maíz con Azúcar x 100g",
    precio: 400,
    imagen: "/products/desayuno/coposMaizConAzucar.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Copos de maíz azucarados a granel. Precio por 100g.",
    stock: 20,
    unidadPrecio: "100g"
  },
  {
    id: 11,
    nombre: "Copos de Maíz sin Azúcar x 100g",
    precio: 380,
    imagen: "/products/desayuno/coposMaizSinAzucar.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Copos de maíz sin azúcar a granel. Precio por 100g.",
    stock: 20,
    unidadPrecio: "100g"
  },
  {
    id: 12,
    nombre: "Dulce de Leche La Serenísima Estilo Colonial 400g",
    precio: 2800,
    imagen: "/products/desayuno/dLecheEstiloColonialLaSerenisima400.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Dulce de leche estilo colonial La Serenísima, 400g. Sin TACC, libre de lactosa y sin gluten.",
    stock: 20
  },
  {
    id: 13,
    nombre: "Edulcorante Hileret Clásico 280g",
    precio: 2100,
    imagen: "/products/desayuno/edulcoranteHileretClasico280.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Edulcorante líquido clásico Hileret en frasco de 280g. Sin calorías, apto para diabéticos.",
    stock: 20
  },
  {
    id: 14,
    nombre: "Edulcorante Líquido Sweet Hileret 200ml",
    precio: 1900,
    imagen: "/products/desayuno/EdulcoranteLíquidoSweetHileret200.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Edulcorante líquido Sweet Hileret, 200ml. Sin calorías, ideal para endulzar infusiones y postres.",
    stock: 20
  },
  {
    id: 15,
    nombre: "Edulcorante Si Diet 200ml",
    precio: 1800,
    imagen: "/products/desayuno/edulcoranteSiDiet200.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Edulcorante líquido Si Diet, 200ml. Sin calorías, sabor clásico para uso diario.",
    stock: 20
  },
  {
    id: 16,
    nombre: "Stevia Tuy x100 sobres",
    precio: 2400,
    imagen: "/products/desayuno/edulcoranteSteviaTuy100.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Edulcorante en sobres de stevia natural Tuy, caja x100 unidades. Sin calorías, origen vegetal.",
    stock: 20
  },
  {
    id: 17,
    nombre: "Galletas Criollitas Bagley x3 300g",
    precio: 2200,
    imagen: "/products/desayuno/galletasCriollitasx3.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas de agua Criollitas Bagley, pack familiar x3 paquetes, 300g total. Clásicas y versátiles.",
    stock: 20
  },
  {
    id: 18,
    nombre: "Galletas Mediatarde Lia x3",
    precio: 2100,
    imagen: "/products/desayuno/galletasMediatardex3.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas crackers Mediatarde Lia, pack x3 paquetes de 100g. Clásicas para acompañar infusiones.",
    stock: 20
  },
  {
    id: 19,
    nombre: "Oreo Sin TACC",
    precio: 1800,
    imagen: "/products/desayuno/galletasOreoSinTacc.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas Oreo certificadas Sin TACC, aptas para celíacos. Rellenas de crema de vainilla.",
    stock: 20
  },
  {
    id: 20,
    nombre: "Galletas Traviata Bagley x3 183g",
    precio: 2000,
    imagen: "/products/desayuno/galletasTraviatax3.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas de agua Traviata Bagley sabor original, pack familiar x3, 183g total.",
    stock: 20
  },
  {
    id: 21,
    nombre: "Oreo Original 117g",
    precio: 1600,
    imagen: "/products/desayuno/galletitasOreo118.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas Oreo originales, 117g. Rellenas de crema de vainilla, la galletita favorita de la leche.",
    stock: 20
  },
  {
    id: 22,
    nombre: "Mate Cocido Taragüi x25",
    precio: 1700,
    imagen: "/products/desayuno/matecocidoTaragui25.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Mate cocido Taragüi en saquitos, caja x25 unidades de 3g. 100% pura hoja, industria argentina.",
    stock: 20
  },
  {
    id: 23,
    nombre: "Mate Cocido Taragüi x40",
    precio: 2600,
    imagen: "/products/desayuno/matecocidoTaragui40.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Mate cocido Taragüi en saquitos herméticos, caja x40 unidades de 3g. 100% pura hoja.",
    stock: 20
  },
  {
    id: 24,
    nombre: "Mermelada Durazno Arcor 454g",
    precio: 2300,
    imagen: "/products/desayuno/mermeladaDuraznoArcor454.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Mermelada de durazno Arcor, frasco de 454g. Elaborada con fruta seleccionada, sin TACC.",
    stock: 20
  },
  {
    id: 25,
    nombre: "Stevia en Polvo Hileret 50g",
    precio: 2000,
    imagen: "/products/desayuno/steviaPolvoHileret50.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Edulcorante stevia en polvo Hileret, 50g. Libre de gluten, sin calorías, mismo dulzor que el azúcar.",
    stock: 20
  },
  {
    id: 26,
    nombre: "Surtido Bagley 400g",
    precio: 3500,
    imagen: "/products/desayuno/surtidoBagley.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Bolsa surtido Bagley con variedad de galletitas: Chocolinas, Rumba, Merengadas y Sonrisas. 400g.",
    stock: 20
  },
  {
    id: 27,
    nombre: "Surtido Diversión Arcor 400g",
    precio: 3500,
    imagen: "/products/desayuno/surtidoDiversion.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Bolsa surtido Diversión Arcor con variedad de galletitas dulces y rellenas, 400g.",
    stock: 20
  },
  {
    id: 28,
    nombre: "Té La Virginia x25 saquitos",
    precio: 1500,
    imagen: "/products/desayuno/teLaVirginia25.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Té negro La Virginia en saquitos, caja x25 unidades. Sabor suave y equilibrado, industria argentina.",
    stock: 20
  },
  {
    id: 29,
    nombre: "Té La Virginia x50 saquitos",
    precio: 2600,
    imagen: "/products/desayuno/teLaVirginia50.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Té negro La Virginia en saquitos, caja x50 unidades. Formato familiar, sabor clásico.",
    stock: 20
  },
  {
    id: 30,
    nombre: "Té Taragüi x25 saquitos",
    precio: 1600,
    imagen: "/products/desayuno/teTaragui25.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Té negro Taragüi en saquitos, caja x25 unidades de 2g. Sabor tradicional, industria argentina.",
    stock: 20
  },
  {
    id: 31,
    nombre: "Té Taragüi x50 saquitos",
    precio: 2800,
    imagen: "/products/desayuno/teTaragui50.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Té negro clásico Taragüi en saquitos, caja x50 unidades de 2g. Formato ahorro.",
    stock: 20
  },
  {
    id: 32,
    nombre: "Yerba Amanda 500g",
    precio: 2400,
    imagen: "/products/desayuno/yerbaAmanda500.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Yerba mate elaborada Amanda, 500g. Libre de gluten, sabor suave y parejo, industria argentina.",
    stock: 20
  },
  {
    id: 33,
    nombre: "Yerba CBSé Hierbas Serranas 500g",
    precio: 2600,
    imagen: "/products/desayuno/yerbaCBSe500.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Yerba mate CBSé compuesta con hierbas serranas, 500g. Sin TACC, sabor herbal característico.",
    stock: 20
  },
  {
    id: 34,
    nombre: "Yerba Playadito 1kg",
    precio: 4200,
    imagen: "/products/desayuno/yerbaPlayadito500.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Yerba mate Playadito elaborada con palo, 1kg. Origen Colonia Liebig, Corrientes. Desde 1926.",
    stock: 20
  },
  {
    id: 35,
    nombre: "Yerba Rosamonte 500g",
    precio: 2500,
    imagen: "/products/desayuno/yerbaRosamonte500.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Yerba mate Rosamonte, 500g. Sabor intenso y persistente, una de las marcas más reconocidas del país.",
    stock: 20
  },
  {
    id: 36,
    nombre: "Yerba Verdeflor Hierbas Serranas 500g",
    precio: 2400,
    imagen: "/products/desayuno/yerbaVerdeFlor500.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Yerba mate Verdeflor elaborada con palo y hierbas serranas, 500g. Suave, digestiva y sin acidez.",
    stock: 20
  },
  {
    id: 37,
    nombre: "Nesquik Original 180g",
    precio: 1800,
    imagen: "/products/desayuno/cacaoNesquik180.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Cacao en polvo instantáneo Nestlé Nesquik, 180g. Enriquecido con vitaminas y minerales, libre de gluten.",
    stock: 20
  },
  {
    id: 38,
    nombre: "Aceto Balsámico Casalta 250ml",
    precio: 2800,
    imagen: "/products/aderezos/acetoBalsámicoCasalta250.png",
    categoria: "Almacén",
    subcategoria: "Aderezos",
    descripcion: "Aceto balsámico de Módena Casalta, 250ml. Ideal para aderezar ensaladas y carnes.",
    stock: 20
  },
  {
    id: 39,
    nombre: "Salsa Barbacoa Dánica 200g",
    precio: 1800,
    imagen: "/products/aderezos/barbacoaDanica250.png",
    categoria: "Almacén",
    subcategoria: "Aderezos",
    descripcion: "Salsa barbacoa Dánica sabor ahumado, 200g. Ideal para carnes a la parrilla y sándwiches.",
    stock: 20
  },
  {
    id: 40,
    nombre: "Ketchup Dánica 190g",
    precio: 1600,
    imagen: "/products/aderezos/ketchupDanica250.png",
    categoria: "Almacén",
    subcategoria: "Aderezos",
    descripcion: "Ketchup Dánica elaborado con tomates de la huerta, 190g. Sin TACC.",
    stock: 20
  },
  {
    id: 41,
    nombre: "Mayonesa Dánica 250cm³",
    precio: 2000,
    imagen: "/products/aderezos/mayonesaDanica250.png",
    categoria: "Almacén",
    subcategoria: "Aderezos",
    descripcion: "Mayonesa Dánica sabor tradicional con jugo de limón, 250cm³.",
    stock: 20
  },
  {
    id: 42,
    nombre: "Mayonesa Hellmann's Clásica",
    precio: 2200,
    imagen: "/products/aderezos/mayonesaHellmans.png",
    categoria: "Almacén",
    subcategoria: "Aderezos",
    descripcion: "Mayonesa Hellmann's Clásica. Sabor suave y cremoso, ideal para todo tipo de preparaciones.",
    stock: 20
  },
  {
    id: 43,
    nombre: "Mayonesa Natura 125cm³",
    precio: 1200,
    imagen: "/products/aderezos/mayonesaNatura125.png",
    categoria: "Almacén",
    subcategoria: "Aderezos",
    descripcion: "Mayonesa Natura con jugo de limón, 125cm³. Reducida en valor lipídico, sin TACC.",
    stock: 20
  },
  {
    id: 44,
    nombre: "Mayonesa Natura 250cm³",
    precio: 2000,
    imagen: "/products/aderezos/mayonesaNatura250.png",
    categoria: "Almacén",
    subcategoria: "Aderezos",
    descripcion: "Mayonesa Natura con jugo de limón, 250cm³. Reducida en valor lipídico, sin TACC.",
    stock: 20
  },
  {
    id: 45,
    nombre: "Mayonesa Natura 500cm³",
    precio: 3500,
    imagen: "/products/aderezos/mayonesaNatura500.png",
    categoria: "Almacén",
    subcategoria: "Aderezos",
    descripcion: "Mayonesa Natura con jugo de limón, 500cm³. Formato familiar, reducida en valor lipídico.",
    stock: 20
  },
  {
    id: 46,
    nombre: "Mostaza Dánica 250g",
    precio: 1700,
    imagen: "/products/aderezos/mostazaDanica250.png",
    categoria: "Almacén",
    subcategoria: "Aderezos",
    descripcion: "Mostaza Dánica a base de semillas seleccionadas, 250g. Sabor intenso y característico.",
    stock: 20
  },
  {
    id: 47,
    nombre: "Mostaza Savora Original 250g",
    precio: 1800,
    imagen: "/products/aderezos/mostazaSavora250.png",
    categoria: "Almacén",
    subcategoria: "Aderezos",
    descripcion: "Mostaza Savora Original, 250g. Clásica mostaza argentina de sabor suave y equilibrado.",
    stock: 20
  },
  {
    id: 48,
    nombre: "Salsa Golf Dánica 300g",
    precio: 2100,
    imagen: "/products/aderezos/salsaGolfDanica250.png",
    categoria: "Almacén",
    subcategoria: "Aderezos",
    descripcion: "Salsa golf Dánica, 300g. Combinación de mayonesa y ketchup, ideal para ensaladas y mariscos.",
    stock: 20
  },
  {
    id: 49,
    nombre: "Pimienta Negra Molida Dos Anclas 25g",
    precio: 900,
    imagen: "/products/condimentos/pimientaNegraMolidaDosAnclas25.png",
    categoria: "Almacén",
    subcategoria: "Condimentos",
    descripcion: "Pimienta negra molida Dos Anclas, 25g. Especia de uso diario para todo tipo de preparaciones.",
    stock: 20
  },
  {
    id: 50,
    nombre: "Sal Fina Celusal 500g",
    precio: 700,
    imagen: "/products/condimentos/salFinaCelusal500.png",
    categoria: "Almacén",
    subcategoria: "Condimentos",
    descripcion: "Sal fina de mesa Celusal, 500g. Sal natural de origen argentino para uso cotidiano.",
    stock: 20
  },
  {
    id: 51,
    nombre: "Sal Gruesa Celusal 1kg",
    precio: 900,
    imagen: "/products/condimentos/salGruesaCelusal1000.png",
    categoria: "Almacén",
    subcategoria: "Condimentos",
    descripcion: "Sal gruesa Celusal, 1kg. Ideal para cocción de pastas y vegetales.",
    stock: 20
  },
  {
    id: 52,
    nombre: "Sal Parrillera Celusal 1kg",
    precio: 1000,
    imagen: "/products/condimentos/salParrilleraCelusal1000.png",
    categoria: "Almacén",
    subcategoria: "Condimentos",
    descripcion: "Sal entrefina Celusal para parrilla, 1kg. Especial para carnes asadas y embutidos caseros.",
    stock: 20
  },
  {
    id: 53,
    nombre: "Atún al Natural La Campagnola 170g",
    precio: 2200,
    imagen: "/products/conservas/atúnNaturalLaCampagnola170.png",
    categoria: "Almacén",
    subcategoria: "Conservas",
    descripcion: "Atún al natural La Campagnola, 170g. Libre de gluten, sin TACC. Listo para consumir.",
    stock: 20
  },
  {
    id: 54,
    nombre: "Duraznos en Almíbar Arcor 820g",
    precio: 2800,
    imagen: "/products/conservas/duraznosAlmíbarArcor820.png",
    categoria: "Almacén",
    subcategoria: "Conservas",
    descripcion: "Duraznos en almíbar Arcor, lata 820g. Libre de gluten, sin TACC.",
    stock: 20
  },
  {
    id: 55,
    nombre: "Leche Fresca La Serenísima Clásica 1L",
    precio: 1400,
    imagen: "/products/lacteos/lecheSachet1L.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Leche fresca clásica La Serenísima en sachet de 1 litro. Con 9 nutrientes esenciales.",
    stock: 20
  },
  {
    id: 56,
    nombre: "Manteca La Serenísima Clásica 200g",
    precio: 2600,
    imagen: "/products/lacteos/mantecaSerenisima200.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Manteca clásica La Serenísima, 200g. Sin TACC, apta para repostería y uso diario.",
    stock: 20
  },
  {
    id: 57,
    nombre: "Yogur Tregar Arándano 900g",
    precio: 2800,
    imagen: "/products/lacteos/yogurTregarLitro.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Yogur entero Tregar sabor arándano, 900g. Bebible, en sachet familiar.",
    stock: 20
  },
  {
    id: 58,
    nombre: "Fideos Spaghetti Matarazzo Nº3 500g",
    precio: 1400,
    imagen: "/products/pastas/fideosSpaghettiMatarazzo500.png",
    categoria: "Almacén",
    subcategoria: "Pastas frescas y secas",
    descripcion: "Fideos spaghetti Matarazzo Nº3, 500g. 100% sémola de trigo candeal, 0% colesterol.",
    stock: 20
  },
  {
    id: 59,
    nombre: "Lucchetti Codito 500g",
    precio: 1400,
    imagen: "/products/pastas/luccettiCodito.png",
    categoria: "Almacén",
    subcategoria: "Pastas frescas y secas",
    descripcion: "Fideos codito Lucchetti, 500g. Enriquecidos con vitaminas y minerales NutriVit Plus.",
    stock: 20
  },
  {
    id: 60,
    nombre: "Lucchetti Tallarín 500g",
    precio: 1400,
    imagen: "/products/pastas/luccettiTallarin.png",
    categoria: "Almacén",
    subcategoria: "Pastas frescas y secas",
    descripcion: "Fideos tallarín Lucchetti, 500g. Enriquecidos con vitaminas y minerales NutriVit Plus.",
    stock: 20
  },
  {
    id: 61,
    nombre: "Lucchetti Spaghetti 500g",
    precio: 1400,
    imagen: "/products/pastas/lucchettiSpaghetti.png",
    categoria: "Almacén",
    subcategoria: "Pastas frescas y secas",
    descripcion: "Fideos spaghetti Lucchetti, 500g. Enriquecidos con vitaminas y minerales NutriVit Plus.",
    stock: 20
  },
  {
    id: 62,
    nombre: "Lucchetti Tirabuzón Nº34 500g",
    precio: 1400,
    imagen: "/products/pastas/lucchettiTirabuzon.png",
    categoria: "Almacén",
    subcategoria: "Pastas frescas y secas",
    descripcion: "Fideos tirabuzón Nº34 Lucchetti, 500g. Enriquecidos con vitaminas y minerales NutriVit Plus.",
    stock: 20
  },
  {
    id: 63,
    nombre: "Matarazzo Spaghetti Libre de Gluten 500g",
    precio: 2200,
    imagen: "/products/pastas/matarazoSpaghettiSinGluten.png",
    categoria: "Almacén",
    subcategoria: "Pastas frescas y secas",
    descripcion: "Fideos spaghetti Matarazzo sin gluten, 500g. Aptos para celíacos, para toda la familia.",
    stock: 20
  },
  {
    id: 64,
    nombre: "Papitas Lay's Clásicas",
    precio: 1200,
    imagen: "/products/snacks/papitasLays.png",
    categoria: "Almacén",
    subcategoria: "Snacks",
    descripcion: "Papas fritas Lay's Clásicas. Solo 3 ingredientes: papa, aceite y sal.",
    stock: 20
  },
  {
    id: 65,
    nombre: "Aceite Girasol Cocinero 900ml",
    precio: 2800,
    imagen: "/products/almacen/aceiteCocinero900.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Aceite de girasol Cocinero, 900ml. Para todo uso, ideal para frituras y aderezos.",
    stock: 20
  },
  {
    id: 66,
    nombre: "Aceite Natura 900ml",
    precio: 2800,
    imagen: "/products/almacen/aceiteNatura900.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Aceite refinado de girasol Natura, 900ml. Refinado en frío, sin colesterol.",
    stock: 20
  },
  {
    id: 67,
    nombre: "Aceite Natura 1500ml",
    precio: 4200,
    imagen: "/products/almacen/aceiteNatura1500.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Aceite refinado de girasol Natura, 1500ml. Formato familiar, refinado en frío.",
    stock: 20
  },
  {
    id: 68,
    nombre: "Arroz Dos Hermanos Largo Fino 500g",
    precio: 1400,
    imagen: "/products/almacen/arrozDosHnosLF500.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Arroz largo fino Dos Hermanos, 500g. Sin TACC, calidad superior, industria argentina.",
    stock: 20
  },
  {
    id: 69,
    nombre: "Arroz Dos Hermanos Parboil 500g",
    precio: 1600,
    imagen: "/products/almacen/arrozDosHnosParboil500.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Arroz parboil Dos Hermanos, 500g. No se pasa, listo en 15 minutos. Sin TACC.",
    stock: 20
  },
  {
    id: 70,
    nombre: "Arroz Gallo Oro Parboil 500g",
    precio: 1800,
    imagen: "/products/almacen/arrozGalloOroParboil500.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Arroz parboil Gallo Oro, 500g. No se pasa ni se pega, con vitaminas y minerales.",
    stock: 20
  },
  {
    id: 71,
    nombre: "Arroz Mandisoví Largo Fino 1kg",
    precio: 2400,
    imagen: "/products/almacen/arrozMandisoviLF1000.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Arroz pulido Mandisoví tipo largo fino calidad 00000, 1kg. Industria argentina.",
    stock: 20
  },
  {
    id: 72,
    nombre: "Arroz Mandisoví Largo Fino 500g",
    precio: 1300,
    imagen: "/products/almacen/arrozMandisoviLg500.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Arroz pulido Mandisoví tipo largo fino calidad 00000, 500g. Industria argentina.",
    stock: 20
  },
  {
    id: 73,
    nombre: "Harina Pureza 0000 Ultra Refinada 1kg",
    precio: 1600,
    imagen: "/products/almacen/harina0000Pureza1000.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Harina 0000 ultra refinada Pureza, 1kg. Para pastas, repostería y pan. Con vitamina D.",
    stock: 20
  },
  {
    id: 74,
    nombre: "Harina Leudante Corona de Trigo 1kg",
    precio: 1600,
    imagen: "/products/almacen/harinaCoronaTrigoLeudante1000.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Harina leudante Corona de Trigo, 1kg. Fortificada con hierro y vitaminas, industria argentina.",
    stock: 20
  },
  {
    id: 75,
    nombre: "Harina Pureza Leudante 1kg",
    precio: 1600,
    imagen: "/products/almacen/harinaPurezaLeudante1000.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Harina leudante ultra refinada Pureza, 1kg. Ideal para repostería casera. Con vitamina D.",
    stock: 20
  },
  {
    id: 76,
    nombre: "Harina Pureza Especial Pizzas Caseras 1kg",
    precio: 1800,
    imagen: "/products/almacen/harinaPurezaPizzasCaseras1000.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Harina Pureza especial para pizzas caseras con levadura incluida, 1kg. Lista en 10 minutos.",
    stock: 20
  },
  {
    id: 77,
    nombre: "Lentejas Egran 400g",
    precio: 1400,
    imagen: "/products/almacen/lentejasEgran500.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Lentejas Egran súper rápidas, 400g. Sin remojo previo, listas en minutos.",
    stock: 20
  },
  {
    id: 78,
    nombre: "Polenta Presto Pronta 500g",
    precio: 1200,
    imagen: "/products/almacen/polentaPrestoPronta500.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Polenta instantánea Presto Pronta, 500g. Lista en minutos, textura cremosa y consistente.",
    stock: 20
  },
  {
    id: 79,
    nombre: "Puré Instantáneo Knorr 125g",
    precio: 1600,
    imagen: "/products/almacen/pureInstantaneoKnorr125.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Puré de papas instantáneo Knorr, 125g. Rinde 4 porciones, listo en minutos.",
    stock: 20
  },
  {
    id: 80,
    nombre: "Puré de Tomates De La Huerta 210g",
    precio: 900,
    imagen: "/products/almacen/pureTomateLaHuerta210.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Puré de tomates De La Huerta Baggio, 210g. Libre de gluten, sin TACC.",
    stock: 20
  },
  {
    id: 81,
    nombre: "Puré de Tomates De La Huerta 530g",
    precio: 1800,
    imagen: "/products/almacen/pureTomateLaHuerta530.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Puré de tomates De La Huerta Baggio, 530g. Libre de gluten, sin TACC. Formato familiar.",
    stock: 20
  },
  {
    id: 82,
    nombre: "Sopa Crema Knorr Receta del Chef 60g",
    precio: 1200,
    imagen: "/products/almacen/sopaCremaKnorr60.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Sopa crema Knorr Receta del Chef, 60g. Rinde 3 porciones, lista en minutos.",
    stock: 20
  },
  {
    id: 83,
    nombre: "Cerveza Stella Artois 1L",
    precio: 2200,
    imagen: "/products/bebidas/cervezaPilsenStellaArtois1000.png",
    categoria: "Bebidas",
    subcategoria: "Con alcohol",
    descripcion: "Cerveza pilsen Stella Artois, botella 1 litro. De origen belga, sabor suave y refrescante.",
    stock: 20
  },
  {
    id: 84,
    nombre: "Cerveza Rubia Quilmes Clásica 1L",
    precio: 1800,
    imagen: "/products/bebidas/cervezaRubiaQuilmes1000.png",
    categoria: "Bebidas",
    subcategoria: "Con alcohol",
    descripcion: "Cerveza rubia Quilmes Clásica, botella 1 litro. La cerveza argentina por excelencia.",
    stock: 20
  },
  {
    id: 85,
    nombre: "Fernet Branca 750ml",
    precio: 8500,
    imagen: "/products/bebidas/fernetBranca750.png",
    categoria: "Bebidas",
    subcategoria: "Con alcohol",
    descripcion: "Fernet Branca, 750ml. Bitter italiano de hierbas, el clásico para mezclar con Coca-Cola.",
    stock: 20
  },
  {
    id: 86,
    nombre: "Agua Mineral con Gas Bon Aqua 1.5L",
    precio: 1000,
    imagen: "/products/bebidas/aguaMineralConGasSoda1500.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Agua mineral con gas Bon Aqua, 1.5 litros. Refrescante y burbujeante.",
    stock: 20
  },
  {
    id: 87,
    nombre: "Agua Mineral sin Gas Villavicencio 1.5L",
    precio: 1000,
    imagen: "/products/bebidas/aguaMineralSinGasVillavicencio1500.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Agua mineral sin gas Villavicencio, 1.5 litros. Origen Mendoza, pureza natural.",
    stock: 20
  },
  {
    id: 88,
    nombre: "Amargo Serrano Terma 1.25L",
    precio: 1800,
    imagen: "/products/bebidas/amargoSerranoTerma1250.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Amargo Serrano Terma, 1.25 litros. Bebida de hierbas serranas, sin alcohol.",
    stock: 20
  },
  {
    id: 89,
    nombre: "Gatorade Naranja 500ml",
    precio: 1400,
    imagen: "/products/bebidas/bebidaIsotonicaGatorade500.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Bebida isotónica Gatorade sabor naranja, 500ml. Repone electrolitos y energía.",
    stock: 20
  },
  {
    id: 90,
    nombre: "Coca-Cola 2.25L",
    precio: 2200,
    imagen: "/products/bebidas/cocaCola2250.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Coca-Cola sabor original, botella 2.25 litros. La gaseosa más popular del mundo.",
    stock: 20
  },
  {
    id: 91,
    nombre: "Sprite 2.25L",
    precio: 2000,
    imagen: "/products/bebidas/sprite2250.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Sprite lima-limón, botella 2.25 litros. Gaseosa sin cafeína, sabor cítrico refrescante.",
    stock: 20
  },
  {
    id: 92,
    nombre: "Medallones Paty Finitas x2",
    precio: 2400,
    imagen: "/products/congelados/medallonesPaty.png",
    categoria: "Congelados",
    subcategoria: undefined,
    descripcion: "Medallones de carne vacuna Paty Finitas, pack x2. Precocidos, listos para la plancha o parrilla.",
    stock: 20
  },
  {
    id: 93,
    nombre: "Medallón Vegetariano Swift x4 300g",
    precio: 2800,
    imagen: "/products/congelados/medallonVegetariano.png",
    categoria: "Congelados",
    subcategoria: undefined,
    descripcion: "Medallones vegetarianos Swift de calabaza y choclo, x4 unidades 300g. Prefrito supercongelado.",
    stock: 20
  },
  { 
    id: 94, 
    nombre: "Alitas de Pollo (x kg)", 
    precio: 4200, 
    categoria: "Pollería", 
    imagen: alitasPolloImg,
    descripcion: "Alitas de pollo frescas, ideales para la parrilla o al horno. Precio por kilogramo.",
    stock: 20
  },
  { 
    id: 95, 
    nombre: "Medio Pollo (x kg)", 
    precio: 5800, 
    categoria: "Pollería", 
    imagen: medioPolloImg,
    descripcion: "Medio pollo fresco y limpio, listo para cocinar. Precio por kilogramo.",
    stock: 20
  },
  { 
    id: 96, 
    nombre: "Milanesas de Pollo (x kg)", 
    precio: 6500, 
    categoria: "Pollería", 
    imagen: milaPolloImg,
    descripcion: "Milanesas de pollo elaboradas con pechuga de primera calidad. Precio por kilogramo.",
    stock: 20
  },
  { 
    id: 97, 
    nombre: "Pata Muslo (x kg)", 
    precio: 4800, 
    categoria: "Pollería", 
    imagen: pataMusloImg,
    descripcion: "Cuartos traseros de pollo (pata y muslo) frescos. Precio por kilogramo.",
    stock: 20
  },
  { 
    id: 98, 
    nombre: "Pata de Pollo (x kg)", 
    precio: 3900, 
    categoria: "Pollería", 
    imagen: pataPolloImg,
    descripcion: "Patitas de pollo frescas, ideales para guisos o al horno. Precio por kilogramo.",
    stock: 20
  },
  { 
    id: 99, 
    nombre: "Pechugas de Pollo (x kg)", 
    precio: 7200, 
    categoria: "Pollería", 
    imagen: pechugasdePolloImg,
    descripcion: "Pechugas de pollo frescas, deshuesadas y sin piel. Precio por kilogramo.",
    stock: 20
  },
  { 
    id: 100, 
    nombre: "Pollo Entero (x kg)", 
    precio: 5200, 
    categoria: "Pollería", 
    imagen: polloEnteroImg,
    descripcion: "Pollo entero fresco de granja, calidad superior. Precio por kilogramo.",
    stock: 20
  }
];

const Catalogo = () => {
  const [selectedCat, setSelectedCat] = useState<string>("Todos");
  const [selectedSubcat, setSelectedSubcat] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [modalQuantity, setModalQuantity] = useState<number>(1);
  const { addToCart } = useCart();
  
  const subcats = SUBCATEGORIAS[selectedCat] || [];

  const handleCatChange = (cat: string) => {
    setSelectedCat(cat);
    if (cat === "Todos") {
      setSelectedSubcat(null);
      return;
    }
    const firstSub = SUBCATEGORIAS[cat]?.[0];
    setSelectedSubcat(firstSub || null);
  };

  const filtered = productos.filter((p) => {
    if (selectedCat === "Todos") return true;
    if (selectedSubcat) {
      return p.categoria === selectedCat && p.subcategoria === selectedSubcat;
    }
    return p.categoria === selectedCat;
  });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProduct(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setModalQuantity(1);
    }
  }, [selectedProduct]);

  const handleAddToCart = (e: React.MouseEvent, p: Producto, cant: number = 1) => {
    e.stopPropagation();
    addToCart({ nombre: p.nombre, precio: p.precio }, cant);
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString("es-AR")}`;
  };

  return (
    <section id="catalogo" className="bg-section-alt py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary text-center mb-8">
          NUESTROS PRODUCTOS
        </h2>

        {/* Filter System */}
        <div className="flex flex-col gap-4 mb-10">
          {/* Main Categories */}
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIAS.map((c) => (
              <button
                key={c}
                onClick={() => handleCatChange(c)}
                className={`min-h-[44px] px-6 py-2 rounded-full font-heading text-[16px] font-bold transition-all ${
                  selectedCat === c 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "bg-[#F0F0F0] text-gray-600 hover:bg-gray-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Subcategories (Conditional) */}
          {subcats.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 animate-in slide-in-from-top-2 duration-300">
              {subcats.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSubcat(s)}
                  className={`min-h-[38px] px-4 py-1 rounded-full font-body text-[14px] font-semibold border transition-all ${
                    selectedSubcat === s 
                      ? "bg-green-100 border-green-600 text-green-700" 
                      : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filtered.map((p) => (
            <div 
              key={p.id} 
              className="bg-white rounded-[16px] overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full relative"
              onClick={() => setSelectedProduct(p)}
            >
              {/* Product Image */}
              <div className="w-full h-36 bg-[#FAFAFA] p-4 flex items-center justify-center relative">
                <img 
                  src={p.imagen} 
                  alt={p.nombre} 
                  className="w-full h-full object-contain transition-transform group-hover:scale-105 duration-500" 
                  loading="lazy" 
                />
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col flex-1">
                <div className="mb-2 flex flex-col items-center text-center">
                  <span className="inline-block w-fit bg-green-100 text-green-700 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-2">
                    {p.subcategoria || p.categoria}
                  </span>
                  <h3 className="font-body text-[16px] font-bold text-gray-800 leading-tight min-h-[40px] text-center">
                    {p.nombre}
                  </h3>
                </div>

                <div className="mt-auto pt-4 flex flex-col gap-3 text-center">
                  <span className="font-heading text-xl font-bold text-primary">
                    {formatPrice(p.precio)} {p.unidadPrecio && <span className="text-sm font-body text-gray-400">/ {p.unidadPrecio}</span>}
                  </span>
                  <button
                    onClick={(e) => handleAddToCart(e, p)}
                    className="w-full bg-primary text-white h-[44px] px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors shadow-sm"
                  >
                    <Plus size={18} />
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-400 font-body text-lg italic">
                Próximamente más productos en esta sección...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
          <div className="relative bg-white w-full max-w-4xl rounded-[24px] overflow-y-auto shadow-2xl flex flex-col md:flex-row max-h-[90vh] [-webkit-overflow-scrolling:touch]">
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="absolute top-4 right-4 z-20 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-primary hover:text-white transition-all border shadow-sm text-gray-700"
            >
              <X size={24} />
            </button>
            
            {/* Image Section */}
            <div className="w-full md:w-1/2 bg-[#FAFAFA] p-8 flex items-center justify-center border-r border-gray-100">
              <img 
                src={selectedProduct.imagen} 
                alt={selectedProduct.nombre} 
                className="w-full h-auto max-h-[400px] object-contain drop-shadow-md" 
              />
            </div>
            
            {/* Content Section */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-primary/5 text-primary text-[12px] font-bold px-3 py-1 rounded-full border border-primary/10">
                    {selectedProduct.categoria}
                  </span>
                  {selectedProduct.subcategoria && (
                    <span className="bg-green-100 text-green-700 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {selectedProduct.subcategoria}
                    </span>
                  )}
                </div>
                
                <h2 className="font-heading text-2xl md:text-4xl font-extrabold text-[#222222] leading-tight mb-4">
                  {selectedProduct.nombre}
                </h2>
                
                <p className="font-body text-gray-600 text-base leading-relaxed mb-6">
                  {selectedProduct.descripcion}
                </p>
                
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-gray-500 font-semibold text-base uppercase tracking-wide">
                    Stock: {selectedProduct.stock} unidades
                  </span>
                </div>
                
                <div className="mb-8 text-center">
                  <span className="font-heading text-4xl md:text-5xl font-black text-primary">
                    {formatPrice(selectedProduct.precio)} {selectedProduct.unidadPrecio && <span className="text-xl md:text-2xl font-body text-gray-400 font-bold">/ {selectedProduct.unidadPrecio}</span>}
                  </span>
                </div>
              </div>

              {/* Footer Modal */}
              <div className="mt-auto flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-1 w-full sm:w-auto border border-gray-100">
                  <button
                    onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                    className="h-11 w-11 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="font-body px-6 text-xl font-bold text-gray-800">
                    {modalQuantity}
                  </span>
                  <button
                    onClick={() => setModalQuantity(Math.min(selectedProduct.stock, modalQuantity + 1))}
                    disabled={modalQuantity >= selectedProduct.stock}
                    className="h-11 w-11 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-xl transition-all disabled:opacity-30"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <button
                  onClick={(e) => {
                    handleAddToCart(e, selectedProduct, modalQuantity);
                    setSelectedProduct(null);
                  }}
                  className="bg-primary text-white flex-1 w-full h-14 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ShoppingCart size={22} />
                  Agregar al Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Catalogo;
