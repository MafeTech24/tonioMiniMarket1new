import { useState, useEffect } from "react";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";



interface Presentacion {
  nombre: string;
  precio: number;
}

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
  esAGranel?: boolean;
  esFactura?: boolean;
  esEmpanada?: boolean;
  preciosMultiples?: {
    unidad: number;
    mediaDocena: number;
    docena: number;
  };
  sabores?: string[];
  presentaciones?: Presentacion[];
}

const CATEGORIAS = [
  "Todos",
  "Almacén",
  "Bebidas",
  "Congelados",
  "Kiosco",
  "Panificación",
  "Pollería",
  "Comidas listas",
  "Limpieza y Perfumería",
  // "Mascotas"
];

const SUBCATEGORIAS: Record<string, string[]> = {
  "Almacén": ["Aderezos", "Condimentos", "Conservas", "Desayuno", "Fiambres", "Lácteos", /*"Panadería",*/ "Pastas frescas y secas"],
  "Bebidas": ["Con alcohol", "Sin alcohol"]
};

const productos: Producto[] = [
  {
    id: 1,
    nombre: "Azúcar Ledesma Clásica 1kg",
    precio: 1900,
    imagen: "/products/desayuno/azucarLedesma1000.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Azúcar común tipo A, libre de gluten. Ideal para endulzar infusiones y preparaciones.",
    stock: 20 
  },
  /*
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
  */
  {
    id: 5,
    nombre: "Café Instantáneo Dolca 170g",
    precio: 10550,
    imagen: "/products/desayuno/cafeInstantaneoDolca170.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Café instantáneo Nescafé Dolca Original en frasco de 170g. 100% café de origen responsable.",
    stock: 20
  },
   {
    id: 111,
    nombre: "Café La Virginia Doy Pack 100g",
    precio: 4300,
    imagen: "/products/desayuno/cafeLaVirginiaDoyPack100.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Café instantáneo torrado La Virginia pack ahorro 100g, formato doy pack recargable. Sin TACC, industria argentina.",
    stock: 20
  },
  {
    id: 6,
    nombre: "Café La Virginia Doy Pack 170g",
    precio: 6900,
    imagen: "/products/desayuno/cafeLaVirginiaDoyPack170.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Café instantáneo torrado La Virginia en formato doy pack recargable de 170g.",
    stock: 20
  }, 
  {
    id: 7,
    nombre: "Café La Virginia en Saquitos x20",
    precio: 5700,
    imagen: "/products/desayuno/cafeLaVirginiaenSaquitos20unid.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Café molido torrado La Virginia en saquitos individuales, caja x20 unidades de 5g cada uno.",
    stock: 20
  },
  {
    id: 8,
    nombre: "Café La Virginia Torrado 250g",
    precio: 5700,
    imagen: "/products/desayuno/cafeLaVirginiaTorrado250.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Café molido torrado clásico La Virginia, paquete de 250g. Sabor equilibrado y tradicional.",
    stock: 20
  },
  {
    id: 106,
    nombre: "Café La Virginia Torrado 500g",
    precio: 11400,
    imagen: "/products/desayuno/cafeLaVirginiaTorrado500.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Café molido torrado clásico La Virginia, paquete de 500g. Sabor equilibrado y tradicional, ideal para preparar en cafetera o filtro.",
    stock: 20
  },
  {
    id: 113,
    nombre: "Café La Virginia Torrado 1kg",
    precio: 22800,
    imagen: "/products/desayuno/cafeLaVirginiaTorrado1000.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Café molido torrado equilibrado La Virginia, paquete de 1kg. Sabor suave y balanceado, ideal para cafetera o filtro. Formato familiar ahorro.",
    stock: 20
  },
  {
    id: 9,
    nombre: "Chocolino La Virginia 180g",
    precio: 2000,
    imagen: "/products/desayuno/chocolino180.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Chispitas granuladas de chocolate La Virginia para agregar a la leche. Con vitamina B y zinc, 180g.",
    stock: 20
  },
  {
    id: 10,
    nombre: "Copos de Maíz con Azúcar x 100g",
    precio: 700,
    imagen: "/products/desayuno/coposMaizConAzucar.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Copos de maíz azucarados a granel. Precio por 100g.",
    stock: 20,
    unidadPrecio: "100g",
    esAGranel: true
  },
  {
    id: 11,
    nombre: "Copos de Maíz sin Azúcar x 100g",
    precio: 700,
    imagen: "/products/desayuno/coposMaizSinAzucar.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Copos de maíz sin azúcar a granel. Precio por 100g.",
    stock: 20,
    unidadPrecio: "100g",
    esAGranel: true
  },
  {
    id: 12,
    nombre: "Dulce de Leche La Serenísima Estilo Colonial 400g",
    precio: 3900,
    imagen: "/products/desayuno/dLecheEstiloColonialLaSerenisima400.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Dulce de leche estilo colonial La Serenísima, 400g. Sin TACC, libre de lactosa y sin gluten.",
    stock: 20
  },
  {
    id: 13,
    nombre: "Edulcorante Hileret Clásico 280g",
    precio: 2600,
    imagen: "/products/desayuno/edulcoranteHileretClasico280.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Edulcorante líquido clásico Hileret en frasco de 280g. Sin calorías, apto para diabéticos.",
    stock: 20
  },
  {
    id: 14,
    nombre: "Edulcorante Líquido Sweet Hileret 200ml",
    precio: 3500,
    imagen: "/products/desayuno/EdulcoranteLíquidoSweetHileret200.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Edulcorante líquido Sweet Hileret, 200ml. Sin calorías, ideal para endulzar infusiones y postres.",
    stock: 20
  },
  {
    id: 15,
    nombre: "Edulcorante Si Diet 250ml",
    precio: 1900,
    imagen: "/products/desayuno/edulcoranteSiDiet250.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Edulcorante líquido Si Diet, 250ml. Sin calorías, sabor clásico para uso diario.",
    stock: 20
  },
  {
    id: 16,
    nombre: "Stevia Tuy x100 sobres",
    precio: 2000,
    imagen: "/products/desayuno/edulcoranteSteviaTuy100.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Edulcorante en sobres de stevia natural Tuy, caja x100 unidades. Sin calorías, origen vegetal.",
    stock: 20
  },
  {
    id: 110,
    nombre: "Edulcorante Si Diet 500ml",
    precio: 3100,
    imagen: "/products/desayuno/edulcoranteSiDiet500.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Edulcorante líquido Si Diet Clásico, 500ml. Sin calorías, sabor clásico para uso diario. Formato familiar ahorro.",
    stock: 20
  },
  {
    id: 17,
    nombre: "Galletas Criollitas x3",
    precio: 2100,
    imagen: "/products/desayuno/galletasCriollitasx3.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas de agua Criollitas Bagley, pack familiar x3 paquetes, 300g total. Clásicas y versátiles.",
    stock: 20
  },
  {
    id: 18,
    nombre: "Galletas Mediatarde x3",
    precio: 1700,
    imagen: "/products/desayuno/galletasMediatardex3.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas crackers Mediatarde Lia, pack x3 paquetes. Clásicas para acompañar infusiones.",
    stock: 20
  },
  {
    id: 19,
    nombre: "Oreo Sin TACC",
    precio: 2700,
    imagen: "/products/desayuno/galletasOreoSinTacc.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas Oreo certificadas Sin TACC, aptas para celíacos. Rellenas de crema de vainilla.",
    stock: 20
  },
  {
    id: 20,
    nombre: "Galletas Traviatas x3",
    precio: 2200,
    imagen: "/products/desayuno/galletasTraviatax3.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas de agua Traviata Bagley sabor original, pack familiar x3.",
    stock: 20
  },
  {
    id: 21,
    nombre: "Galletas Oreos Clásicas",
    precio: 2200,
    imagen: "/products/desayuno/galletasOreo.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas Oreo clásicas rellenas de crema de vainilla.",
    stock: 20
  },
  /*
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
  */
  {
    id: 24,
    nombre: "Mermelada Durazno Arcor 454g",
    precio: 3800,
    imagen: "/products/desayuno/mermeladaDuraznoArcor454.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Mermelada de durazno Arcor, frasco de 454g. Elaborada con fruta seleccionada, sin TACC.",
    stock: 20
  },
  {
    id: 501,
    nombre: "Mermelada Arcor light Durazno 390gr",
    precio: 4100,
    imagen: "/products/desayuno/mermeladaDuraznoArcorLight390gr.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Mermelada Arcor light sabor durazno, 390gr.",
    stock: 20
  },
  /*{
    id: 25,
    nombre: "Stevia en Polvo Hileret 50g",
    precio: 3650,
    imagen: "/products/desayuno/steviaPolvoHileret50.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Edulcorante stevia en polvo Hileret, 50g. Libre de gluten, sin calorías, mismo dulzor que el azúcar.",
    stock: 20
  },*/
  {
    id: 28,
    nombre: "Té La Virginia x25 saquitos",
    precio: 950,
    imagen: "/products/desayuno/teLaVirginia25.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Té negro La Virginia en saquitos, caja x25 unidades. Sabor suave y equilibrado, industria argentina.",
    stock: 20
  },
  {
    id: 29,
    nombre: "Té La Virginia x50 saquitos",
    precio: 1800,
    imagen: "/products/desayuno/teLaVirginia50.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Té negro La Virginia en saquitos, caja x50 unidades. Formato familiar, sabor clásico.",
    stock: 20
  },
  {
    id: 107,
    nombre: "Té Velez x25 saquitos",
    precio: 800,
    imagen: "/products/desayuno/teVelez25.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Té negro Velez en saquitos, caja x25 unidades. Sabor suave y tradicional, industria argentina.",
    stock: 20
  },
  {
    id: 108,
    nombre: "Mate Cocido Litoral x25 saquitos",
    precio: 1300,
    imagen: "/products/desayuno/matecocidoLitoral25.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Mate cocido Litoral La Virginia en saquitos, caja x25 unidades de 3g. Yerba mate elaborada, único como la amistad.",
    stock: 20
  },
  {
    id: 109,
    nombre: "Mate Cocido Litoral x50 saquitos",
    precio: 2400,
    imagen: "/products/desayuno/matecocidoLitoral50.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Mate cocido Litoral La Virginia en saquitos sin envoltura, caja x50 unidades. Yerba mate sin palo, formato ahorro.",
    stock: 20
  },
  /*
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
  */
  {
    id: 32,
    nombre: "Yerba Amanda 500g",
    precio: 2300,
    imagen: "/products/desayuno/yerbaAmanda500.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Yerba mate elaborada Amanda, 500g. Libre de gluten, sabor suave y parejo, industria argentina.",
    stock: 20
  },
  {
    id: 33,
    nombre: "Yerba CBSé Hierbas Serranas 500g",
    precio: 2100,
    imagen: "/products/desayuno/yerbaCBSe500.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Yerba mate CBSé compuesta con hierbas serranas, 500g. Sin TACC, sabor herbal característico.",
    stock: 20
  },
  {
    id: 34,
    nombre: "Yerba Playadito 1kg",
    precio: 2900,
    imagen: "/products/desayuno/yerbaPlayadito500.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Yerba mate Playadito elaborada con palo, 1kg. Origen Colonia Liebig, Corrientes. Desde 1926.",
    stock: 20
  },
  {
    id: 35,
    nombre: "Yerba Rosamonte 500g",
    precio: 2400,
    imagen: "/products/desayuno/yerbaRosamonte500.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Yerba mate Rosamonte, 500g. Sabor intenso y persistente, una de las marcas más reconocidas del país.",
    stock: 20
  },
  {
    id: 36,
    nombre: "Yerba Verdeflor Hierbas Serranas 500g",
    precio: 1950,
    imagen: "/products/desayuno/yerbaVerdeFlor500.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Yerba mate Verdeflor elaborada con palo and hierbas serranas, 500g. Suave, digestiva y sin acidez.",
    stock: 20
  },
  {
    id: 37,
    nombre: "Nesquik Original 180g",
    precio: 2300,
    imagen: "/products/desayuno/cacaoNesquik180.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Cacao en polvo instantáneo Nestlé Nesquik, 180g. Enriquecido con vitaminas y minerales, libre de gluten.",
    stock: 20
  },
  /*{
    id: 38,
    nombre: "Aceto Balsámico Casalta 250ml",
    precio: 1900,
    imagen: "/products/aderezos/acetoBalsámicoCasalta250.png",
    categoria: "Almacén",
    subcategoria: "Aderezos",
    descripcion: "Aceto balsámico de Módena Casalta, 250ml. Ideal para aderezar ensaladas y carnes.",
    stock: 20
  },*/
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
    precio: 1700,
    imagen: "/products/aderezos/ketchupDanica250.png",
    categoria: "Almacén",
    subcategoria: "Aderezos",
    descripcion: "Ketchup Dánica elaborado con tomates de la huerta, 190g. Sin TACC.",
    stock: 20
  },
  {
    id: 41,
    nombre: "Mayonesa Dánica 250cm³",
    precio: 1300,
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
    nombre: "Mayonesa Natura 125gr",
    precio: 1900,
    imagen: "/products/aderezos/mayonesaNatura125.png",
    categoria: "Almacén",
    subcategoria: "Aderezos",
    descripcion: "Mayonesa Natura con jugo de limón, 125cm³. Reducida en valor lipídico, sin TACC.",
    stock: 20
  },
  {
    id: 44,
    nombre: "Mayonesa Natura 250gr",
    precio: 2200,
    imagen: "/products/aderezos/mayonesaNatura250.png",
    categoria: "Almacén",
    subcategoria: "Aderezos",
    descripcion: "Mayonesa Natura con jugo de limón, 250cm³. Reducida en valor lipídico, sin TACC.",
    stock: 20
  },
  {
    id: 45,
    nombre: "Mayonesa Natura 500gr",
    precio: 3400,
    imagen: "/products/aderezos/mayonesaNatura500.png",
    categoria: "Almacén",
    subcategoria: "Aderezos",
    descripcion: "Mayonesa Natura con jugo de limón, 500cm³. Formato familiar, reducida en valor lipídico.",
    stock: 20
  },
  {
    id: 46,
    nombre: "Mostaza Dánica 250g",
    precio: 1300,
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
    precio: 1800,
    imagen: "/products/aderezos/salsaGolfDanica250.png",
    categoria: "Almacén",
    subcategoria: "Aderezos",
    descripcion: "Salsa golf Dánica, 300g. Combinación de mayonesa y ketchup, ideal para ensaladas y mariscos.",
    stock: 20
  },
  /*{
    id: 49,
    nombre: "Pimienta Negra Molida Dos Anclas 25g",
    precio: 900,
    imagen: "/products/condimentos/pimientaNegraMolidaDosAnclas25.png",
    categoria: "Almacén",
    subcategoria: "Condimentos",
    descripcion: "Pimienta negra molida Dos Anclas, 25g. Especia de uso diario para todo tipo de preparaciones.",
    stock: 20
  },*/
  {
    id: 502,
    nombre: "Pimienta Negra Molida Alikante 25gr",
    precio: 1200,
    imagen: "/products/condimentos/pimientaNegraMolidaAlikante25.png",
    categoria: "Almacén",
    subcategoria: "Condimentos",
    descripcion: "Pimienta negra molida Alikante, 25gr.",
    stock: 20
  },
  {
    id: 50,
    nombre: "Sal Fina Celusal 500g",
    precio: 1200,
    imagen: "/products/condimentos/salFinaCelusal500.png",
    categoria: "Almacén",
    subcategoria: "Condimentos",
    descripcion: "Sal fina de mesa Celusal, 500g. Sal natural de origen argentino para uso cotidiano.",
    stock: 20
  },
  {
    id: 51,
    nombre: "Sal Gruesa Celusal 1kg",
    precio: 2300,
    imagen: "/products/condimentos/salGruesaCelusal1000.png",
    categoria: "Almacén",
    subcategoria: "Condimentos",
    descripcion: "Sal gruesa Celusal, 1kg. Ideal para cocción de pastas y vegetales.",
    stock: 20
  },
  {
    id: 52,
    nombre: "Sal Parrillera Celusal 1kg",
    precio: 2300,
    imagen: "/products/condimentos/salParrilleraCelusal1000.png",
    categoria: "Almacén",
    subcategoria: "Condimentos",
    descripcion: "Sal entrefina Celusal para parrilla, 1kg. Especial para carnes asadas y embutidos caseros.",
    stock: 20
  },  
  /*{
    id: 54,
    nombre: "Duraznos en Almíbar Arcor 820g",
    precio: 2800,
    imagen: "/products/conservas/duraznosAlmíbarArcor820.png",
    categoria: "Almacén",
    subcategoria: "Conservas",
    descripcion: "Duraznos en almíbar Arcor, lata 820g. Libre de gluten, sin TACC.",
    stock: 20
  },*/
  {
    id: 55,
    nombre: "Leche La Serenísima Entera 1L",
    precio: 2400,
    imagen: "/products/lacteos/lecheSachet1L.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Leche entera La Serenísima en sachet de 1 litro. Con 9 nutrientes esenciales.",
    stock: 20
  },
  {
    id: 56,
    nombre: "Manteca La Serenísima Clásica 200g",
    precio: 5500,
    imagen: "/products/lacteos/mantecaSerenisima200.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Manteca clásica La Serenísima, 200g. Sin TACC, apta para repostería y uso diario.",
    stock: 20
  },
  {
    id: 57,
    nombre: "Yogur Tregar Arándano 900g",
    precio: 2200,
    imagen: "/products/lacteos/yogurTregarLitro.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Yogur entero Tregar sabor arándano, 900g. Bebible, en sachet familiar.",
    stock: 20
  },
  {
    id: 300,
    nombre: "Leche Armonía Clásica 1L",
    precio: 2100,
    imagen: "/products/lacteos/lecheArmoniaSachet.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Leche Armonía en sachet de 1 litro.",
    stock: 20
  },
  {
    id: 301,
    nombre: "Leche La Serenísima Descremada 1L",
    precio: 2400,
    imagen: "/products/lacteos/lecheSachetDescremadaLS1L.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Leche La Serenísima descremada en sachet de 1 litro.",
    stock: 20
  },
  {
    id: 302,
    nombre: "Leche La Serenísima Zero Lactosa 1L",
    precio: 2800,
    imagen: "/products/lacteos/lecheZeroLactosaLS.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Leche La Serenísima Zero Lactosa de 1 litro.",
    stock: 20
  },
  {
    id: 303,
    nombre: "Crema de Leche Tonadita",
    precio: 2400,
    imagen: "/products/lacteos/cremaTonadita.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Crema de leche Tonadita.",
    stock: 20
  },
  {
    id: 304,
    nombre: "Crema de Leche DJ",
    precio: 1800,
    imagen: "/products/lacteos/cremaDJ.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Crema de leche DJ.",
    stock: 20
  },
  {
    id: 305,
    nombre: "Crema de Leche Milkaut 200g",
    precio: 2500,
    imagen: "/products/lacteos/cremaMilkaut200.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Crema de leche Milkaut de 200g.",
    stock: 20
  },
  {
    id: 306,
    nombre: "Crema de Leche Milkaut 350g",
    precio: 3900,
    imagen: "/products/lacteos/cremaMilkaut350.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Crema de leche Milkaut de 350g.",
    stock: 20
  },
  {
    id: 307,
    nombre: "Queso Untable Clásico La Paulina",
    precio: 2500,
    imagen: "/products/lacteos/quesoUntableClasicoLaPaulina.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Queso untable clásico La Paulina, entero.",
    stock: 20
  },
  {
    id: 308,
    nombre: "Queso Untable Port Salud La Paulina",
    precio: 2500,
    imagen: "/products/lacteos/quesoUntablePortSaludLaPaulina.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Queso untable Port Salud La Paulina.",
    stock: 20
  },
  {
    id: 309,
    nombre: "Queso Untable Port Salud Equilibrio La Paulina",
    precio: 2500,
    imagen: "/products/lacteos/quesoUntablePortSaludEquilibrioLaPaulina.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Queso untable Port Salud Equilibrio La Paulina, descremado.",
    stock: 20
  },
  {
    id: 310,
    nombre: "Queso Untable 4 Quesos La Paulina",
    precio: 2500,
    imagen: "/products/lacteos/quesoUntable4quesosLaPaulina.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Queso untable sabor 4 quesos La Paulina.",
    stock: 20
  },
  {
    id: 311,
    nombre: "Queso Untable Azul La Paulina",
    precio: 2500,
    imagen: "/products/lacteos/quesoUntableAzulLaPaulina.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Queso untable sabor queso azul La Paulina.",
    stock: 20
  },
  {
    id: 312,
    nombre: "Queso Untable Cheddar La Paulina",
    precio: 2500,
    imagen: "/products/lacteos/quesoUntableCheddarLaPaulina.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Queso untable sabor cheddar La Paulina.",
    stock: 20
  },
  {
    id: 313,
    nombre: "Queso Untable Fontina La Paulina",
    precio: 2500,
    imagen: "/products/lacteos/quesoUntableFontinaLaPaulina.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Queso untable sabor fontina La Paulina.",
    stock: 20
  },
  {
    id: 314,
    nombre: "Queso Untable Jamón La Paulina",
    precio: 2500,
    imagen: "/products/lacteos/quesoUntableJamonLaPaulina.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Queso untable sabor jamón La Paulina.",
    stock: 20
  },
  {
    id: 315,
    nombre: "Queso Crema Tradicional La Paulina",
    precio: 3300,
    imagen: "/products/lacteos/quesoCremaTradicionalLaPaulina.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Queso crema tradicional La Paulina.",
    stock: 20
  },
  {
    id: 316,
    nombre: "Queso Crema Light La Paulina",
    precio: 3300,
    imagen: "/products/lacteos/quesoCremaLightLaPaulina.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Queso crema light La Paulina.",
    stock: 20
  },
  {
    id: 350,
    nombre: "Manteca La Serenísima 100g",
    precio: 2400,
    imagen: "/products/lacteos/mantecaSerenisima100.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Manteca clásica La Serenísima, 100g.",
    stock: 20
  },
  {
    id: 351,
    nombre: "Yogur Cremoso Tregar Dulce de Leche",
    precio: 700,
    imagen: "/products/lacteos/yogurtCremosoDLTregar.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Yogur cremoso Tregar sabor dulce de leche.",
    stock: 20
  },
  {
    id: 352,
    nombre: "Yogur Cremoso Tregar Frutilla",
    precio: 700,
    imagen: "/products/lacteos/yogurtCremosoFrutillaTregar.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Yogur cremoso Tregar sabor frutilla.",
    stock: 20
  },
  {
    id: 353,
    nombre: "Yogur Cremoso Tregar Vainilla",
    precio: 700,
    imagen: "/products/lacteos/yogurtCremosoVainillaTregar.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Yogur cremoso Tregar sabor vainilla.",
    stock: 20
  },
  {
    id: 354,
    nombre: "Yogur con Frutas Tregar Ananá",
    precio: 1200,
    imagen: "/products/lacteos/yogurtFrutaAnanaTregar.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Yogur con trozos de frutas Tregar sabor ananá.",
    stock: 20
  },
  {
    id: 355,
    nombre: "Yogur con Frutas Tregar Arándano",
    precio: 1200,
    imagen: "/products/lacteos/yogurtFrutaArandanoTregar.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Yogur con trozos de frutas Tregar sabor arándano.",
    stock: 20
  },
  {
    id: 356,
    nombre: "Yogur con Frutas Tregar Cereza",
    precio: 1200,
    imagen: "/products/lacteos/yogurtFrutaCerezaTregar.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Yogur con trozos de frutas Tregar sabor cereza.",
    stock: 20
  },
  {
    id: 357,
    nombre: "Yogur con Frutas Tregar Durazno",
    precio: 1200,
    imagen: "/products/lacteos/yogurtFrutaDuraznoTregar.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Yogur con trozos de frutas Tregar sabor durazno.",
    stock: 20
  },
  {
    id: 358,
    nombre: "Yogur con Frutas Tregar Frutilla",
    precio: 1200,
    imagen: "/products/lacteos/yogurtFrutaFrutillaTregar.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Yogur con trozos de frutas Tregar sabor frutilla.",
    stock: 20
  },
  {
    id: 359,
    nombre: "Yogur con Frutas Tregar Mango",
    precio: 1200,
    imagen: "/products/lacteos/yogurtFrutaMangoTregar.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Yogur con trozos de frutas Tregar sabor mango.",
    stock: 20
  },
  {
    id: 360,
    nombre: "Yogur Natural Endulzado Tregar",
    precio: 1000,
    imagen: "/products/lacteos/yogurtNaturalEndulzadoTregar.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Yogur natural endulzado Tregar, presentación chica.",
    stock: 20
  },
  {
    id: 361,
    nombre: "Yogur Natural Sin Azúcar Tregar",
    precio: 1000,
    imagen: "/products/lacteos/yogurtNaturalSinAzucarTregar.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Yogur natural sin azúcar Tregar, presentación chica.",
    stock: 20
  },
  {
    id: 362,
    nombre: "Yogur Natural Endulzado Tregar Grande",
    precio: 1900,
    imagen: "/products/lacteos/yogurtNaturalEndulzadoGrandeTregar.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Yogur natural endulzado Tregar, presentación grande.",
    stock: 20
  },
  {
    id: 363,
    nombre: "Yogur Natural Sin Azúcar Tregar Grande",
    precio: 1900,
    imagen: "/products/lacteos/yogurtNaturalSinAzucarGrandeTregar.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Yogur natural sin azúcar Tregar, presentación grande.",
    stock: 20
  },
  /*{
    id: 58,
    nombre: "Fideos Spaghetti Matarazzo Nº3 500g",
    precio: 1850,
    imagen: "/products/pastas/fideosSpaghettiMatarazzo500.png",
    categoria: "Almacén",
    subcategoria: "Pastas frescas y secas",
    descripcion: "Fideos spaghetti Matarazzo Nº3, 500g. 100% sémola de trigo candeal, 0% colesterol.",
    stock: 20
  },*/
  {
    id: 59,
    nombre: "Lucchetti Codito 500g",
    precio: 1600,
    imagen: "/products/pastas/luccettiCodito.png",
    categoria: "Almacén",
    subcategoria: "Pastas frescas y secas",
    descripcion: "Fideos codito Lucchetti, 500g. Enriquecidos con vitaminas y minerales NutriVit Plus.",
    stock: 20
  },
  {
    id: 60,
    nombre: "Lucchetti Tallarín 500g",
    precio: 1600,
    imagen: "/products/pastas/luccettiTallarin.png",
    categoria: "Almacén",
    subcategoria: "Pastas frescas y secas",
    descripcion: "Fideos tallarín Lucchetti, 500g. Enriquecidos con vitaminas y minerales NutriVit Plus.",
    stock: 20
  },
  {
    id: 61,
    nombre: "Lucchetti Spaghetti 500g",
    precio: 1600,
    imagen: "/products/pastas/lucchettiSpaghetti.png",
    categoria: "Almacén",
    subcategoria: "Pastas frescas y secas",
    descripcion: "Fideos spaghetti Lucchetti, 500g. Enriquecidos con vitaminas y minerales NutriVit Plus.",
    stock: 20
  },
  {
    id: 62,
    nombre: "Lucchetti Tirabuzón Nº34 500g",
    precio: 1600,
    imagen: "/products/pastas/lucchettiTirabuzon.png",
    categoria: "Almacén",
    subcategoria: "Pastas frescas y secas",
    descripcion: "Fideos tirabuzón Nº34 Lucchetti, 500g. Enriquecidos con vitaminas y minerales NutriVit Plus.",
    stock: 20
  },
  {
    id: 63,
    nombre: "Matarazzo Spaghetti Libre de Gluten 500g",
    precio: 4100,
    imagen: "/products/pastas/matarazoSpaghettiSinGluten.png",
    categoria: "Almacén",
    subcategoria: "Pastas frescas y secas",
    descripcion: "Fideos spaghetti Matarazzo sin gluten, 500g. Aptos para celíacos, para toda la familia.",
    stock: 20
  },
  /*{
    id: 65,
    nombre: "Aceite Girasol Cocinero 900ml",
    precio: 2800,
    imagen: "/products/almacen/aceiteCocinero900.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Aceite de girasol Cocinero, 900ml. Para todo uso, ideal para frituras y aderezos.",
    stock: 20
  },*/
  {
    id: 66,
    nombre: "Aceite Natura 900ml",
    precio: 4600,
    imagen: "/products/almacen/aceiteNatura900.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Aceite refinado de girasol Natura, 900ml. Refinado en frío, sin colesterol.",
    stock: 20
  },
  {
    id: 67,
    nombre: "Aceite Natura 1500ml",
    precio: 6800,
    imagen: "/products/almacen/aceiteNatura1500.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Aceite refinado de girasol Natura, 1500ml. Formato familiar, refinado en frío.",
    stock: 20
  },
  {
    id: 68,
    nombre: "Arroz Dos Hermanos Largo Fino 500g",
    precio: 900,
    imagen: "/products/almacen/arrozDosHnosLF500.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Arroz largo fino Dos Hermanos, 500g. Sin TACC, calidad superior, industria argentina.",
    stock: 20
  },
  {
    id: 69,
    nombre: "Arroz Dos Hermanos Parboil 500g",
    precio: 1200,
    imagen: "/products/almacen/arrozDosHnosParboil500.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Arroz parboil Dos Hermanos, 500g. No se pasa, listo en 15 minutos. Sin TACC.",
    stock: 20
  },
  {
    id: 70,
    nombre: "Arroz Gallo Oro Parboil 500g",
    precio: 1400,
    imagen: "/products/almacen/arrozGalloOroParboil500.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Arroz parboil Gallo Oro, 500g. No se pasa ni se pega, con vitaminas y minerales.",
    stock: 20
  },
  {
    id: 71,
    nombre: "Arroz Mandisoví Largo Fino 1kg",
    precio: 1400,
    imagen: "/products/almacen/arrozMandisoviLF1000.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Arroz pulido Mandisoví tipo largo fino calidad 00000, 1kg. Industria argentina.",
    stock: 20
  },
  {
    id: 72,
    nombre: "Arroz Mandisoví Largo Fino 500g",
    precio: 800,
    imagen: "/products/almacen/arrozMandisoviLg500.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Arroz pulido Mandisoví tipo largo fino calidad 00000, 500g. Industria argentina.",
    stock: 20
  },
  {
    id: 73,
    nombre: "Harina Pureza 0000 Ultra Refinada 1kg",
    precio: 1200,
    imagen: "/products/almacen/harina0000Pureza1000.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Harina 0000 ultra refinada Pureza, 1kg. Para pastas, repostería y pan. Con vitamina D.",
    stock: 20
  },
  {
    id: 74,
    nombre: "Harina Leudante Corona de Trigo 1kg",
    precio: 1400,
    imagen: "/products/almacen/harinaCoronaTrigoLeudante1000.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Harina leudante Corona de Trigo, 1kg. Fortificada con hierro y vitaminas, industria argentina.",
    stock: 20
  },
  {
    id: 75,
    nombre: "Harina Pureza Leudante 1kg",
    precio: 1500,
    imagen: "/products/almacen/harinaPurezaLeudante1000.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Harina leudante ultra refinada Pureza, 1kg. Ideal para repostería casera. Con vitamina D.",
    stock: 20
  },
  {
    id: 76,
    nombre: "Harina Pureza Especial Pizzas Caseras 1kg",
    precio: 1900,
    imagen: "/products/almacen/harinaPurezaPizzasCaseras1000.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Harina Pureza especial para pizzas caseras con levadura incluida, 1kg. Lista en 10 minutos.",
    stock: 20
  },
  {
    id: 77,
    nombre: "Lentejas Egran 400g",
    precio: 2600,
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
    id: 164,
    nombre: "Puré Instantáneo Mamá Cocina",
    precio: 1700,
    imagen: "/products/almacen/pureInstantaneoMamaCocina.png",
    categoria: "Almacén",
    descripcion: "Puré de papas instantáneo Mamá Cocina. Rinde varias porciones, listo en minutos. Sabor casero y cremoso.",
    stock: 20
  },
  {
    id: 80,
    nombre: "Puré de Tomates De La Huerta 210g",
    precio: 600,
    imagen: "/products/almacen/pureTomateLaHuerta210.png",
    categoria: "Almacén",
    subcategoria: undefined,
    descripcion: "Puré de tomates De La Huerta Baggio, 210g. Libre de gluten, sin TACC.",
    stock: 20
  },
  {
    id: 81,
    nombre: "Puré de Tomates De La Huerta 530g",
    precio: 1100,
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
    nombre: "Cerveza Stella Artois",
    precio: 3500,
    imagen: "/products/bebidas/cervezaStellaArtois.png",
    categoria: "Bebidas",
    subcategoria: "Con alcohol",
    descripcion: "Cerveza Stella Artois de origen belga. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "1L", precio: 5900 },
      { nombre: "LATA", precio: 3500 }
    ]
  },
  {
    id: 84,
    nombre: "Cerveza Quilmes",
    precio: 2200,
    imagen: "/products/bebidas/cervezaQuilmes.png",
    categoria: "Bebidas",
    subcategoria: "Con alcohol",
    descripcion: "Cerveza clásica Quilmes, la cerveza argentina por excelencia. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "1L", precio: 3700 },
      { nombre: "LATA", precio: 2200 }
    ]
  },
  {
    id: 85,
    nombre: "Fernet Branca 750ml",
    precio: 17800,
    imagen: "/products/bebidas/fernetBranca750.png",
    categoria: "Bebidas",
    subcategoria: "Con alcohol",
    descripcion: "Fernet Branca, 750ml. Bitter italiano de hierbas, el clásico para mezclar con Coca-Cola.",
    stock: 20
  },
  {
    id: 428,
    nombre: "VINO TORO BOTELLÓN ETIQUETA AMARILLA",
    precio: 3300,
    imagen: "/products/bebidas/vinoToroBotellonEtiqAmarilla.png",
    categoria: "Bebidas",
    subcategoria: "Con alcohol",
    descripcion: "Vino Toro botellón de etiqueta amarilla, un clásico de la mesa argentina.",
    stock: 20
  },
  {
    id: 429,
    nombre: "VINO VIÑAS DE BALBO TINTO",
    precio: 3300,
    imagen: "/products/bebidas/vinoVinasBalboTinto.png",
    categoria: "Bebidas",
    subcategoria: "Con alcohol",
    descripcion: "Vino tinto clásico Viñas de Balbo.",
    stock: 20
  },
  {
    id: 430,
    nombre: "VINO ESTANCIA MENDOZA CABERNET SAUVIGNON",
    precio: 3900,
    imagen: "/products/bebidas/vinoEstanciaMendozaCabernet.png",
    categoria: "Bebidas",
    subcategoria: "Con alcohol",
    descripcion: "Vino Estancia Mendoza varietal Cabernet Sauvignon.",
    stock: 20
  },
  {
    id: 431,
    nombre: "VINO ESTANCIA MENDOZA CHARDONNAY CHENIN",
    precio: 3900,
    imagen: "/products/bebidas/vinoEstanciaMendozaChenin.png",
    categoria: "Bebidas",
    subcategoria: "Con alcohol",
    descripcion: "Vino Estancia Mendoza varietal blanco Chardonnay Chenin.",
    stock: 20
  },
  {
    id: 432,
    nombre: "VINO ESTANCIA MENDOZA MALBEC",
    precio: 3900,
    imagen: "/products/bebidas/vinoEstanciaMendozaMalbec.png",
    categoria: "Bebidas",
    subcategoria: "Con alcohol",
    descripcion: "Vino Estancia Mendoza varietal Malbec.",
    stock: 20
  },
  {
    id: 86,
    nombre: "Agua Mineral con Gas Bon Aqua 1.5L",
    precio: 2500,
    imagen: "/products/bebidas/aguaMineralConGasSoda1500.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Agua mineral con gas Bon Aqua, 1.5 litros. Refrescante y burbujeante.",
    stock: 20
  },
  {
    id: 87,
    nombre: "Agua Mineral sin Gas Villavicencio 2L",
    precio: 2400,
    imagen: "/products/bebidas/aguaMineralSinGasVillavicencio2000.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Agua mineral sin gas Villavicencio, 2 litros. Origen Mendoza, pureza natural.",
    stock: 20
  },
  {
    id: 88,
    nombre: "Amargo Serrano Terma 1.25L",
    precio: 2500,
    imagen: "/products/bebidas/amargoSerranoTerma1250.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Amargo Serrano Terma, 1.25 litros. Bebida de hierbas serranas, sin alcohol.",
    stock: 20
  },
  {
    id: 89,
    nombre: "Bebida Energética Gatorade Naranja",
    precio: 2400,
    imagen: "/products/bebidas/gatoradeNaranja.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Bebida energética / isotónica Gatorade sabor naranja. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "500 ml", precio: 2400 },
      { nombre: "1 Litro", precio: 4500 }
    ]
  },

  {
    id: 90,
    nombre: "Coca-Cola",
    precio: 1800,
    imagen: "/products/bebidas/cocaCola.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Coca-Cola sabor original. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "500ML", precio: 1800 },
      { nombre: "LITRO", precio: 3200 },
      { nombre: "1,5L", precio: 4200 },
      { nombre: "2,25L", precio: 5300 }
    ]
  },

  {
    id: 601,
    nombre: "Coca-Cola Zero",
    precio: 1800,
    imagen: "/products/bebidas/cocaColaZeroBotella.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Coca-Cola Zero sabor original sin azúcar. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "500ML", precio: 1800 },
      { nombre: "LITRO", precio: 3200 },
      { nombre: "1,5L", precio: 4200 },
      { nombre: "2,25L", precio: 5300 }
    ]
  },
  {
    id: 622,
    nombre: "Sprite",
    precio: 1800,
    imagen: "/products/bebidas/spriteBotella.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Gaseosa Sprite sabor lima-limón refrescante. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "500ML", precio: 1800 },
      { nombre: "1L", precio: 3200 },
      { nombre: "1,5L", precio: 4200 },
      { nombre: "2,25L", precio: 5300 }
    ]
  },
  {
    id: 623,
    nombre: "Sprite Lata",
    precio: 1600,
    imagen: "/products/bebidas/spriteLata.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Gaseosa Sprite en lata de 354ml sabor lima-limón.",
    stock: 20,
    presentaciones: [
      { nombre: "LATA 354ML", precio: 1600 }
    ]
  },
  {
    id: 624,
    nombre: "Sprite Zero",
    precio: 1800,
    imagen: "/products/bebidas/spriteZeroBotella.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Gaseosa Sprite Zero sabor lima-limón sin azúcar. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "500ML", precio: 1800 },
      { nombre: "1L", precio: 3200 },
      { nombre: "1,5L", precio: 4200 },
      { nombre: "2,25L", precio: 5300 }
    ]
  },
  {
    id: 625,
    nombre: "Sprite Zero Lata",
    precio: 1600,
    imagen: "/products/bebidas/spriteLataZero.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Gaseosa Sprite Zero en lata de 354ml sabor lima-limón sin azúcar.",
    stock: 20,
    presentaciones: [
      { nombre: "LATA 354ML", precio: 1600 }
    ]
  },
  {
    id: 626,
    nombre: "Fanta",
    precio: 1800,
    imagen: "/products/bebidas/fantaBotella.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Gaseosa Fanta sabor naranja. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "500ML", precio: 1800 },
      { nombre: "1L", precio: 3200 },
      { nombre: "1,5L", precio: 4200 },
      { nombre: "2,25L", precio: 5300 }
    ]
  },
  {
    id: 627,
    nombre: "Fanta Lata",
    precio: 1600,
    imagen: "/products/bebidas/fantaLata.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Gaseosa Fanta en lata de 354ml sabor naranja.",
    stock: 20,
    presentaciones: [
      { nombre: "LATA 354ML", precio: 1600 }
    ]
  },
  {
    id: 628,
    nombre: "Fanta Zero",
    precio: 1800,
    imagen: "/products/bebidas/fantaZeroBotella.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Gaseosa Fanta Zero sabor naranja sin azúcar. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "500ML", precio: 1800 },
      { nombre: "1,5L", precio: 4200 }
    ]
  },
  {
    id: 629,
    nombre: "Fanta Zero Lata",
    precio: 1600,
    imagen: "/products/bebidas/fantaZeroLata.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Gaseosa Fanta Zero en lata de 354ml sabor naranja sin azúcar.",
    stock: 20,
    presentaciones: [
      { nombre: "LATA 354ML", precio: 1600 }
    ]
  },
  {
    id: 630,
    nombre: "Powerade Manzana",
    precio: 2400,
    imagen: "/products/bebidas/poweradeManzana.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Bebida isotónica Powerade sabor manzana. Repone electrolitos y energía.",
    stock: 20,
    presentaciones: [
      { nombre: "500ML", precio: 2400 },
      { nombre: "1L", precio: 3700 }
    ]
  },
  {
    id: 631,
    nombre: "Powerade Mountain Blast",
    precio: 2400,
    imagen: "/products/bebidas/poweradeMountainBlast.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Bebida isotónica Powerade sabor Mountain Blast. Repone electrolitos y energía.",
    stock: 20,
    presentaciones: [
      { nombre: "500ML", precio: 2400 },
      { nombre: "1L", precio: 3700 }
    ]
  },
  {
    id: 632,
    nombre: "Powerade Naranja",
    precio: 2400,
    imagen: "/products/bebidas/poweradeNaranja.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Bebida isotónica Powerade sabor naranja. Repone electrolitos y energía.",
    stock: 20,
    presentaciones: [
      { nombre: "500ML", precio: 2400 }
    ]
  },
  {
    id: 633,
    nombre: "Powerade Frutas Tropicales",
    precio: 2400,
    imagen: "/products/bebidas/poweradeFrutasTropicales.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Bebida isotónica Powerade sabor frutas tropicales. Repone electrolitos y energía.",
    stock: 20,
    presentaciones: [
      { nombre: "500ML", precio: 2400 }
    ]
  },
  {
    id: 634,
    nombre: "Monster Energy Green Lata 473cc",
    precio: 3100,
    imagen: "/products/bebidas/monsterClasico.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Bebida energizante Monster Energy original, lata de 473cc.",
    stock: 20
  },
  {
    id: 635,
    nombre: "Monster Energy Green Zero Lata 473cc",
    precio: 3100,
    imagen: "/products/bebidas/monsterZero.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Bebida energizante Monster Energy original sin azúcar, lata de 473cc.",
    stock: 20
  },
  {
    id: 636,
    nombre: "Monster Energy Ultra Sin Azúcar Lata 473cc",
    precio: 3100,
    imagen: "/products/bebidas/monsterBlanco.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Bebida energizante Monster Energy Ultra sin azúcar, lata de 473cc.",
    stock: 20
  },
  {
    id: 637,
    nombre: "Monster Energy Ultra Mango Loco Lata 473cc",
    precio: 3100,
    imagen: "/products/bebidas/monsterMango.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Bebida energizante Monster Energy Ultra Mango Loco, lata de 473cc.",
    stock: 20
  },
  {
    id: 638,
    nombre: "Energizante Speed Lata",
    precio: 1900,
    imagen: "/products/bebidas/speed.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Bebida energizante Speed Unlimited en lata. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "269 CC", precio: 1900 },
      { nombre: "473 CC", precio: 2500 }
    ]
  },
  {
    id: 639,
    nombre: "Cerveza Brahma",
    precio: 2300,
    imagen: "/products/bebidas/cervezaBrahma.png",
    categoria: "Bebidas",
    subcategoria: "Con alcohol",
    descripcion: "Cerveza Brahma pilsen, suave y refrescante. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "1L", precio: 3900 },
      { nombre: "LATA", precio: 2300 }
    ]
  },
  {
    id: 640,
    nombre: "Cerveza Budweiser",
    precio: 2300,
    imagen: "/products/bebidas/cervezaBudweiser.png",
    categoria: "Bebidas",
    subcategoria: "Con alcohol",
    descripcion: "Cerveza Budweiser, refrescante y con carácter. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "1L", precio: 3900 },
      { nombre: "LATA", precio: 2300 }
    ]
  },
  {
    id: 641,
    nombre: "Cerveza Imperial Golden",
    precio: 2600,
    imagen: "/products/bebidas/cervezaGoldenImperial.png",
    categoria: "Bebidas",
    subcategoria: "Con alcohol",
    descripcion: "Cerveza Imperial Golden, aroma frutado y cuerpo liviano. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "1L", precio: 4600 },
      { nombre: "LATA", precio: 2600 }
    ]
  },
  {
    id: 642,
    nombre: "Cerveza Heineken",
    precio: 3800,
    imagen: "/products/bebidas/cervezaHeineken.png",
    categoria: "Bebidas",
    subcategoria: "Con alcohol",
    descripcion: "Cerveza premium Heineken de origen holandés. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "1L", precio: 6000 },
      { nombre: "LATA", precio: 3800 }
    ]
  },
  {
    id: 602,
    nombre: "Ades Durazno",
    precio: 1300,
    imagen: "/products/bebidas/adesDurazno.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Alimento líquido a base de soja sabor durazno. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "200ML", precio: 1300 },
      { nombre: "LITRO", precio: 3300 }
    ]
  },
  {
    id: 603,
    nombre: "Ades Manzana",
    precio: 1300,
    imagen: "/products/bebidas/adesManzan.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Alimento líquido a base de soja sabor manzana. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "200ML", precio: 1300 },
      { nombre: "LITRO", precio: 3300 }
    ]
  },
  {
    id: 604,
    nombre: "Ades Tropical",
    precio: 1300,
    imagen: "/products/bebidas/adesMultifruta.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Alimento líquido a base de soja sabor tropical/multifruta. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "200ML", precio: 1300 },
      { nombre: "LITRO", precio: 3300 }
    ]
  },
  {
    id: 605,
    nombre: "Pepsi",
    precio: 1600,
    imagen: "/products/bebidas/pepsiBotella.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Pepsi sabor original refrescante. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "500ML", precio: 1600 },
      { nombre: "2 LITROS", precio: 3300 }
    ]
  },
  {
    id: 606,
    nombre: "Pepsi Lata",
    precio: 1400,
    imagen: "/products/bebidas/pepsiLata.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Pepsi en lata de 354ml sabor original.",
    stock: 20,
    presentaciones: [
      { nombre: "LATA 354", precio: 1400 }
    ]
  },
  {
    id: 607,
    nombre: "7Up",
    precio: 1600,
    imagen: "/products/bebidas/7upBotella.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "7Up refrescante sabor lima-limón. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "500ML", precio: 1600 },
      { nombre: "2 LITROS", precio: 3300 }
    ]
  },
  {
    id: 608,
    nombre: "7Up Lata",
    precio: 1400,
    imagen: "/products/bebidas/7upLata.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "7Up en lata de 354ml sabor lima-limón.",
    stock: 20,
    presentaciones: [
      { nombre: "LATA 354", precio: 1400 }
    ]
  },
  {
    id: 609,
    nombre: "7Up Free",
    precio: 1600,
    imagen: "/products/bebidas/7upBotellaFree.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "7Up Free libre de azúcares. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "500ML", precio: 1600 },
      { nombre: "2 LITROS", precio: 3300 }
    ]
  },
  {
    id: 610,
    nombre: "7Up Lata Free",
    precio: 1400,
    imagen: "/products/bebidas/7upLataFree.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "7Up Free en lata de 354ml libre de azúcares.",
    stock: 20,
    presentaciones: [
      { nombre: "LATA 354", precio: 1400 }
    ]
  },
  {
    id: 611,
    nombre: "Pepsi Black",
    precio: 1600,
    imagen: "/products/bebidas/pepsiBotellaBlack.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Pepsi Black sabor intenso sin azúcar. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "500ML", precio: 1600 },
      { nombre: "2 LITROS", precio: 3300 }
    ]
  },
  {
    id: 612,
    nombre: "Pepsi Lata Black",
    precio: 1400,
    imagen: "/products/bebidas/pepsiLataBlack.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Pepsi Black en lata de 354ml sabor intenso sin azúcar.",
    stock: 20,
    presentaciones: [
      { nombre: "LATA 354", precio: 1400 }
    ]
  },
  {
    id: 613,
    nombre: "Vino Toro Tinto",
    precio: 2300,
    imagen: "/products/bebidas/vinoToroTinto.png",
    categoria: "Bebidas",
    subcategoria: "Con alcohol",
    descripcion: "Clásico vino Toro tinto en caja (Tetrabrik) de 1 Litro.",
    stock: 20
  },
  {
    id: 614,
    nombre: "Vino Toro Blanco",
    precio: 2300,
    imagen: "/products/bebidas/vinoToroBlanco.png",
    categoria: "Bebidas",
    subcategoria: "Con alcohol",
    descripcion: "Clásico vino Toro blanco en caja (Tetrabrik) de 1 Litro.",
    stock: 20
  },
  {
    id: 615,
    nombre: "Vino Viñas Riojanas Tinto",
    precio: 2200,
    imagen: "/products/bebidas/vinasRiojanasTinto.png",
    categoria: "Bebidas",
    subcategoria: "Con alcohol",
    descripcion: "Vino Viñas Riojanas tinto en caja de 1 Litro.",
    stock: 20
  },
  {
    id: 616,
    nombre: "Vino Viñas Riojanas Blanco",
    precio: 2200,
    imagen: "/products/bebidas/vinasRiojanasBlanco.png",
    categoria: "Bebidas",
    subcategoria: "Con alcohol",
    descripcion: "Vino Viñas Riojanas blanco en caja de 1 Litro.",
    stock: 20
  },
  {
    id: 617,
    nombre: "Vino Nativo Tinto",
    precio: 2000,
    imagen: "/products/bebidas/vinoNativoTinto.png",
    categoria: "Bebidas",
    subcategoria: "Con alcohol",
    descripcion: "Vino Nativo tinto en caja de 1 Litro.",
    stock: 20
  },
  {
    id: 618,
    nombre: "Vino Nativo Blanco",
    precio: 2000,
    imagen: "/products/bebidas/vinoNativoBlanco.png",
    categoria: "Bebidas",
    subcategoria: "Con alcohol",
    descripcion: "Vino Nativo blanco en caja de 1 Litro.",
    stock: 20
  },
  {
    id: 619,
    nombre: "Red Bull",
    precio: 3400,
    imagen: "/products/bebidas/redBull.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Bebida energizante Red Bull, lata de 250ml.",
    stock: 20
  },
  {
    id: 620,
    nombre: "Pritty",
    precio: 2500,
    imagen: "/products/bebidas/prittyLimon.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Gaseosa cordobesa sabor limón original. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "1,5 L", precio: 2500 },
      { nombre: "2,25 L", precio: 2800 },
      { nombre: "3 L", precio: 3600 }
    ]
  },
  {
    id: 621,
    nombre: "Pritty Cero",
    precio: 2500,
    imagen: "/products/bebidas/prittyLimonCero.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Gaseosa cordobesa sabor limón sin azúcar. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "1,5 L", precio: 2500 },
      { nombre: "2,25 L", precio: 2800 },
      { nombre: "3 L", precio: 3600 }
    ]
  },
  {
    id: 650,
    nombre: "Jugo Baggio Durazno",
    precio: 700,
    imagen: "/products/bebidas/baggioDurazno.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Delicioso jugo Baggio sabor durazno. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "200 ml", precio: 700 },
      { nombre: "1 Litro", precio: 2200 }
    ]
  },
  {
    id: 651,
    nombre: "Jugo Baggio Manzana",
    precio: 700,
    imagen: "/products/bebidas/baggioManzana.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Delicioso jugo Baggio sabor manzana. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "200 ml", precio: 700 },
      { nombre: "1 Litro", precio: 2200 }
    ]
  },
  {
    id: 652,
    nombre: "Jugo Baggio Naranja",
    precio: 700,
    imagen: "/products/bebidas/baggioNaranja.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Delicioso jugo Baggio sabor naranja. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "200 ml", precio: 700 },
      { nombre: "1 Litro", precio: 2200 }
    ]
  },
  {
    id: 653,
    nombre: "Jugo Baggio Multifruta",
    precio: 700,
    imagen: "/products/bebidas/baggioMultifruta.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Delicioso jugo Baggio sabor multifruta. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "200 ml", precio: 700 },
      { nombre: "1 Litro", precio: 2200 }
    ]
  },
  {
    id: 654,
    nombre: "Jugo Citric Naranja 1 Litro",
    precio: 4200,
    imagen: "/products/bebidas/citricNaranja.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Jugo exprimido de naranja Citric, 100% natural, sin conservantes.",
    stock: 20
  },
  {
    id: 655,
    nombre: "Jugo Citric Naranja-Durazno 1 Litro",
    precio: 4200,
    imagen: "/products/bebidas/citricNaranjaDurazno.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Jugo exprimido de naranja y durazno Citric, 100% natural, sin conservantes.",
    stock: 20
  },
  {
    id: 656,
    nombre: "Jugo Citric Naranja-Frutilla 1 Litro",
    precio: 4200,
    imagen: "/products/bebidas/citricNaranjaFrutilla.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Jugo exprimido de naranja y frutilla Citric, 100% natural, sin conservantes.",
    stock: 20
  },
  {
    id: 657,
    nombre: "Jugo Citric Naranja-Mango 1 Litro",
    precio: 4200,
    imagen: "/products/bebidas/citricNaranjaMango.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Jugo exprimido de naranja y mango Citric, 100% natural, sin conservantes.",
    stock: 20
  },
  {
    id: 658,
    nombre: "Bebida Energética Gatorade Cool Blue",
    precio: 2400,
    imagen: "/products/bebidas/gatoradeCoolBlue.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Bebida energética / isotónica Gatorade sabor Cool Blue. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "500 ml", precio: 2400 },
      { nombre: "1 Litro", precio: 4500 }
    ]
  },
  {
    id: 659,
    nombre: "Bebida Energética Gatorade Manzana",
    precio: 2400,
    imagen: "/products/bebidas/gatoradeManzana.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Bebida energética / isotónica Gatorade sabor manzana. Seleccioná tu presentación favorita.",
    stock: 20,
    presentaciones: [
      { nombre: "500 ml", precio: 2400 },
      { nombre: "1 Litro", precio: 4500 }
    ]
  },
  {
    id: 660,
    nombre: "Cerveza Andes Roja Lata",
    precio: 2700,
    imagen: "/products/bebidas/cervezaAndesRoja.png",
    categoria: "Bebidas",
    subcategoria: "Con alcohol",
    descripcion: "Cerveza Andes Roja en lata. Sabor equilibrado con maltas tostadas.",
    stock: 20
  },
  {
    id: 661,
    nombre: "Gaseosa Paso de los Toros Pomelo 1.5L",
    precio: 3500,
    imagen: "/products/bebidas/pasoToroPomelo.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Gaseosa Paso de los Toros sabor pomelo, botella de 1.5 Litros.",
    stock: 20
  },
  {
    id: 662,
    nombre: "Gaseosa Paso de los Toros Tónica 1.5L",
    precio: 3500,
    imagen: "/products/bebidas/pasoToroTonica.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Gaseosa tónica Paso de los Toros, botella de 1.5 Litros.",
    stock: 20
  },
  {
    id: 663,
    nombre: "Aperitivo Gancia Sin Alcohol Lata 473cc",
    precio: 2100,
    imagen: "/products/bebidas/ganciaSinAlcohol.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Aperitivo Gancia sin alcohol en lata de 473cc. Refrescante, herbal y listo para disfrutar.",
    stock: 20
  },
  /*{
    id: 92,
    nombre: "Medallones Paty Finitas x2",
    precio: 2400,
    imagen: "/products/congelados/medallonesPaty.png",
    categoria: "Congelados",
    subcategoria: undefined,
    descripcion: "Medallones de carne vacuna Paty Finitas, pack x2. Precocidos, listos para la plancha o parrilla.",
    stock: 20
  },*/
  {
    id: 114,
    nombre: "Papel Higiénico Sanidad x4",
    precio: 1700,
    imagen: "/products/limpiezaPerfumeria/higienicoSanidadx4.png",
    categoria: "Limpieza y Perfumería",
    descripcion: "Papel higiénico Sanidad Clásico blanco, pack x4 rollos de hoja simple, 30 metros cada uno. Suave y absorbente.",
    stock: 20
  },
  {
    id: 115,
    nombre: "Papel Higiénico Elegante Doble Hoja x4",
    precio: 3500,
    imagen: "/products/limpiezaPerfumeria/higienicoElegantex4.png",
    categoria: "Limpieza y Perfumería",
    descripcion: "Papel higiénico Elegante doble hoja, pack x4 rollos. Ultra suave y ultra absorbente, nueva textura.",
    stock: 20
  },
  {
    id: 116,
    nombre: "Rollos de Cocina Elegante x3",
    precio: 2300,
    imagen: "/products/limpiezaPerfumeria/rolloCocinaElegantex3.png",
    categoria: "Limpieza y Perfumería",
    descripcion: "Rollos de cocina Elegante súper absorbente, pack x3 rollos de 50 metros aprox. Ideal para cocina y limpieza del hogar.",
    stock: 20
  },
  {
    id: 117,
    nombre: "Rollos de Cocina Cartabella x3",
    precio: 2000,
    imagen: "/products/limpiezaPerfumeria/rolloCocinaCartabellax3.png",
    categoria: "Limpieza y Perfumería",
    descripcion: "Rollos de cocina Cartabella Daily doble hoja, pack x3 rollos, 120 paños cada uno. Nueva textura, alta absorción.",
    stock: 20
  },
  {
    id: 118,
    nombre: "Jabón de Tocador Rexona 125g",
    precio: 1500,
    imagen: "/products/limpiezaPerfumeria/jabonTocadorRexona125.png",
    categoria: "Limpieza y Perfumería",
    descripcion: "Jabón de tocador Rexona Frescura Relajante, 125g. Cuida e hidrata la piel.",
    stock: 20
  },
  {
    id: 119,
    nombre: "Jabón Seiseme 300g",
    precio: 2400,
    imagen: "/products/limpiezaPerfumeria/jabonSeiseme300.png",
    categoria: "Limpieza y Perfumería",
    descripcion: "Jabón en pan Seiseme para lavar ropa, 300g. 60 años de trayectoria, elaborado con materias primas naturales y degradables.",
    stock: 20
  },
  {
    id: 120,
    nombre: "Lavandina Ayudín 1L",
    precio: 1500,
    imagen: "/products/limpiezaPerfumeria/lavandinaAyudinlitro.png",
    categoria: "Limpieza y Perfumería",
    descripcion: "Agua lavandina común Ayudín Original 1 litro. Elimina el 99,9% de virus y bacterias.",
    stock: 20
  },
  {
    id: 121,
    nombre: "Perfumina Poett 900ml",
    precio: 2100,
    imagen: "/products/limpiezaPerfumeria/perfuminapoett900.png",
    categoria: "Limpieza y Perfumería",
    descripcion: "Perfumina para pisos Poett 900ml. Variedad de fragancias, deja aroma duradero en todos los ambientes.",
    stock: 20
  },
  {
    id: 122,
    nombre: "Perfumina Procenex 900ml",
    precio: 1900,
    imagen: "/products/limpiezaPerfumeria/procenex900.png",
    categoria: "Limpieza y Perfumería",
    descripcion: "Perfumina para pisos Procenex 900ml. Variedad de fragancias frutales y florales, limpia y perfuma en un solo paso.",
    stock: 20
  },
  {
    id: 123,
    nombre: "Insecticida Raid Aerosol",
    precio: 7200,
    imagen: "/products/limpiezaPerfumeria/raid.png",
    categoria: "Limpieza y Perfumería",
    descripcion: "Insecticida Raid aerosol, mata moscas, mosquitos y cucarachas. Acción rápida y efectividad comprobada.",
    stock: 20
  },
  {
    id: 124,
    nombre: "Insecticida Fuyi Aerosol 400ml",
    precio: 6400,
    imagen: "/products/limpiezaPerfumeria/fuyi.png",
    categoria: "Limpieza y Perfumería",
    descripcion: "Insecticida Fuyi aerosol 400ml. Mata moscas y mosquitos, efectividad comprobada. Industria argentina.",
    stock: 20
  },
  {
    id: 125,
    nombre: "Lysoform Desinfectante Aerosol 360ml",
    precio: 5100,
    imagen: "/products/limpiezaPerfumeria/lysoformAerosol.png",
    categoria: "Limpieza y Perfumería",
    descripcion: "Desinfectante Lysoform aerosol 360ml. Elimina el 99,9% de gérmenes, virus y bacterias. Listo para usar.",
    stock: 20
  },
  {
    id: 126,
    nombre: "Poett Aerosol 250ml",
    precio: 3900,
    imagen: "/products/limpiezaPerfumeria/poettAerosol.png",
    categoria: "Limpieza y Perfumería",
    descripcion: "Desodorante de ambientes Poett aerosol 250ml. Variedad de fragancias florales y frescas.",
    stock: 20
  },
  {
    id: 127,
    nombre: "Detergente Héroe Plus",
    precio: 1400,
    imagen: "/products/limpiezaPerfumeria/detergenteHeroe.png",
    categoria: "Limpieza y Perfumería",
    descripcion: "Detergente lavavajillas Héroe Plus, variedad de fragancias. Desengrasante efectivo, cuida las manos.",
    stock: 20
  },
  {
    id: 129,
    nombre: "Detergente Cif Bioactive Lima 300ml",
    precio: 2700,
    imagen: "/products/limpiezaPerfumeria/detergenteCif1.png",
    categoria: "Limpieza y Perfumería",
    descripcion: "Detergente lavavajillas Cif Bioactive Lima 750ml. X5 poder desengrasante, nueva fórmula con fragancia a lima.",
    stock: 20
  },
  {
    id: 130,
    nombre: "Detergente Ala Ultra 300ml",
    precio: 2000,
    imagen: "/products/limpiezaPerfumeria/detergenteAla300ml.png",
    categoria: "Limpieza y Perfumería",
    descripcion: "Detergente lavavajillas Ala Ultra 500ml. Doble poder desengrasante, cuida las manos y los utensilios.",
    stock: 20
  },
  {
    id: 131,
    nombre: "Jabón Líquido Matic Granby 800ml",
    precio: 2600,
    imagen: "/products/limpiezaPerfumeria/jabonLiquidoMaticGranby800.png",
    categoria: "Limpieza y Perfumería",
    descripcion: "Jabón líquido para lavarropas Granby Bicarbonato 600ml. Limpieza profunda con fragancia duradera.",
    stock: 20
  },
  {
    id: 132,
    nombre: "Jabón Líquido Matic Ala Eco Lavado 800ml",
    precio: 3900,
    imagen: "/products/limpiezaPerfumeria/jabonLiquidoMaticAla800.png",
    categoria: "Limpieza y Perfumería",
    descripcion: "Jabón líquido para lavarropas Ala Mustic Eco Lavado 800ml. Fórmula concentrada, cuida las fibras de la ropa.",
    stock: 20
  },
  {
    id: 133,
    nombre: "Jabón Líquido Matic Gigante Bio 800ml",
    precio: 3100,
    imagen: "/products/limpiezaPerfumeria/jabonLiquidoMaticGiganteBio800.png",
    categoria: "Limpieza y Perfumería",
    descripcion: "Jabón líquido para lavarropas Gigante Bio 800ml. Con bio-enzimas activas para manchas difíciles.",
    stock: 20
  },
  {
    id: 134,
    nombre: "Repelente Off Family Crema 60g",
    precio: 3600,
    imagen: "/products/limpiezaPerfumeria/repelenteOffCrema60.png",
    categoria: "Limpieza y Perfumería",
    descripcion: "Repelente en crema Off Family 60g, concentrado sin alcohol. Apto para niños desde 4 años.",
    stock: 20
  },
  {
    id: 135,
    nombre: "Arvejas Inalpa",
    precio: 800,
    imagen: "/products/conservas/arvejasInalpa.png",
    categoria: "Almacén",
    subcategoria: "Conservas",
    descripcion: "Arvejas Inalpa en lata, listas para servir. Tiernas y de primera calidad, industria argentina. Sin TACC.",
    stock: 20
  },
  {
    id: 136,
    nombre: "Lentejas Inalpa",
    precio: 1200,
    imagen: "/products/conservas/lentejasInalpa.png",
    categoria: "Almacén",
    subcategoria: "Conservas",
    descripcion: "Lentejas Inalpa en lata, listas para servir. Cocidas y condimentadas, ideales para guisos y ensaladas.",
    stock: 20
  },
  {
    id: 137,
    nombre: "Choclo Blanco Cremoso Inalpa",
    precio: 900,
    imagen: "/products/conservas/chocloBlancoCremoso.png",
    categoria: "Almacén",
    subcategoria: "Conservas",
    descripcion: "Choclo blanco cremoso Inalpa en lata, listo para servir. Ideal para tartas, pasteles y guarniciones.",
    stock: 20
  },
  {
    id: 138,
    nombre: "Choclo Amarillo Inalpa",
    precio: 1600,
    imagen: "/products/conservas/chocloAmarillo.png",
    categoria: "Almacén",
    subcategoria: "Conservas",
    descripcion: "Choclo amarillo en granos enteros Inalpa, listo para servir. Dulce y tierno, industria argentina.",
    stock: 20
  },
  {
    id: 139,
    nombre: "Jardinera Inalpa",
    precio: 1200,
    imagen: "/products/conservas/jardineraInalpa.png",
    categoria: "Almacén",
    subcategoria: "Conservas",
    descripcion: "Jardinera Inalpa en lata, ensalada de hortalizas y legumbres lista para servir. Arvejas, zanahorias, papas y choclo.",
    stock: 20
  },
  {
    id: 140,
    nombre: "Garbanzos Inalpa",
    precio: 1200,
    imagen: "/products/conservas/garbanzosInalpa.png",
    categoria: "Almacén",
    subcategoria: "Conservas",
    descripcion: "Garbanzos Inalpa en lata, secos remojados en conserva. Listos para usar en guisos, ensaladas y hummus.",
    stock: 20
  },
  {
    id: 141,
    nombre: "Atún al Natural La Campagnola 170g",
    precio: 5800,
    imagen: "/products/conservas/atunNaturalLomoLaCampagnola170.png",
    categoria: "Almacén",
    subcategoria: "Conservas",
    descripcion: "Atún en lomo al natural La Campagnola, 170g. Libre de gluten, sin TACC. Calidad premium, listo para consumir.",
    stock: 20
  },
  {
    id: 142,
    nombre: "Atún Desmenuzado Cumaná 170g",
    precio: 1800,
    imagen: "/products/conservas/atunDesmenuzadoCumana170.png",
    categoria: "Almacén",
    subcategoria: "Conservas",
    descripcion: "Atún desmenuzado al natural Cumaná, 170g. Económico y práctico, ideal para ensaladas, sándwiches y tartas.",
    stock: 20
  },
  {
    id: 143,
    nombre: "Duraznos en Almíbar Molto",
    precio: 2200,
    imagen: "/products/conservas/duraznosAlmibarMolto.png",
    categoria: "Almacén",
    subcategoria: "Conservas",
    descripcion: "Duraznos en almíbar Molto, lata. En mitades, listos para postre o repostería.",
    stock: 20
  },
  {
    id: 144,
    nombre: "Duraznos en Almíbar Agrosabor 950g",
    precio: 2400,
    imagen: "/products/conservas/duraznosAlmibarAgrosabor.png",
    categoria: "Almacén",
    subcategoria: "Conservas",
    descripcion: "Duraznos en mitades en almíbar Agrosabor, 950g. Fruta seleccionada, ideal para postres y repostería.",
    stock: 20
  },
  {
    id: 145,
    nombre: "Lucchetti Moños 500g",
    precio: 2500,
    imagen: "/products/pastas/luccettiMonitos.png",
    categoria: "Almacén",
    subcategoria: "Pastas frescas y secas",
    descripcion: "Fideos moños Lucchetti 500g. Enriquecidos con vitaminas y minerales NutriVit Plus. Ideales con salsas cremosas.",
    stock: 20
  },
  {
    id: 146,
    nombre: "Lucchetti Dedalitos 500g",
    precio: 1600,
    imagen: "/products/pastas/luccettiDedalitos.png",
    categoria: "Almacén",
    subcategoria: "Pastas frescas y secas",
    descripcion: "Fideos dedalitos Lucchetti 500g. Enriquecidos con vitaminas y minerales NutriVit Plus. Ideales para sopas y guisos.",
    stock: 20
  },
  {
    id: 147,
    nombre: "Lucchetti Municiones 500g",
    precio: 1600,
    imagen: "/products/pastas/luccettiMuniciones.png",
    categoria: "Almacén",
    subcategoria: "Pastas frescas y secas",
    descripcion: "Fideos municiones Lucchetti 500g. Enriquecidos con vitaminas y minerales NutriVit Plus. Clásicos para sopas y caldos.",
    stock: 20
  },
  {
    id: 148,
    nombre: "Spaghetti Verizzia 500g",
    precio: 1000,
    imagen: "/products/pastas/spaghettiVerizzia.png",
    categoria: "Almacén",
    subcategoria: "Pastas frescas y secas",
    descripcion: "Spaghetti Verizzia 500g. Pasta seca de calidad, elaborada con sémola de trigo. Amore per la Pasta.",
    stock: 20
  },
  {
    id: 151,
    nombre: "Jamón Cocido La Tirolesa",
    precio: 1000,
    imagen: "/products/almacen/fiambres/jamonCocidoTirolesa.png",
    categoria: "Almacén",
    subcategoria: "Fiambres",
    descripcion: "Jamón cocido La Tirolesa, precio por 100g. Tierno y sabroso, ideal para sándwiches y picadas.",
    stock: 20,
    unidadPrecio: "100g",
    esAGranel: true
  },
  {
    id: 152,
    nombre: "Jamón Cocido Colonial",
    precio: 1300,
    imagen: "/products/almacen/fiambres/jamonCocidoColonial.png",
    categoria: "Almacén",
    subcategoria: "Fiambres",
    descripcion: "Jamón cocido Colonial, precio por 100g. Sabor suave y textura premium, perfecto para picadas y sándwiches.",
    stock: 20,
    unidadPrecio: "100g",
    esAGranel: true
  },
  {
    id: 153,
    nombre: "Jamón Cocido con Cuero Ibarazzi",
    precio: 1800,
    imagen: "/products/almacen/fiambres/jamonCocidoconCuero.png",
    categoria: "Almacén",
    subcategoria: "Fiambres",
    descripcion: "Jamón cocido natural con cuero Ibarazzi, precio por 100g. Elaboración artesanal, sabor intenso y característico.",
    stock: 20,
    unidadPrecio: "100g",
    esAGranel: true
  },
  {
    id: 154,
    nombre: "Salame Tipo Milán La Tirolesa",
    precio: 1400,
    imagen: "/products/almacen/fiambres/salameTipoMilanTirolesa.png",
    categoria: "Almacén",
    subcategoria: "Fiambres",
    descripcion: "Salame tipo Milán La Tirolesa, precio por 100g. Sabor intenso y curación tradicional, ideal para picadas.",
    stock: 20,
    unidadPrecio: "100g",
    esAGranel: true
  },
  {
    id: 513,
    nombre: "Hamburguesas Paty Express x4",
    precio: 5500,
    imagen: "/products/congelados/hamburguesasPatyExpress.png",
    categoria: "Congelados",
    descripcion: "Hamburguesas Paty Express x4 unidades. Supercongeladas, listas para la plancha o parrilla.",
    stock: 20
  },
  {
    id: 514,
    nombre: "Tarta de Pollo",
    precio: 6500,
    imagen: "/products/congelados/tartaPollo.png",
    categoria: "Congelados",
    descripcion: "Tarta de pollo artesanal supercongelada. Relleno jugoso y masa crocante, lista para hornear.",
    stock: 20
  },
  {
    id: 515,
    nombre: "Tarta de Verdura",
    precio: 6000,
    imagen: "/products/congelados/tartaVerduras.png",
    categoria: "Congelados",
    descripcion: "Tarta de verduras artesanal supercongelada. Nutritiva y sabrosa, lista para hornear.",
    stock: 20
  },
  {
    id: 516,
    nombre: "Tarta de Choclo Cremoso",
    precio: 6000,
    imagen: "/products/congelados/tartaChocloCremoso.png",
    categoria: "Congelados",
    descripcion: "Tarta de choclo cremoso artesanal supercongelada. Dulce y suave, lista para hornear.",
    stock: 20
  },
  {
    id: 517,
    nombre: "Tarta de Jamón y Queso",
    precio: 6000,
    imagen: "/products/congelados/tartaJamonQueso.png",
    categoria: "Congelados",
    descripcion: "Tarta de jamón y queso artesanal supercongelada. Relleno generoso y masa crocante, lista para hornear.",
    stock: 20
  },
  {
    id: 518,
    nombre: "Tarta de Calabaza y Muzzarella",
    precio: 6000,
    imagen: "/products/congelados/tartaCalabazaMuzza.png",
    categoria: "Congelados",
    descripcion: "Tarta de calabaza y muzzarella artesanal supercongelada. Cremosa y dulce, lista para hornear.",
    stock: 20
  },
  {
    id: 156,
    nombre: "Papas Lay's Clásicas 40g",
    precio: 2300,
    imagen: "/products/kiosco/lays40.png",
    categoria: "Kiosco",
    descripcion: "Papas fritas Lay's Clásicas 40g. Solo 3 ingredientes: papa, aceite y sal. El snack clásico de siempre.",
    stock: 20
  },
  {
    id: 157,
    nombre: "Papas Lay's Clásicas 75g",
    precio: 3300,
    imagen: "/products/kiosco/lays75.png",
    categoria: "Kiosco",
    descripcion: "Papas fritas Lay's Clásicas 75g. Solo 3 ingredientes: papa, aceite y sal. Formato familiar.",
    stock: 20
  },
  {
    id: 158,
    nombre: "Cheetos 3D 40g",
    precio: 2300,
    imagen: "/products/kiosco/3D40.png",
    categoria: "Kiosco",
    descripcion: "Snack de maíz Cheetos 3D 40g. Crujientes y con sabor a queso, ideales para el recreo o la merienda.",
    stock: 20
  },
  {
    id: 159,
    nombre: "Cheetos 3D 75g",
    precio: 3300,
    imagen: "/products/kiosco/3D75.png",
    categoria: "Kiosco",
    descripcion: "Snack de maíz Cheetos 3D 75g. Crujientes y con sabor a queso. Formato familiar.",
    stock: 20
  },
  {
    id: 160,
    nombre: "Doritos 40g",
    precio: 2300,
    imagen: "/products/kiosco/doritos40.png",
    categoria: "Kiosco",
    descripcion: "Nachos Doritos 40g. Chips de maíz con intenso sabor, crujientes e irresistibles.",
    stock: 20
  },
  {
    id: 161,
    nombre: "Doritos 75g",
    precio: 3300,
    imagen: "/products/kiosco/doritos75gr.png",
    categoria: "Kiosco",
    descripcion: "Nachos Doritos 75g. Chips de maíz con intenso sabor. Formato familiar.",
    stock: 20
  },
  {
    id: 162,
    nombre: "Chocolate Cofler Block 38 Gr",
    precio: 2300,
    imagen: "/products/kiosco/coflerBlock38gr.png",
    categoria: "Kiosco",
    descripcion: "Chocolate Cofler Block 38g. Chocolate con leche clásico, suave y cremoso. El clásico argentino de siempre.",
    stock: 20
  },
  {
    id: 163,
    nombre: "Chocolate Cofler Block 110 Gr",  
    precio: 5900,
    imagen: "/products/kiosco/coflerBlock110gr.png",
    categoria: "Kiosco",
    descripcion: "Chocolate Cofler Block 110g. Chocolate con leche clásico en formato grande. Ideal para compartir.",
    stock: 20
  },
  {
    id: 701,
    nombre: "Galletitas Mini Oreo",
    precio: 1100,
    imagen: "/products/kiosco/galletasMiniOreo.png",
    categoria: "Kiosco",
    descripcion: "Mini galletitas Oreo de chocolate rellenas con crema.",
    stock: 20
  },
  {
    id: 702,
    nombre: "Galletitas Mini Pepitos",
    precio: 1100,
    imagen: "/products/kiosco/galletasMiniPepitos.png",
    categoria: "Kiosco",
    descripcion: "Mini galletitas dulces Pepitos con chips de chocolate.",
    stock: 20
  },
  {
    id: 703,
    nombre: "Alfajor Triple Turimar Blanco",
    precio: 600,
    imagen: "/products/kiosco/alfajorTripleTurimarBlanco.png",
    categoria: "Kiosco",
    descripcion: "Alfajor triple Turimar relleno de dulce de leche con baño de repostería blanco.",
    stock: 20
  },
  {
    id: 704,
    nombre: "Alfajor Triple Turimar Negro",
    precio: 600,
    imagen: "/products/kiosco/alfajorTripleTurimarNegro.png",
    categoria: "Kiosco",
    descripcion: "Alfajor triple Turimar relleno de dulce de leche con baño de repostería de fantasía negro.",
    stock: 20
  },
  {
    id: 705,
    nombre: "Alfajor Triple Fantoche Blanco",
    precio: 1300,
    imagen: "/products/kiosco/alfajorTripleFantocheBlanco.png",
    categoria: "Kiosco",
    descripcion: "Alfajor triple Fantoche relleno de dulce de leche con baño de repostería blanco.",
    stock: 20
  },
  {
    id: 706,
    nombre: "Alfajor Triple Fantoche Negro",
    precio: 1300,
    imagen: "/products/kiosco/alfajorTripleFantocheNegro.png",
    categoria: "Kiosco",
    descripcion: "Alfajor triple Fantoche relleno de dulce de leche con baño de repostería de chocolate negro.",
    stock: 20
  },
  {
    id: 707,
    nombre: "Alfajor Triple Terrabusi",
    precio: 1800,
    imagen: "/products/kiosco/alfajorTripleTerrabusi.png",
    categoria: "Kiosco",
    descripcion: "Alfajor triple Terrabusi clásico con relleno de dulce de leche y baño de repostería.",
    stock: 20
  },
  {
    id: 708,
    nombre: "Alfajor Triple Milka Dulce de Leche",
    precio: 1800,
    imagen: "/products/kiosco/alfajorTripleMilkaDLeche.png",
    categoria: "Kiosco",
    descripcion: "Alfajor triple Milka relleno de dulce de leche cubierto con chocolate con leche Milka.",
    stock: 20
  },
  {
    id: 709,
    nombre: "Alfajor Triple Milka Mousse",
    precio: 1800,
    imagen: "/products/kiosco/alfajorTripleMilkaMousse.png",
    categoria: "Kiosco",
    descripcion: "Alfajor triple Milka relleno de mousse de chocolate cubierto con chocolate con leche Milka.",
    stock: 20
  },
  {
    id: 710,
    nombre: "Alfajor Triple Milka Oreo",
    precio: 1800,
    imagen: "/products/kiosco/alfajorTripleMilkaOreo.png",
    categoria: "Kiosco",
    descripcion: "Alfajor triple Milka con galletitas Oreo, relleno de crema y cubierto con chocolate Milka.",
    stock: 20
  },
  {
    id: 711,
    nombre: "Alfajor Triple Oreo",
    precio: 1800,
    imagen: "/products/kiosco/alfajorTripleOreo.png",
    categoria: "Kiosco",
    descripcion: "Alfajor triple Oreo, relleno de crema y cubierto con baño de repostería de chocolate.",
    stock: 20
  },
  {
    id: 712,
    nombre: "Alfajor Triple Pepito",
    precio: 1800,
    imagen: "/products/kiosco/alfajorTriplePepitos.png",
    categoria: "Kiosco",
    descripcion: "Alfajor triple con galletitas Pepito, relleno de dulce de leche y cubierto con chocolate.",
    stock: 20
  },
  {
    id: 713,
    nombre: "Alfajor Triple Bon o Bon Blanco",
    precio: 2100,
    imagen: "/products/kiosco/alfajorTripleBobBlanco.png",
    categoria: "Kiosco",
    descripcion: "Alfajor triple Bon o Bon con relleno a base de pasta de maní y baño de repostería blanco.",
    stock: 20
  },
  {
    id: 714,
    nombre: "Alfajor Triple Bon o Bon Negro",
    precio: 2100,
    imagen: "/products/kiosco/alfajorTripleBobNegro.png",
    categoria: "Kiosco",
    descripcion: "Alfajor triple Bon o Bon con relleno a base de pasta de maní y baño de repostería de chocolate con leche.",
    stock: 20
  },
  {
    id: 715,
    nombre: "Alfajor Triple Águila Clásico",
    precio: 2100,
    imagen: "/products/kiosco/alfajorTripleAguila.png",
    categoria: "Kiosco",
    descripcion: "Alfajor triple Águila clásico, relleno de dulce de leche y cubierto con chocolate semi-amargo Águila.",
    stock: 20
  },
  {
    id: 716,
    nombre: "Alfajor Triple Águila Blanco",
    precio: 2100,
    imagen: "/products/kiosco/alfajorTripleAguilaBlanco.png",
    categoria: "Kiosco",
    descripcion: "Alfajor triple Águila blanco (mousse), con relleno de dulce de leche y cubierto con chocolate blanco Águila.",
    stock: 20
  },
  {
    id: 717,
    nombre: "Alfajor Triple Águila Coco",
    precio: 2100,
    imagen: "/products/kiosco/alfajorTripleAguilaCoco.png",
    categoria: "Kiosco",
    descripcion: "Alfajor triple Águila sabor coco, relleno de dulce de leche y cubierto con chocolate blanco.",
    stock: 20
  },
  {
    id: 718,
    nombre: "Alfajor Triple Tofi Blanco",
    precio: 2100,
    imagen: "/products/kiosco/alfajorTripleTofiBlanco.png",
    categoria: "Kiosco",
    descripcion: "Alfajor triple Tofi con relleno de dulce de leche y cubierto con baño de repostería blanco.",
    stock: 20
  },
  {
    id: 719,
    nombre: "Alfajor Triple Tofi Negro",
    precio: 2100,
    imagen: "/products/kiosco/alfajorTripleTofiNegro.png",
    categoria: "Kiosco",
    descripcion: "Alfajor triple Tofi con relleno de dulce de leche y cubierto con chocolate negro.",
    stock: 20
  },
  {
    id: 720,
    nombre: "Alfajor Block Triple",
    precio: 2100,
    imagen: "/products/kiosco/alfajorTripleBlock.png",
    categoria: "Kiosco",
    descripcion: "Alfajor triple Block con dulce de leche, trozos de maní y cubierto con chocolate con leche Block.",
    stock: 20
  },
  {
    id: 721,
    nombre: "Alfajor Tatin Triple Blanco",
    precio: 1100,
    imagen: "/products/kiosco/alfajorTripleTatinBco.png",
    categoria: "Kiosco",
    descripcion: "Alfajor triple Tatin relleno de dulce de leche con baño de repostería blanco.",
    stock: 20
  },
  {
    id: 722,
    nombre: "Alfajor Tatin Triple Negro",
    precio: 1100,
    imagen: "/products/kiosco/alfajorTripleTatinNegro.png",
    categoria: "Kiosco",
    descripcion: "Alfajor triple Tatin relleno de dulce de leche con baño de repostería negro.",
    stock: 20
  },
  {
    id: 723,
    nombre: "Alfajor Tatin Simple Blanco",
    precio: 600,
    imagen: "/products/kiosco/alfajorTatinBco.png",
    categoria: "Kiosco",
    descripcion: "Alfajor simple Tatin relleno de dulce de leche con baño de repostería blanco.",
    stock: 20
  },
  {
    id: 724,
    nombre: "Alfajor Tatin Simple Negro",
    precio: 600,
    imagen: "/products/kiosco/alfajorTatinNegro.png",
    categoria: "Kiosco",
    descripcion: "Alfajor simple Tatin relleno de dulce de leche con baño de repostería negro.",
    stock: 20
  },
  {
    id: 725,
    nombre: "Alfajor Simple Bon o Bon Blanco",
    precio: 1100,
    imagen: "/products/kiosco/alfajorBonobonBco.png",
    categoria: "Kiosco",
    descripcion: "Alfajor simple Bon o Bon relleno a base de pasta de maní and baño de repostería blanco.",
    stock: 20
  },
  {
    id: 726,
    nombre: "Alfajor Simple Bon o Bon Negro",
    precio: 1100,
    imagen: "/products/kiosco/alfajorBonobonNegro.png",
    categoria: "Kiosco",
    descripcion: "Alfajor simple Bon o Bon relleno a base de pasta de maní and baño de repostería de chocolate con leche.",
    stock: 20
  },
  {
    id: 727,
    nombre: "Alfajor Simple Tofi Blanco",
    precio: 1100,
    imagen: "/products/kiosco/alfajorTofiBco.png",
    categoria: "Kiosco",
    descripcion: "Alfajor simple Tofi con relleno de dulce de leche and baño de repostería blanco.",
    stock: 20
  },
  {
    id: 728,
    nombre: "Alfajor Simple Tofi Negro",
    precio: 1100,
    imagen: "/products/kiosco/alfajorTofiNegro.png",
    categoria: "Kiosco",
    descripcion: "Alfajor simple Tofi con relleno de dulce de leche and baño de repostería negro.",
    stock: 20
  },
  {
    id: 729,
    nombre: "Galletitas Opera Chica",
    precio: 900,
    imagen: "/products/kiosco/galletaOpera.png",
    categoria: "Kiosco",
    descripcion: "Galletitas Opera rellenas con crema sabor vainilla y frutilla, presentación chica.",
    stock: 20
  },
  {
    id: 750,
    nombre: "Chocolate Arcor Blanco",
    precio: 1600,
    imagen: "/products/kiosco/chocolateBlancoArcor.png",
    categoria: "Kiosco",
    descripcion: "Chocolate blanco Arcor, clásico sabor suave y cremoso.",
    stock: 20
  },
  {
    id: 751,
    nombre: "Chocolate Arcor Negro",
    precio: 1600,
    imagen: "/products/kiosco/chocolateNegroArcor.png",
    categoria: "Kiosco",
    descripcion: "Chocolate con leche Arcor, el clásico sabor tradicional.",
    stock: 20
  },
  {
    id: 752,
    nombre: "Oblea Bon o Bon Blanca",
    precio: 1300,
    imagen: "/products/kiosco/obleaBonobonBca.png",
    categoria: "Kiosco",
    descripcion: "Oblea crujiente rellena con pasta de maní Bon o Bon y cobertura blanca.",
    stock: 20
  },
  {
    id: 753,
    nombre: "Oblea Bon o Bon Negra",
    precio: 1300,
    imagen: "/products/kiosco/obleaBonobonNegra.png",
    categoria: "Kiosco",
    descripcion: "Oblea crujiente rellena con pasta de maní Bon o Bon y cobertura de chocolate con leche.",
    stock: 20
  },
  {
    id: 754,
    nombre: "Bon o Bon Negro",
    precio: 700,
    imagen: "/products/kiosco/bonobonNegro.png",
    categoria: "Kiosco",
    descripcion: "Bombón de chocolate con leche relleno con pasta de maní.",
    stock: 20
  },
  {
    id: 755,
    nombre: "Bon o Bon Blanco",
    precio: 700,
    imagen: "/products/kiosco/bonobonBco.png",
    categoria: "Kiosco",
    descripcion: "Bombón de chocolate blanco relleno con pasta de maní.",
    stock: 20
  },
  {
    id: 756,
    nombre: "Bon o Bon Coco",
    precio: 700,
    imagen: "/products/kiosco/bonobonCoco.png",
    categoria: "Kiosco",
    descripcion: "Bombón de chocolate blanco con relleno sabor coco y pasta de maní.",
    stock: 20
  },
  {
    id: 757,
    nombre: "Bon o Bon Cookies-Cream",
    precio: 700,
    imagen: "/products/kiosco/bonobnCookiesCream.png",
    categoria: "Kiosco",
    descripcion: "Bombón relleno sabor cookies & cream con galletitas de chocolate.",
    stock: 20
  },
  {
    id: 758,
    nombre: "Tofi con Dulce de Leche Blanco",
    precio: 2300,
    imagen: "/products/kiosco/chocolateTofiBco.png",
    categoria: "Kiosco",
    descripcion: "Chocolate Tofi blanco relleno con dulce de leche.",
    stock: 20
  },
  {
    id: 759,
    nombre: "Tofi con Dulce de Leche Negro",
    precio: 2300,
    imagen: "/products/kiosco/chocolateTofiNegro.png",
    categoria: "Kiosco",
    descripcion: "Chocolate Tofi negro con leche relleno con dulce de leche.",
    stock: 20
  },
  {
    id: 760,
    nombre: "Mogul Dientes",
    precio: 1300,
    imagen: "/products/kiosco/mogulDientes80gr.png",
    categoria: "Kiosco",
    descripcion: "Gomitas Mogul con forma de dientes y sabor a frutas, paquete de 80g.",
    stock: 20
  },
  {
    id: 761,
    nombre: "Mogul Moras",
    precio: 1300,
    imagen: "/products/kiosco/mogulMoras80gr.png",
    categoria: "Kiosco",
    descripcion: "Gomitas Mogul con forma de moras rojas y negras, paquete de 80g.",
    stock: 20
  },
  {
    id: 762,
    nombre: "Mogul Jelly Beans",
    precio: 1300,
    imagen: "/products/kiosco/mogulJellyBeans80gr.png",
    categoria: "Kiosco",
    descripcion: "Gomitas Mogul Jelly Beans con formas variadas y sabor frutal, paquete de 80g.",
    stock: 20
  },
  {
    id: 763,
    nombre: "Mogul Extrem",
    precio: 1300,
    imagen: "/products/kiosco/mogulExtreme80gr.png",
    categoria: "Kiosco",
    descripcion: "Gomitas Mogul Extreme ácidas con sabores frutales, paquete de 80g.",
    stock: 20
  },
  {
    id: 764,
    nombre: "Mogul Ositos",
    precio: 800,
    imagen: "/products/kiosco/mogulOsitos.png",
    categoria: "Kiosco",
    descripcion: "Clásicas gomitas Mogul con forma de ositos y sabores frutales.",
    stock: 20
  },
  {
    id: 765,
    nombre: "Mogul Tiburoncitos",
    precio: 800,
    imagen: "/products/kiosco/mogulTiburoncitos.png",
    categoria: "Kiosco",
    descripcion: "Divertidas gomitas Mogul con forma de tiburoncitos.",
    stock: 20
  },
  {
    id: 766,
    nombre: "Mogul Cerebritos",
    precio: 800,
    imagen: "/products/kiosco/mogulCerebritos.png",
    categoria: "Kiosco",
    descripcion: "Gomitas Mogul con forma de cerebritos y divertidos sabores frutales.",
    stock: 20
  },
  {
    id: 767,
    nombre: "Mogul Rollitos",
    precio: 800,
    imagen: "/products/kiosco/mogulRollitos.png",
    categoria: "Kiosco",
    descripcion: "Gomitas Mogul en rollitos azucarados sabor frutal.",
    stock: 20
  },
  {
    id: 768,
    nombre: "Menthoplus Cereza",
    precio: 900,
    imagen: "/products/kiosco/menthoplusCereza.png",
    categoria: "Kiosco",
    descripcion: "Pastillas Menthoplus sabor cereza fresca.",
    stock: 20
  },
  {
    id: 769,
    nombre: "Menthoplus Miel",
    precio: 900,
    imagen: "/products/kiosco/menthoplusMiel.png",
    categoria: "Kiosco",
    descripcion: "Pastillas Menthoplus sabor miel y mentol.",
    stock: 20
  },
  {
    id: 770,
    nombre: "Menthoplus Negro",
    precio: 900,
    imagen: "/products/kiosco/menthoplusStrong.png",
    categoria: "Kiosco",
    descripcion: "Pastillas Menthoplus Strong sabor mentol extra fuerte.",
    stock: 20
  },
  {
    id: 771,
    nombre: "Menthoplus Sin Azúcar Cereza",
    precio: 1100,
    imagen: "/products/kiosco/menthoplusSinAzucarCereza.png",
    categoria: "Kiosco",
    descripcion: "Pastillas Menthoplus Zero sin azúcar sabor cereza.",
    stock: 20
  },
  {
    id: 772,
    nombre: "Menthoplus Sin Azúcar Durazno",
    precio: 1100,
    imagen: "/products/kiosco/menthoplusZeroDurazno.png",
    categoria: "Kiosco",
    descripcion: "Pastillas Menthoplus Zero sin azúcar sabor durazno.",
    stock: 20
  },
  {
    id: 773,
    nombre: "Menthoplus Sin Azúcar Mentol",
    precio: 1100,
    imagen: "/products/kiosco/menthoplusZeroMentol.png",
    categoria: "Kiosco",
    descripcion: "Pastillas Menthoplus Zero sin azúcar sabor mentol.",
    stock: 20
  },
  {
    id: 774,
    nombre: "Menthoplus Sin Azúcar Negro",
    precio: 1100,
    imagen: "/products/kiosco/menthoplusZeroMints.png",
    categoria: "Kiosco",
    descripcion: "Pastillas Menthoplus Zero sin azúcar sabor mentol extra fuerte.",
    stock: 20
  },
  {
    id: 775,
    nombre: "Topline Fruta",
    precio: 800,
    imagen: "/products/kiosco/toplineFruta.png",
    categoria: "Kiosco",
    descripcion: "Chicles Topline sabor fruta de larga duración.",
    stock: 20
  },
  {
    id: 776,
    nombre: "Topline Menta",
    precio: 800,
    imagen: "/products/kiosco/toplineMenta.png",
    categoria: "Kiosco",
    descripcion: "Chicles Topline sabor menta clásica y refrescante.",
    stock: 20
  },
  {
    id: 777,
    nombre: "Topline Mentol Strong",
    precio: 800,
    imagen: "/products/kiosco/toplineStrong.png",
    categoria: "Kiosco",
    descripcion: "Chicles Topline sabor mentol fuerte de larga duración.",
    stock: 20
  },
  {
    id: 778,
    nombre: "Topline Extreme Ácidos Ananá",
    precio: 800,
    imagen: "/products/kiosco/toplineAcidosAnana.png",
    categoria: "Kiosco",
    descripcion: "Chicles Topline Extreme sabor ácido de ananá.",
    stock: 20
  },
  {
    id: 779,
    nombre: "Topline 7 Cherry Violet",
    precio: 1100,
    imagen: "/products/kiosco/topline7Cherry.png",
    categoria: "Kiosco",
    descripcion: "Chicles Topline Seven sabor cherry violeta intensa y refrescante.",
    stock: 20
  },
  {
    id: 780,
    nombre: "Topline 7 Frutilla Vibrante",
    precio: 1100,
    imagen: "/products/kiosco/topline7Frutilla.png",
    categoria: "Kiosco",
    descripcion: "Chicles Topline Seven sabor Frutilla Vibrante de larga duración.",
    stock: 20
  },
  {
    id: 781,
    nombre: "Topline 7 Menta Explosiva",
    precio: 1100,
    imagen: "/products/kiosco/topline7MentaExplosiva.png",
    categoria: "Kiosco",
    descripcion: "Chicles Topline Seven sabor menta explosiva.",
    stock: 20
  },
  {
    id: 782,
    nombre: "Topline 7 Mentol Glacial",
    precio: 1100,
    imagen: "/products/kiosco/topline7Mentol.png",
    categoria: "Kiosco",
    descripcion: "Chicles Topline Seven sabor mentol glacial intenso.",
    stock: 20
  },
  {
    id: 783,
    nombre: "Turrón Arcor",
    precio: 350,
    imagen: "/products/kiosco/turronMani.png",
    categoria: "Kiosco",
    descripcion: "Turrón de maní Arcor con oblea, ideal para un snack rápido.",
    stock: 20
  },
  {
    id: 784,
    nombre: "Galletas Oblita Chocolate",
    precio: 600,
    imagen: "/products/kiosco/oblitaChocolate50gr.png",
    categoria: "Kiosco",
    descripcion: "Galletitas Oblita sabor chocolate, crocantes y deliciosas, presentación de 50g.",
    stock: 20
  },
  {
    id: 785,
    nombre: "Galletas Oblita Vainilla",
    precio: 600,
    imagen: "/products/kiosco/oblitaVainilla50gr.png",
    categoria: "Kiosco",
    descripcion: "Galletitas Oblita sabor vainilla, crocantes y deliciosas, presentación de 50g.",
    stock: 20
  },
  {
    id: 786,
    nombre: "Galletas Oblita Frutilla",
    precio: 600,
    imagen: "/products/kiosco/oblitaFrutilla50gr.png",
    categoria: "Kiosco",
    descripcion: "Galletitas Oblita sabor frutilla, crocantes y deliciosas, presentación de 50g.",
    stock: 20
  },
  {
    id: 730,
    nombre: "Galletitas Surtidas Bagley",
    precio: 4100,
    imagen: "/products/desayuno/surtidoBagley.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas surtidas Bagley de sabores variados, ideales para compartir en la merienda.",
    stock: 20
  },
  {
    id: 731,
    nombre: "Galletitas Surtidas Diversión",
    precio: 3200,
    imagen: "/products/desayuno/surtidoDiversion.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas surtidas Diversión de sabores dulces y variados, ideales para los más chicos.",
    stock: 20
  },
  {
    id: 732,
    nombre: "Galletitas Surtidas La Nonna",
    precio: 1900,
    imagen: "/products/desayuno/surtidoLaNonna.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas dulces surtidas La Nonna con sabor casero.",
    stock: 20
  },
  {
    id: 733,
    nombre: "Galletitas Mana Vainilla",
    precio: 1500,
    imagen: "/products/desayuno/galletasManaVainilla.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas dulces clásicas Mana sabor vainilla.",
    stock: 20
  },
  {
    id: 734,
    nombre: "Galletitas Mana Leche",
    precio: 1500,
    imagen: "/products/desayuno/galletasManaLeche.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas dulces clásicas Mana sabor leche.",
    stock: 20
  },
  {
    id: 735,
    nombre: "Galletitas Mana Acarameladas",
    precio: 1500,
    imagen: "/products/desayuno/galletasManaAcarameladas.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas dulces clásicas Mana con baño acaramelado.",
    stock: 20
  },
  {
    id: 736,
    nombre: "Galletitas Mana Rellenas Limón",
    precio: 1900,
    imagen: "/products/desayuno/galletasManaRellenasLimon.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas dulces Mana rellenas con crema sabor limón.",
    stock: 20
  },
  {
    id: 737,
    nombre: "Galletitas Mana Rellenas Chocolate",
    precio: 1900,
    imagen: "/products/desayuno/galletasManaRellenasChocolate.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas dulces Mana rellenas con crema sabor chocolate.",
    stock: 20
  },
  {
    id: 738,
    nombre: "Galletitas Mana Rellenas Vainilla",
    precio: 1900,
    imagen: "/products/desayuno/galletasManaRellenasVainilla.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas dulces Mana rellenas con crema sabor vainilla.",
    stock: 20
  },
  {
    id: 739,
    nombre: "Galletitas Mana Rellenas Frutilla",
    precio: 1900,
    imagen: "/products/desayuno/galletasManaRellenasFrutilla.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas dulces Mana rellenas con crema sabor frutilla.",
    stock: 20
  },
  {
    id: 740,
    nombre: "Galletitas Oreos Menta",
    precio: 2200,
    imagen: "/products/desayuno/galletasOreoMenta.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas de chocolate Oreo rellenas con crema sabor menta.",
    stock: 20
  },
  {
    id: 741,
    nombre: "Galletitas Oreos Frutilla",
    precio: 2200,
    imagen: "/products/desayuno/galletasOreoFrutilla.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas de chocolate Oreo rellenas con crema sabor frutilla.",
    stock: 20
  },
  {
    id: 742,
    nombre: "Galletitas Pepitos",
    precio: 2200,
    imagen: "/products/desayuno/galletasPepitos.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas dulces clásicas Pepitos con chips de chocolate.",
    stock: 20
  },
  {
    id: 503,
    nombre: "Pan Bollito",
    precio: 3400,
    imagen: "/products/panificacion/panBollito.png",
    categoria: "Panificación",
    descripcion: "Pan bollito fresco. Precio por kilogramo.",
    stock: 20,
    unidadPrecio: "Kg",
    esAGranel: true
  },
  {
    id: 504,
    nombre: "Pan Mignon",
    precio: 3400,
    imagen: "/products/panificacion/panMignon.png",
    categoria: "Panificación",
    descripcion: "Pan mignon fresco. Precio por kilogramo.",
    stock: 20,
    unidadPrecio: "Kg",
    esAGranel: true
  },
  {
    id: 505,
    nombre: "Pan Criollo Económico",
    precio: 3400,
    imagen: "/products/panificacion/criolloComunEconomico.png",
    categoria: "Panificación",
    descripcion: "Pan criollo económico fresco. Precio por kilogramo.",
    stock: 20,
    unidadPrecio: "Kg",
    esAGranel: true
  },
  {
    id: 506,
    nombre: "Pan Criollo Común",
    precio: 5500,
    imagen: "/products/panificacion/criolloComun.png",
    categoria: "Panificación",
    descripcion: "Pan criollo común fresco. Precio por kilogramo.",
    stock: 20,
    unidadPrecio: "Kg",
    esAGranel: true
  },
  {
    id: 507,
    nombre: "Pan Criollo de Hojaldre",
    precio: 5500,
    imagen: "/products/panificacion/criolloHojaldre.png",
    categoria: "Panificación",
    descripcion: "Pan criollo de hojaldre fresco. Precio por kilogramo.",
    stock: 20,
    unidadPrecio: "Kg",
    esAGranel: true
  },
  {
    id: 165,
    nombre: "Facturas Surtidas",
    precio: 800,
    imagen: "/products/panificacion/facturas.png",
    categoria: "Panificación",
    descripcion: "Facturas surtidas de panadería artesanales. Precio por unidad o por docena.",
    stock: 100,
    unidadPrecio: "c/u",
    esFactura: true,
  },
  {
    id: 508,
    nombre: "Cremonas",
    precio: 2800,
    imagen: "/products/panificacion/cremonas.png",
    categoria: "Panificación",
    descripcion: "Cremonas artesanales frescas.",
    stock: 20,
    unidadPrecio: "c/u"
  },
  {
    id: 509,
    nombre: "Pan Casero",
    precio: 2400,
    imagen: "/products/panificacion/panCasero.png",
    categoria: "Panificación",
    descripcion: "Pan casero tradicional fresco.",
    stock: 20,
    unidadPrecio: "c/u"
  },
  {
    id: 510,
    nombre: "Manteca Clucelat 100g",
    precio: 1300,
    imagen: "/products/lacteos/mantecaClucelat100.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Manteca Clucelat, presentación por 100g.",
    stock: 20
  },
  {
    id: 511,
    nombre: "Manteca Clucelat 200g",
    precio: 2300,
    imagen: "/products/lacteos/mantecaClucelat200.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Manteca Clucelat, presentación por 200g.",
    stock: 20
  },
  {
    id: 166,
    nombre: "Filet de Merluza Finas Hierbas",
    precio: 16900,
    imagen: "/products/congelados/filettMerluzaFinasHierbas.png",
    categoria: "Congelados",
    descripcion: "Filet de merluza rebozado con finas hierbas. Tierno por dentro, crocante por fuera. Ideal al horno o frito. Precio por 1kg.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "1kg"
  },
  {
    id: 167,
    nombre: "Filet de Merluza Rebozado",
    precio: 16900,
    imagen: "/products/congelados/filetMerluzaRebozado.png",
    categoria: "Congelados",
    descripcion: "Filet de merluza con rebozado clásico, jugoso y crocante. Listo para freír u hornear. Precio por 1kg.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "1kg"
  },
  {
    id: 168,
    nombre: "Crocante de Merluza",
    precio: 14800,
    imagen: "/products/congelados/crocanteMerluza.png",
    categoria: "Congelados",
    descripcion: "Merluza con cobertura extra crocante, perfecta para horno o fritura. Rendidora y sabrosa. Precio por 1kg.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "1kg"
  },
  {
    id: 169,
    nombre: "Medallón de Merluza con Espinaca",
    precio: 9500,
    imagen: "/products/congelados/medallonMerluzaEspinacaQueso.png",
    categoria: "Congelados",
    descripcion: "Medallón de merluza relleno de espinaca y queso, rebozado y supercongelado. Nutritivo y fácil de preparar. Precio por 1kg.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "1kg"
  },
  {
    id: 170,
    nombre: "Medallón de Pollo Jamón y Queso",
    precio: 10500,
    imagen: "/products/congelados/medallonPolloconJamonQueso.png",
    categoria: "Congelados",
    descripcion: "Medallón de pollo relleno de jamón y queso, rebozado y supercongelado. Ideal para el horno o la sartén. Precio por 1kg.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "1kg"
  },
  {
    id: 171,
    nombre: "Medallón de Pollo Espinaca y Queso",
    precio: 10500,
    imagen: "/products/congelados/medallonPolloEspinacaQueso.png",
    categoria: "Congelados",
    descripcion: "Medallón de pollo relleno de espinaca y queso, rebozado y supercongelado. Una opción nutritiva y sabrosa. Precio por 1kg.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "1kg"
  },
  {
    id: 172,
    nombre: "Medallón Mix de Vegetales",
    precio: 9000,
    imagen: "/products/congelados/medallonMixVegetales.png",
    categoria: "Congelados",
    descripcion: "Medallón vegetal con mix de verduras, rebozado y supercongelado. Ideal para vegetarianos y toda la familia. Precio por 1kg.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "1kg"
  },
  {
    id: 173,
    nombre: "Bocaditos de Calabaza",
    precio: 9500,
    imagen: "/products/congelados/bocaditosCalabazaQueso.png",
    categoria: "Congelados",
    descripcion: "Bocaditos de calabaza y queso, rebozados y supercongelados. Cremosos por dentro, doraditos por fuera. Precio por 1kg.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "1kg"
  },
  {
    id: 174,
    nombre: "Mini Pechugas al Verdeo",
    precio: 14500,
    imagen: "/products/congelados/miniPechugasVerdeo.png",
    categoria: "Congelados",
    descripcion: "Mini pechugas de pollo con salsa de verdeo, rebozadas y supercongeladas. Tiernas y llenas de sabor. Precio por 1kg.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "1kg"
  },
  {
    id: 175,
    nombre: "Rabas Rebozadas",
    precio: 28000,
    imagen: "/products/congelados/rabasRebozadas.png",
    categoria: "Congelados",
    descripcion: "Rabas de calamar rebozadas y supercongeladas. Tiernas y crocantes, ideales para freír u hornear. Precio por 1kg.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "1kg"
  },
  {
    id: 176,
    nombre: "Aros de Cebolla Rebozados",
    precio: 16500,
    imagen: "/products/congelados/arosCebollaRebozadas.png",
    categoria: "Congelados",
    descripcion: "Aros de cebolla con rebozado crocante, supercongelados. Perfectos como entrada o guarnición. Precio por 1kg.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "1kg"
  },
  {
    id: 177,
    nombre: "Bastones de Muzzarella",
    precio: 16600,
    imagen: "/products/congelados/bastonesMuzza.png",
    categoria: "Congelados",
    descripcion: "Bastones de muzzarella rebozados y supercongelados. Se derriten por dentro con una cobertura dorada y crocante. Precio por 1kg.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "1kg"
  },
  {
    id: 178,
    nombre: "Mini Croquetas Jamón y Queso",
    precio: 10900,
    imagen: "/products/congelados/miniCroquetasJamonQueso.png",
    categoria: "Congelados",
    descripcion: "Mini croquetas rellenas de jamón y queso, rebozadas y supercongeladas. Irresistibles como picada o entrada. Precio por 1kg.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "1kg"
  },
  {
    id: 179,
    nombre: "Mini Croquetas Espinaca y Queso",
    precio: 10900,
    imagen: "/products/congelados/miniCroquetasEspinacaQueso.png",
    categoria: "Congelados",
    descripcion: "Mini croquetas rellenas de espinaca y queso, rebozadas y supercongeladas. Una opción nutritiva y deliciosa. Precio por 1kg.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "1kg"
  },
  {
    id: 180,
    nombre: "Croqueta de Papa Jamón y Queso",
    precio: 10500,
    imagen: "/products/congelados/croquetaPapaJamonQueso.png",
    categoria: "Congelados",
    descripcion: "Croqueta de papa rellena de jamón y queso, rebozada y supercongelada. Cremosa por dentro, dorada por fuera. Precio por 1kg.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "1kg"
  },
  {
    id: 181,
    nombre: "Alitas de Pollo Rebozadas",
    precio: 6900,
    imagen: "/products/congelados/alitaPolloRebozada.png",
    categoria: "Congelados",
    descripcion: "Alitas de pollo con rebozado crocante, supercongeladas. Ideales para el horno o la freidora. Precio por 1kg.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "1kg"
  },
  {
    id: 182,
    nombre: "Patitas de Pollo Rebozadas",
    precio: 10700,
    imagen: "/products/congelados/patitasRebozadas.png",
    categoria: "Congelados",
    descripcion: "Patitas de pollo con rebozado crocante, supercongeladas. Jugosas por dentro y doradas por fuera. Precio por 1kg.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "1kg"
  },
  {
    id: 183,
    nombre: "Nuggets de Pollo",
    precio: 13200,
    imagen: "/products/congelados/nuggetsPollo.png",
    categoria: "Congelados",
    descripcion: "Nuggets de pechuga de pollo rebozados y supercongelados. Clásicos e irresistibles para toda la familia. Precio por 1kg.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "1kg"
  },
  {
    id: 184,
    nombre: "Tiritas de Pollo",
    precio: 13500,
    imagen: "/products/congelados/tiritasDePollo.png",
    categoria: "Congelados",
    descripcion: "Tiritas de pechuga de pollo rebozadas y supercongeladas. Crocantes y tiernas, ideales para picar o acompañar. Precio por 1kg.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "1kg"
  },
  {
    id: 185,
    nombre: "Papas Bastón",
    precio: 7400,
    imagen: "/products/congelados/papasBaston.png",
    categoria: "Congelados",
    descripcion: "Papas bastón supercongeladas, clásicas y rendidoras. Doradas y crocantes al horno o freidora. Precio por 1kg.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "1kg"
  },
  {
    id: 186,
    nombre: "Papas Smile",
    precio: 10900,
    imagen: "/products/congelados/papasSmile.png",
    categoria: "Congelados",
    descripcion: "Papas smile supercongeladas con forma de carita sonriente. Las favoritas de los chicos, crocantes y esponjosas. Precio por 1kg.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "1kg"
  },
  {
    id: 187,
    nombre: "Papas Noisette",
    precio: 10900,
    imagen: "/products/congelados/papaNoisette.png",
    categoria: "Congelados",
    descripcion: "Papas noisette supercongeladas, bolitas de papa crocantes por fuera y suaves por dentro. Ideales como guarnición. Precio por 1kg.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "1kg"
  },
  {
    id: 188,
    nombre: "Formitas de Pollo",
    precio: 10500,
    imagen: "/products/congelados/formitasPollo.png",
    categoria: "Congelados",
    descripcion: "Formitas de pollo rebozadas y supercongeladas. Divertidas y crocantes, ideales para los más chicos. Precio por 1kg.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "1kg"
  },
  {
    id: 189,
    nombre: "Hamburguesas de Pollo",
    precio: 11400,
    imagen: "/products/congelados/hamburguesasPollo.png",
    categoria: "Congelados",
    descripcion: "Hamburguesas de pollo supercongeladas. Jugosas y sabrosas, listas para la plancha o parrilla. Precio por 1kg.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "1kg"
  },
  {
    id: 190,
    nombre: "Pata Muslo",
    precio: 5600,
    imagen: "/products/polleria/pataMuslo.png",
    categoria: "Pollería",
    descripcion: "Pata muslo de pollo fresco. Ideal para el horno, la parrilla o guisos. Precio por kilogramo.",
    stock: 50,
    esAGranel: true,
    unidadPrecio: "Kg"
  },
  {
    id: 191,
    nombre: "Alitas de Pollo con rancho",
    precio: 3200,
    imagen: "/products/polleria/alitasPolloConRancho.png",
    categoria: "Pollería",
    descripcion: "Alitas de pollo con rancho  frescas, ideales para la parrilla o al horno. Precio por kilogramo.",
    stock: 50,
    esAGranel: true,
    unidadPrecio: "Kg"
  },
  {
    id: 192,
    nombre: "Alitas de Pollo Sin Rancho",
    precio: 6500,
    imagen: "/products/polleria/alitasPolloSinRancho.png",
    categoria: "Pollería",
    descripcion: "Alitas de pollo sin rancho, limpias y listas para cocinar. Precio por kilogramo.",
    stock: 50,
    esAGranel: true,
    unidadPrecio: "Kg"
  },
  {
    id: 193,
    nombre: "Pata Muslo Deshuesada",
    precio: 12800,
    imagen: "/products/polleria/pataMusloDeshuesada.png",
    categoria: "Pollería",
    descripcion: "Pata muslo de pollo deshuesada, sin hueso y lista para cocinar. Práctica y rendidora. Precio por kilogramo.",
    stock: 50,
    esAGranel: true,
    unidadPrecio: "Kg"
  },
  {
    id: 194,
    nombre: "Pechugas de Pollo",
    precio: 13200,
    imagen: "/products/polleria/pechugasdePollo.png",
    categoria: "Pollería",
    descripcion: "Pechugas de pollo frescas, deshuesadas y sin piel. La opción más magra y versátil. Precio por kilogramo.",
    stock: 50,
    esAGranel: true,
    unidadPrecio: "Kg"
  },
  {
    id: 195,
    nombre: "Pollo Entero",
    precio: 5600,
    imagen: "/products/polleria/polloEntero.png",
    categoria: "Pollería",
    descripcion: "Pollo entero fresco de granja, calidad superior. Ideal para el horno o la parrilla. Precio por kilogramo.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "Kg"
  },
  {
    id: 196,
    nombre: "Milanesas de Pollo con Provenzal",
    precio: 11400,
    imagen: "/products/polleria/milaPolloConProvenzal.png",
    categoria: "Pollería",
    descripcion: "Milanesas de pollo con provenzal, elaboradas con pechuga de primera calidad. Listas para freír u hornear. Precio por kilogramo.",
    stock: 30,
    esAGranel: true,
    unidadPrecio: "Kg"
  },
  {
    id: 197,
    nombre: "Milanesas de Pollo Sin Provenzal",
    precio: 11400,
    imagen: "/products/polleria/milaPolloSinProvenzal.png",
    categoria: "Pollería",
    descripcion: "Milanesas de pollo sin provenzal, elaboradas con pechuga de primera calidad. Listas para freír u hornear. Precio por kilogramo.",
    stock: 30,
    esAGranel: true,
    unidadPrecio: "Kg"
  },
  {
    id: 199,
    nombre: "Medio Pollo",
    precio: 5800,
    imagen: "/products/polleria/medioPollo.png",
    categoria: "Pollería",
    descripcion: "Medio pollo fresco y limpio, listo para cocinar al horno o a la parrilla. Precio por kilogramo.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "Kg"
  },
  {
    id: 200,
    nombre: "Arrollado de Pollo",
    precio: 9000,
    imagen: "/products/polleria/arrolladoPollo.png",
    categoria: "Pollería",
    descripcion: "Arrollado de pollo artesanal. Disponible en dos variedades: jamón, queso, morrón, aceituna y huevo — o roquefort, jamón, morrón, aceituna y huevo. Consultá disponibilidad.",
    stock: 10,
    unidadPrecio: "c/u",
    sabores: ["Jamón, Queso, Morrón, Aceituna y Huevo", "Roquefort, Jamón, Morrón, Aceituna y Huevo"]
  },
  {
    id: 201,
    nombre: "Milanesa de Carne",
    precio: 16800,
    imagen: "/products/polleria/milasCarne.png",
    categoria: "Pollería",
    descripcion: "Milanesa de carne vacuna tierna y sabrosa, empanada lista para cocinar. Precio por kilogramo.",
    stock: 30,
    esAGranel: true,
    unidadPrecio: "Kg"
  },
  {
    id: 202,
    nombre: "Milanesa de Pata Muslo",
    precio: 9500,
    imagen: "/products/polleria/milaPataMuslo.png",
    categoria: "Pollería",
    descripcion: "Milanesa elaborada con pata muslo de pollo fresca y deshuesada. Súper jugosa y tierna. Precio por kilogramo.",
    stock: 30,
    esAGranel: true,
    unidadPrecio: "Kg"
  },
  {
    id: 203,
    nombre: "Milanesa de Merluza",
    precio: 13000,
    imagen: "/products/polleria/milaMerluza.png",
    categoria: "Pollería",
    descripcion: "Milanesa de filete de merluza rebozada, fresca y deliciosa. Precio por kilogramo.",
    stock: 30,
    esAGranel: true,
    unidadPrecio: "Kg"
  },
  {
    id: 204,
    nombre: "Molida de Pechuga de Pollo (500g)",
    precio: 6600,
    imagen: "/products/polleria/molidaPechugaPollo.png",
    categoria: "Pollería",
    descripcion: "Carne picada/molida de pechuga de pollo, 100% magra y fresca. Presentación en bolsita de 500g.",
    stock: 30,
    unidadPrecio: "Bolsa"
  },
  {
    id: 205,
    nombre: "Molida de Pata Muslo (500g)",
    precio: 6400,
    imagen: "/products/polleria/molidaPataMuslo.png",
    categoria: "Pollería",
    descripcion: "Carne picada/molida elaborada con pata muslo de pollo deshuesada, más jugosa y sabrosa. Presentación en bolsita de 500g.",
    stock: 30,
    unidadPrecio: "Bolsa"
  },
  {
    id: 400,
    nombre: "Escabeche Artesanal de berenjena",
    precio: 6000,
    imagen: "/products/comidas listas/escabecheBerenjena.png",
    categoria: "Comidas listas",
    descripcion: "Escabeche artesanal de berenjena.",
    stock: 20
  },
  {
    id: 401,
    nombre: "Escabeche Artesanal de pollo",
    precio: 7000,
    imagen: "/products/comidas listas/escabechePollo.png",
    categoria: "Comidas listas",
    descripcion: "Escabeche artesanal de pollo.",
    stock: 20
  },
  {
    id: 402,
    nombre: "Bandeja Ensalada de Zanahoria, Remolacha y Repollo",
    precio: 1600,
    imagen: "/products/polleria/bandejaEnsalada1.png",
    categoria: "Pollería",
    descripcion: "Bandeja de ensalada fresca con zanahoria, remolacha y repollo.",
    stock: 20
  },
  {
    id: 403,
    nombre: "Bandeja Ensalada de Zanahoria, Achicoria y Repollo",
    precio: 1600,
    imagen: "/products/polleria/bandejaEnsalada2.png",
    categoria: "Pollería",
    descripcion: "Bandeja de ensalada fresca con zanahoria, achicoria y repollo.",
    stock: 20
  },
  {
    id: 404,
    nombre: "Bandeja Sopera",
    precio: 1600,
    imagen: "/products/polleria/bandejaSopera.png",
    categoria: "Pollería",
    descripcion: "Bandeja sopera con verduras frescas listas para sopa.",
    stock: 20
  },
  /*{
    id: 405,
    nombre: "Sal Ahumada para Carne Asada",
    precio: 2200,
    imagen: "/products/polleria/salParrilleraAhumadaCarne.png",
    categoria: "Pollería",
    descripcion: "Sal ahumada ideal para sazonar carne asada.",
    stock: 20
  },
  {
    id: 406,
    nombre: "Sal Ahumada para Pollo Asado",
    precio: 2200,
    imagen: "/products/polleria/salParrilleraAhumadaPollo.png",
    categoria: "Pollería",
    descripcion: "Sal ahumada especial para pollo asado.",
    stock: 20
  },*/
  {
    id: 407,
    nombre: "Hamburguesa de Carne",
    precio: 13400,
    imagen: "/products/congelados/hamburguesasCarne.png",
    categoria: "Congelados",
    descripcion: "Hamburguesa de carne congelada de primera calidad. Ideal para preparar a la plancha o a la parrilla. Precio por kilogramo.",
    stock: 20,
    esAGranel: true,
    unidadPrecio: "Kg"
  },
  {
    id: 408,
    nombre: "Fideos La Buona Pasta Cinta Ancha",
    precio: 3300,
    imagen: "/products/pastas/buonaPastaCintaAncha.png",
    categoria: "Almacén",
    subcategoria: "Pastas frescas y secas",
    descripcion: "Fideos secos cinta ancha de sémola. Disponibles en varios sabores.",
    stock: 20,
    sabores: ["Huevo", "Morrón", "Espinaca"]
  },
  {
    id: 409,
    nombre: "Fideos La Buona Pasta Cinta Fina",
    precio: 3300,
    imagen: "/products/pastas/buonaPastaCintaFina.png",
    categoria: "Almacén",
    subcategoria: "Pastas frescas y secas",
    descripcion: "Fideos secos cinta fina de sémola. Disponibles en varios sabores.",
    stock: 20,
    sabores: ["Huevo", "Morrón", "Espinaca"]
  },
  {
    id: 410,
    nombre: "Fideos La Buona Pasta Cinta Intermedia",
    precio: 3300,
    imagen: "/products/pastas/buonaPastaCintaIntermedia.png",
    categoria: "Almacén",
    subcategoria: "Pastas frescas y secas",
    descripcion: "Fideos secos cinta intermedia de sémola. Disponibles en varios sabores.",
    stock: 20,
    sabores: ["Huevo", "Morrón", "Espinaca"]
  },
  {
    id: 413,
    nombre: "Milanesas de Soja Rellenas de Jamón y Queso",
    precio: 1000,
    imagen: "/products/congelados/milaSojaJamonQueso.png",
    categoria: "Congelados",
    descripcion: "Milanesa de soja congelada, rellena de jamón y queso. Precio por unidad.",
    stock: 30,
    unidadPrecio: "c/u"
  },
  {
    id: 414,
    nombre: "Milanesas de Soja Rellenas de Roquefort",
    precio: 1000,
    imagen: "/products/congelados/milanesasSojaRoquefort.png",
    categoria: "Congelados",
    descripcion: "Milanesa de soja congelada, rellena de queso roquefort. Precio por unidad.",
    stock: 30,
    unidadPrecio: "c/u"
  },
  {
    id: 415,
    nombre: "Milanesas de Soja Rellenas de Calabaza y Muzzarella",
    precio: 1000,
    imagen: "/products/congelados/milanesasSojaCalabazaMuzza.png",
    categoria: "Congelados",
    descripcion: "Milanesa de soja congelada, rellena de calabaza y muzzarella. Precio por unidad.",
    stock: 30,
    unidadPrecio: "c/u"
  },
  {
    id: 416,
    nombre: "Milanesas de Soja Rellenas de Aceituna, Tomate y Muzzarella",
    precio: 1000,
    imagen: "/products/congelados/milanesasSojaTomateQuesoAceitunas.png",
    categoria: "Congelados",
    descripcion: "Milanesa de soja congelada, rellena de aceituna, tomate y muzzarella. Precio por unidad.",
    stock: 30,
    unidadPrecio: "c/u"
  },
  {
    id: 417,
    nombre: "Milanesas de Soja Rellenas de Espinaca y Muzzarella",
    precio:1000,
    imagen: "/products/congelados/milanesasSojaEspinacaMuzza.png",
    categoria: "Congelados",
    descripcion: "Milanesa de soja congelada, rellena de espinaca y muzzarella. Precio por unidad.",
    stock: 30,
    unidadPrecio: "c/u"
  },
  {
    id: 418,
    nombre: "Milanesas de Soja Rellenas de Cebolla y Muzzarella",
    precio: 1000,
    imagen: "/products/congelados/milanesasSojaCebollaMuzza.png",
    categoria: "Congelados",
    descripcion: "Milanesa de soja congelada, rellena de cebolla y muzzarella. Precio por unidad.",
    stock: 30,
    unidadPrecio: "c/u"
  },
  {
    id: 419,
    nombre: "Sorrentinos de Jamón y Queso",
    precio: 10500,
    imagen: "/products/congelados/sorrentinosJamonQueso.png",
    categoria: "Congelados",
    descripcion: "Sorrentinos congelados de jamón y queso. Precio por 15 unidades.",
    stock: 50,
    unidadPrecio: "15un"
  },
  {
    id: 420,
    nombre: "Sorrentinos de Jamón, Queso y Nuez",
    precio: 10500,
    imagen: "/products/congelados/sorrentinosJamonQuesoNuez.png",
    categoria: "Congelados",
    descripcion: "Sorrentinos congelados de jamón, queso y nuez. Precio por 15 unidades.",
    stock: 50,
    unidadPrecio: "15un"
  },
  {
    id: 421,
    nombre: "Sorrentinos de Berenjena Ahumada",
    precio: 10500,
    imagen: "/products/congelados/sorrentinosBerenjenaAhumada.png",
    categoria: "Congelados",
    descripcion: "Sorrentinos congelados de berenjena ahumada. Precio por 15 unidades.",
    stock: 50,
    unidadPrecio: "15un"
  },
  {
    id: 422,
    nombre: "Sorrentinos de Calabaza y Muzzarella",
    precio: 10500,
    imagen: "/products/congelados/sorrentinosCalabazaMuzzarella.png",
    categoria: "Congelados",
    descripcion: "Sorrentinos congelados de calabaza y muzzarella. Precio por 15 unidades.",
    stock: 50,
    unidadPrecio: "15un"
  },
  {
    id: 423,
    nombre: "Sorrentinos de Pollo y Espinaca",
    precio: 10500,
    imagen: "/products/congelados/sorrentinosPolloEspinaca.png",
    categoria: "Congelados",
    descripcion: "Sorrentinos congelados de pollo y espinaca. Precio por 15 unidades.",
    stock: 50,
    unidadPrecio: "15un"
  },
  {
    id: 500,
    nombre: "Sorrentinos Cuatro Quesos",
    precio: 10500,
    imagen: "/products/congelados/sorrentinosCuatroQuesos.png",
    categoria: "Congelados",
    descripcion: "Sorrentinos congelados rellenos de una exquisita combinación de cuatro quesos. Precio por 15 unidades.",
    stock: 50,
    unidadPrecio: "15un"
  },
  {
    id: 424,
    nombre: "Empanadas de Pollo",
    precio: 1400,
    imagen: "/products/comidas listas/empanadasPollo.png",
    categoria: "Comidas listas",
    descripcion: "Empanadas de pollo listas para disfrutar. Se venden por unidad, media docena o docena.",
    stock: 100,
    esEmpanada: true,
    preciosMultiples: {
      unidad: 1400,
      mediaDocena: 8000,
      docena: 15000
    }
  },
  {
    id: 425,
    nombre: "Empanadas de Carne",
    precio: 1400,
    imagen: "/products/comidas listas/empanadasCarne.png",
    categoria: "Comidas listas",
    descripcion: "Empanadas de carne listas para disfrutar. Se venden por unidad, media docena o docena.",
    stock: 100,
    esEmpanada: true,
    preciosMultiples: {
      unidad: 1400,
      mediaDocena: 8000,
      docena: 15000
    }
  },
  {
    id: 426,
    nombre: "Roulette de Pollo",
    precio: 4900,
    imagen: "/products/congelados/roulettePollo.png",
    categoria: "Pollería",
    descripcion: "Roulette de pollo congelado. Disponible en diferentes sabores.",
    stock: 50,
    sabores: ["Jamón, Queso y Morrón", "Roquefort"]
  },
  {
    id: 427,
    nombre: "Albóndigas de Pollo",
    precio: 11600,
    imagen: "/products/congelados/albondigasPollo.png",
    categoria: "Congelados",
    descripcion: "Albóndigas de pollo congeladas, listas para cocinar. Precio por kilogramo.",
    stock: 50,
    unidadPrecio: "Kg",
    esAGranel: true
  },
  {
    id: 436,
    nombre: "Sandwich de miga de Jamón y Queso",
    precio: 1800,
    unidadPrecio: "c/u",
    imagen: "/products/comidas listas/sandwichJamonQueso.png",
    categoria: "Comidas listas",
    descripcion: "Sándwich de miga de jamón y queso, súper frescos. Se venden por unidad, media docena o docena.",
    stock: 100,
    preciosMultiples: {
      unidad: 1800,
      mediaDocena: 10000,
      docena: 20000
    }
  },
  {
    id: 437,
    nombre: "Sandwich de miga de Verdura",
    precio: 1800,
    unidadPrecio: "c/u",
    imagen: "/products/comidas listas/sandwichVerdura.png",
    categoria: "Comidas listas",
    descripcion: "Sándwich de miga sabor verdura, frescos y del día. Se venden por unidad, media docena o docena.",
    stock: 100,
    preciosMultiples: {
      unidad: 1800,
      mediaDocena: 10000,
      docena: 20000
    }
  },
  {
    id: 438,
    nombre: "Pebetón de Jamón y Queso",
    precio: 1800,
    unidadPrecio: "c/u",
    imagen: "/products/comidas listas/pebetonJamonQueso.png",
    categoria: "Comidas listas",
    descripcion: "Pebetón de jamón y queso tiernos y abundantes. Se venden por unidad, media docena o docena.",
    stock: 100,
    preciosMultiples: {
      unidad: 1800,
      mediaDocena: 10000,
      docena: 20000
    }
  },
  {
    id: 439,
    nombre: "Pebetón de Salame y Queso",
    precio: 1800,
    unidadPrecio: "c/u",
    imagen: "/products/comidas listas/pebetonSalameQueso.png",
    categoria: "Comidas listas",
    descripcion: "Pebetón de salame y queso, frescos y listos para saborear. Se venden por unidad, media docena o docena.",
    stock: 100,
    preciosMultiples: {
      unidad: 1800,
      mediaDocena: 10000,
      docena: 20000
    }
  },
  {
    id: 440,
    nombre: "Empanadas árabes",
    precio: 1400,
    unidadPrecio: "c/u",
    imagen: "/products/comidas listas/empanadasArabes.png",
    categoria: "Comidas listas",
    descripcion: "Empanadas árabes con un toque de limón, deliciosas y cocidas en su punto. Se venden por unidad, media docena o docena.",
    stock: 100,
    esEmpanada: true,
    preciosMultiples: {
      unidad: 1400,
      mediaDocena: 8000,
      docena: 13000
    }
  },
  {
    id: 441,
    nombre: "Pizza freezada Muzzarela",
    precio: 6500,
    imagen: "/products/congelados/pizzaMuzzarella.png",
    categoria: "Congelados",
    descripcion: "Pizza individual con abundante muzzarela, lista para el horno.",
    stock: 50
  },
  {
    id: 442,
    nombre: "Pizza freezada Napolitana",
    precio: 6500,
    imagen: "/products/congelados/pizzaNapolitana.png",
    categoria: "Congelados",
    descripcion: "Pizza individual napolitana con muzzarela, rodajas de tomate fresco, albahaca y ajo.",
    stock: 50
  },
  {
    id: 443,
    nombre: "Pizza freezada Especial",
    precio: 6500,
    imagen: "/products/congelados/pizzaEspecial.png",
    categoria: "Congelados",
    descripcion: "Pizza individual especial con muzzarela, jamón cocido y tiras de morrón.",
    stock: 50
  }
];

interface CatalogoProps {
  searchTerm?: string;
}

const Catalogo = ({ searchTerm = "" }: CatalogoProps) => {
  const [selectedCat, setSelectedCat] = useState<string>("Todos");
  const [selectedSubcat, setSelectedSubcat] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [modalQuantity, setModalQuantity] = useState<number>(1);
  const [gramosSeleccionados, setGramosSeleccionados] = useState<number>(100);
  const [inputGramos, setInputGramos] = useState<string>("");
  const [facturaOpcion, setFacturaOpcion] = useState<"unidad" | "docena">("unidad");
  const [facturaCount, setFacturaCount] = useState<number>(1);
  const [empanadaOpcion, setEmpanadaOpcion] = useState<"unidad" | "media_docena" | "docena">("unidad");
  const [empanadaCount, setEmpanadaCount] = useState<number>(1);
  const [selectedSabor, setSelectedSabor] = useState<string>("");
  const [selectedPresentacion, setSelectedPresentacion] = useState<Presentacion | null>(null);
  const { addToCart } = useCart();
  const subcats = SUBCATEGORIAS[selectedCat] || [];
  const precios = selectedProduct?.preciosMultiples || {
    unidad: 1400,
    mediaDocena: 8000,
    docena: 15000
  };

  const handleCatChange = (cat: string) => {
    setSelectedCat(cat);
    if (cat === "Todos") {
      setSelectedSubcat(null);
      return;
    }
    const firstSub = SUBCATEGORIAS[cat]?.[0];
    setSelectedSubcat(firstSub || null);
  };

  const productosPorCategoria = productos.filter((p) => {
    if (selectedCat === "Todos") return true;
    if (selectedSubcat) {
      return p.categoria === selectedCat && p.subcategoria === selectedSubcat;
    }
    return p.categoria === selectedCat;
  });

  const productosFiltrados = (searchTerm.trim() === ''
    ? productosPorCategoria
    : productos.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )).sort((a, b) => {
        const nameA = a.nombre === "Tiritas de Pollo" ? "Nuggets de Pollo" : a.nombre;
        const nameB = b.nombre === "Tiritas de Pollo" ? "Nuggets de Pollo" : b.nombre;
        if (nameA === nameB) {
          return a.nombre === "Tiritas de Pollo" ? 1 : -1;
        }
        return nameA.localeCompare(nameB);
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
      setGramosSeleccionados(100);
      setInputGramos("");
      setFacturaOpcion("unidad");
      setFacturaCount(1);
      setSelectedSabor(selectedProduct.sabores && selectedProduct.sabores.length > 0 ? selectedProduct.sabores[0] : "");
      setSelectedPresentacion(selectedProduct.presentaciones && selectedProduct.presentaciones.length > 0 ? selectedProduct.presentaciones[0] : null);
    }
  }, [selectedProduct]);

  const handleAddToCart = (
    e: React.MouseEvent,
    p: Producto,
    cant: number = 1,
    sabor: string = "",
    pres?: Presentacion | null
  ) => {
    e.stopPropagation();
    let nombreFinal = p.nombre;
    let precioFinal = p.precio;

    if (pres) {
      nombreFinal = `${p.nombre} - ${pres.nombre}`;
      precioFinal = pres.precio;
    }

    if (sabor) {
      nombreFinal = `${nombreFinal} - ${sabor}`;
    }

    addToCart({ nombre: nombreFinal, precio: precioFinal }, cant);
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString("es-AR")}`;
  };

  return (
    <section id="catalogo" className="bg-background py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary text-center mb-8">
          NUESTROS PRODUCTOS
        </h2>

        {/* Filter System */}
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex flex-col gap-4">
          {/* Main Categories */}
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIAS.map((c) => (
              <button
                key={c}
                onClick={() => handleCatChange(c)}
                className={`min-h-[44px] px-6 py-2 rounded-full font-heading text-[16px] font-bold transition-all ${
                  selectedCat === c 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "bg-muted text-foreground hover:bg-muted/80"
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
                      : "bg-card border-border text-muted-foreground hover:border-gray-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {productosFiltrados.length > 0 ? productosFiltrados.map((p) => {
            const isPromo = p.nombre.toUpperCase().includes("PROMO");
            return (
              <div 
                key={p.id} 
                className="bg-card rounded-[16px] overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all border border-border flex flex-col h-full relative sm:pt-[10px]"
                onClick={() => setSelectedProduct(p)}
              >
                {/* Product Image */}
                <div className={isPromo 
                  ? "w-full bg-card flex items-center justify-center h-48 sm:h-56 overflow-hidden rounded-t-xl"
                  : "w-full h-32 sm:h-56 bg-card flex items-center justify-center overflow-hidden rounded-t-xl relative"
                }>
                  <img 
                    src={p.imagen} 
                    alt={p.nombre} 
                    className={`${isPromo ? "w-full h-full object-contain" : "w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"}`} 
                    loading="lazy" 
                  />
                </div>

                {/* Product Info */}
                <div className="p-3 md:p-5 flex flex-col flex-1">
                  <div className="mb-2 flex flex-col items-center text-center">
                    <span className="inline-block w-fit text-[10px] md:text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-2 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border border-transparent dark:border-green-800/50">
                      {p.subcategoria || p.categoria}
                    </span>
                    <h3 className={`font-body font-bold text-card-foreground leading-tight min-h-[40px] text-center uppercase tracking-tight ${isPromo ? "text-sm sm:text-base" : "text-xs sm:text-[16px]"}`}>
                      {p.nombre}
                    </h3>
                  </div>

                  <div className="mt-auto pt-2 md:pt-4 flex flex-col gap-2 md:gap-3 text-center">
                    <span className="font-heading text-lg md:text-xl font-bold text-primary">
                      {p.presentaciones && p.presentaciones.length > 0 ? (
                        <>
                          <span className="text-xs font-normal text-muted-foreground mr-1 font-body">Desde</span>
                          {formatPrice(Math.min(...p.presentaciones.map(pr => pr.precio)))}
                        </>
                      ) : (
                        <>
                          {formatPrice(p.precio)} {p.unidadPrecio && <span className="text-[10px] md:text-sm font-body text-gray-400">/ {p.unidadPrecio}</span>}
                        </>
                      )}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (p.esAGranel || p.esFactura || p.esEmpanada || p.preciosMultiples || (p.sabores && p.sabores.length > 0) || (p.presentaciones && p.presentaciones.length > 0)) {
                          setSelectedProduct(p);
                        } else {
                          handleAddToCart(e, p);
                        }
                      }}
                      className="w-full bg-primary text-white h-[48px] px-4 rounded-xl font-bold text-[11px] sm:text-sm flex items-center justify-center gap-1 md:gap-2 hover:bg-primary-dark transition-colors shadow-sm"
                    >
                      <Plus size={16} className="md:size-[20px]" />
                      <span>AGREGAR</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          }) : (
            <p className="col-span-full text-center text-muted-foreground">No se encontraron productos</p>
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
              className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-primary hover:text-white transition-all border border-gray-200 shadow-sm text-gray-700"
            >
              <X size={24} />
            </button>
            
            {/* Image Section */}
            <div className="w-full md:w-1/2 bg-[#FAFAFA] dark:bg-[#161412] p-8 flex items-center justify-center border-r border-gray-100 dark:border-gray-800">
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
                  <span className="bg-primary/10 text-primary text-[12px] font-bold px-3 py-1 rounded-full border border-primary/30">
                    {selectedProduct.categoria}
                  </span>
                  {selectedProduct.subcategoria && (
                    <span className="bg-green-100 text-green-700 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {selectedProduct.subcategoria}
                    </span>
                  )}
                </div>
                
                <h2 className="font-heading text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
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
                    {formatPrice(selectedPresentacion ? selectedPresentacion.precio : selectedProduct.precio)} {selectedProduct.unidadPrecio && <span className="text-xl md:text-2xl font-body text-gray-400 font-bold">/ {selectedProduct.unidadPrecio}</span>}
                  </span>
                </div>
              </div>

              {/* Footer Modal */}
              <div className="mt-auto pt-6 border-t border-gray-100">

                {selectedProduct.esFactura ? (
                  /* ── SELECTOR FACTURAS ── */
                  <div className="flex flex-col gap-4">

                    {/* Selector unidad / docena */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => { setFacturaOpcion("unidad"); setFacturaCount(1); }}
                        className={`h-12 rounded-xl font-bold text-sm transition-all border ${
                          facturaOpcion === "unidad"
                            ? "bg-primary text-white border-primary shadow-md"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:border-primary hover:text-primary"
                        }`}
                      >
                        Unidad — $800
                      </button>
                      <button
                        onClick={() => { setFacturaOpcion("docena"); setFacturaCount(1); }}
                        className={`h-12 rounded-xl font-bold text-sm transition-all border ${
                          facturaOpcion === "docena"
                            ? "bg-primary text-white border-primary shadow-md"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:border-primary hover:text-primary"
                        }`}
                      >
                        Docena — $9.000
                      </button>
                    </div>

                    {/* Contador de cantidad */}
                    <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-1 border border-gray-200">
                      <button
                        onClick={() => setFacturaCount(Math.max(1, facturaCount - 1))}
                        className="h-11 w-11 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="font-body px-6 text-xl font-bold text-gray-900">
                        {facturaCount} {facturaOpcion === "unidad" ? "unidad(es)" : "docena(s)"}
                      </span>
                      <button
                        onClick={() => setFacturaCount(facturaCount + 1)}
                        className="h-11 w-11 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                      >
                        <Plus size={20} />
                      </button>
                    </div>

                    {/* Total */}
                    <div className="bg-primary/5 rounded-xl px-4 py-3 flex items-center justify-between border border-primary/20">
                      <span className="text-gray-500 text-sm font-semibold">Total:</span>
                      <span className="text-primary font-black text-2xl">
                        {formatPrice((facturaOpcion === "unidad" ? 800 : 9000) * facturaCount)}
                      </span>
                    </div>

                    {/* Botón agregar */}
                    <button
                      onClick={() => {
                        const precioUnit = facturaOpcion === "unidad" ? 800 : 9000;
                        const label = facturaOpcion === "unidad" ? "unidad" : "docena";
                        addToCart(
                          {
                            nombre: `Facturas x${facturaCount} ${label}${facturaCount > 1 ? "s" : ""}`,
                            precio: precioUnit * facturaCount,
                          },
                          1
                        );
                        setSelectedProduct(null);
                      }}
                      className="bg-primary text-white w-full h-14 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <ShoppingCart size={22} />
                      Agregar al Carrito
                    </button>
                  </div>

                ) : (selectedProduct.esEmpanada || selectedProduct.preciosMultiples) ? (
                  /* ── SELECTOR EMPANADAS Y COMBOS MÚLTIPLES ── */
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => { setEmpanadaOpcion("unidad"); setEmpanadaCount(1); }}
                        className={`h-12 rounded-xl font-bold text-[11px] sm:text-xs transition-all border ${
                          empanadaOpcion === "unidad"
                            ? "bg-primary text-white border-primary shadow-md"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:border-primary hover:text-primary"
                        }`}
                      >
                        Unidad — {formatPrice(precios.unidad)}
                      </button>
                      <button
                        onClick={() => { setEmpanadaOpcion("media_docena"); setEmpanadaCount(1); }}
                        className={`h-12 rounded-xl font-bold text-[11px] sm:text-xs transition-all border ${
                          empanadaOpcion === "media_docena"
                            ? "bg-primary text-white border-primary shadow-md"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:border-primary hover:text-primary"
                        }`}
                      >
                        x6 — {formatPrice(precios.mediaDocena)}
                      </button>
                      <button
                        onClick={() => { setEmpanadaOpcion("docena"); setEmpanadaCount(1); }}
                        className={`h-12 rounded-xl font-bold text-[11px] sm:text-xs transition-all border ${
                          empanadaOpcion === "docena"
                            ? "bg-primary text-white border-primary shadow-md"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:border-primary hover:text-primary"
                        }`}
                      >
                        x12 — {formatPrice(precios.docena)}
                      </button>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-1 border border-gray-200">
                      <button
                        onClick={() => setEmpanadaCount(Math.max(1, empanadaCount - 1))}
                        className="h-11 w-11 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="font-body px-6 text-xl font-bold text-gray-900">
                        {empanadaCount} {empanadaOpcion === "unidad" ? "unidad(es)" : empanadaOpcion === "media_docena" ? "media docena(s)" : "docena(s)"}
                      </span>
                      <button
                        onClick={() => setEmpanadaCount(empanadaCount + 1)}
                        className="h-11 w-11 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                      >
                        <Plus size={20} />
                      </button>
                    </div>

                    <div className="bg-primary/5 rounded-xl px-4 py-3 flex items-center justify-between border border-primary/20">
                      <span className="text-gray-500 text-sm font-semibold">Total:</span>
                      <span className="text-primary font-black text-2xl">
                        {formatPrice((empanadaOpcion === "unidad" ? precios.unidad : empanadaOpcion === "media_docena" ? precios.mediaDocena : precios.docena) * empanadaCount)}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        const precioUnit = empanadaOpcion === "unidad" ? precios.unidad : empanadaOpcion === "media_docena" ? precios.mediaDocena : precios.docena;
                        const label = empanadaOpcion === "unidad" ? "unidad" : empanadaOpcion === "media_docena" ? "media docena" : "docena";
                        addToCart(
                          {
                            nombre: `${selectedProduct.nombre} x${empanadaCount} ${label}${empanadaCount > 1 ? "s" : ""}`,
                            precio: precioUnit * empanadaCount,
                          },
                          1
                        );
                        setSelectedProduct(null);
                      }}
                      className="bg-primary text-white w-full h-14 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <ShoppingCart size={22} />
                      Agregar al Carrito
                    </button>
                  </div>

                ) : selectedProduct.esAGranel ? (
                  /* ── SELECTOR GRANEL ── */
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-4 gap-2">
                      {[100, 200, 500, 1000].map((g) => (
                        <button
                          key={g}
                          onClick={() => { setGramosSeleccionados(g); setInputGramos(""); }}
                          className={`h-11 rounded-xl font-bold text-sm transition-all border ${
                            gramosSeleccionados === g && inputGramos === ""
                              ? "bg-primary text-white border-primary shadow-md"
                              : "bg-gray-50 text-gray-700 border-gray-200 hover:border-primary hover:text-primary"
                          }`}
                        >
                          {g === 1000 ? "1kg" : `${g}g`}
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        inputMode="numeric"
                        min={50}
                        step={50}
                        placeholder="Ingresá los gramos que necesitas"
                        value={inputGramos}
                        onChange={(e) => {
                          setInputGramos(e.target.value);
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val > 0) setGramosSeleccionados(val);
                        }}
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-bold text-base outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-gray-400 placeholder:font-normal"
                      />
                      {inputGramos && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">g</span>
                      )}
                    </div>

                    <div className="bg-primary/5 rounded-xl px-4 py-3 flex items-center justify-between border border-primary/20">
                      <span className="text-gray-500 text-sm font-semibold">Total estimado:</span>
                      <span className="text-primary font-black text-2xl">
                        {formatPrice(Math.round((selectedProduct.unidadPrecio?.toLowerCase().includes('kg') ? selectedProduct.precio / 10 : selectedProduct.precio) * gramosSeleccionados / 100))}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        const gramos = gramosSeleccionados;
                        const precioBase100g = selectedProduct.unidadPrecio?.toLowerCase().includes('kg') ? selectedProduct.precio / 10 : selectedProduct.precio;
                        const precioTotal = Math.round(precioBase100g * gramos / 100);
                        addToCart(
                          {
                            nombre: `${selectedProduct.nombre} (${gramos >= 1000 ? `${gramos / 1000}kg` : `${gramos}g`})`,
                            precio: precioTotal,
                          },
                          1
                        );
                        setSelectedProduct(null);
                      }}
                      disabled={gramosSeleccionados <= 0}
                      className="bg-primary text-white w-full h-14 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40"
                    >
                      <ShoppingCart size={22} />
                      Agregar {gramosSeleccionados >= 1000 ? `${gramosSeleccionados / 1000}kg` : `${gramosSeleccionados}g`} al Carrito
                    </button>
                  </div>

                ) : (
                  /* ── SELECTOR NORMAL ── */
                  <div className="flex flex-col gap-6 w-full">
                    {selectedProduct.presentaciones && selectedProduct.presentaciones.length > 0 && (
                      <div>
                        <span className="text-gray-500 font-semibold text-sm block mb-2">Seleccioná una presentación:</span>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedProduct.presentaciones.map((pr) => (
                            <button
                              key={pr.nombre}
                              onClick={() => setSelectedPresentacion(pr)}
                              className={`p-3 rounded-xl font-bold text-sm transition-all border flex flex-col items-center justify-center gap-1 ${
                                selectedPresentacion?.nombre === pr.nombre
                                  ? "bg-primary text-white border-primary shadow-md"
                                  : "bg-gray-50 text-gray-700 border-gray-200 hover:border-primary hover:text-primary"
                              }`}
                            >
                              <span className="text-base font-extrabold">{pr.nombre}</span>
                              <span className={`text-xs ${selectedPresentacion?.nombre === pr.nombre ? "text-white/80" : "text-primary font-body"}`}>
                                {formatPrice(pr.precio)}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProduct.sabores && selectedProduct.sabores.length > 0 && (
                      <div>
                        <span className="text-gray-500 font-semibold text-sm block mb-2">Seleccioná un sabor:</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.sabores.map((s) => (
                            <button
                              key={s}
                              onClick={() => setSelectedSabor(s)}
                              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border ${
                                selectedSabor === s
                                  ? "bg-primary text-white border-primary shadow-md"
                                  : "bg-gray-50 text-gray-700 border-gray-200 hover:border-primary hover:text-primary"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-1 w-full sm:w-auto border border-gray-200">
                      <button
                        onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                        className="h-11 w-11 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="font-body px-6 text-xl font-bold text-gray-900">
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
                        handleAddToCart(e, selectedProduct, modalQuantity, selectedSabor, selectedPresentacion);
                        setSelectedProduct(null);
                      }}
                      className="bg-primary text-white flex-1 w-full h-14 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <ShoppingCart size={22} />
                      Agregar al Carrito
                    </button>
                  </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Catalogo;
