import { useState, useEffect } from "react";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";



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
}

const CATEGORIAS = [
  "Todos",
  "Almacén",
  "Bebidas",
  "Congelados",
  "Kiosco",
  "Panificación",
  "Pollería",
  // "Comidas listas",
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
    precio: 1700,
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
    precio: 3400,
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
    nombre: "Galletas Criollitas Bagley x3 300g",
    precio: 2100,
    imagen: "/products/desayuno/galletasCriollitasx3.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas de agua Criollitas Bagley, pack familiar x3 paquetes, 300g total. Clásicas y versátiles.",
    stock: 20
  },
  {
    id: 18,
    nombre: "Galletas Mediatarde Lia x3",
    precio: 1700,
    imagen: "/products/desayuno/galletasMediatardex3.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas crackers Mediatarde Lia, pack x3 paquetes de 100g. Clásicas para acompañar infusiones.",
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
    nombre: "Galletas Traviata Bagley x3 183g",
    precio: 2100,
    imagen: "/products/desayuno/galletasTraviatax3.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas de agua Traviata Bagley sabor original, pack familiar x3, 183g total.",
    stock: 20
  },
  {
    id: 21,
    nombre: "Oreo Original 117g",
    precio: 2100,
    imagen: "/products/desayuno/galletitasOreo118.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Galletitas Oreo originales, 117g. Rellenas de crema de vainilla, la galletita favorita de la leche.",
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
    precio: 3100,
    imagen: "/products/desayuno/surtidoDiversion.png",
    categoria: "Almacén",
    subcategoria: "Desayuno",
    descripcion: "Bolsa surtido Diversión Arcor con variedad de galletitas dulces y rellenas, 400g.",
    stock: 20
  },
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
    nombre: "Mayonesa Natura 125cm³",
    precio: 800,
    imagen: "/products/aderezos/mayonesaNatura125.png",
    categoria: "Almacén",
    subcategoria: "Aderezos",
    descripcion: "Mayonesa Natura con jugo de limón, 125cm³. Reducida en valor lipídico, sin TACC.",
    stock: 20
  },
  {
    id: 44,
    nombre: "Mayonesa Natura 250cm³",
    precio: 2200,
    imagen: "/products/aderezos/mayonesaNatura250.png",
    categoria: "Almacén",
    subcategoria: "Aderezos",
    descripcion: "Mayonesa Natura con jugo de limón, 250cm³. Reducida en valor lipídico, sin TACC.",
    stock: 20
  },
  {
    id: 45,
    nombre: "Mayonesa Natura 500cm³",
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
    nombre: "Leche Fresca La Serenísima Clásica 1L",
    precio: 2100,
    imagen: "/products/lacteos/lecheSachet1L.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Leche fresca clásica La Serenísima en sachet de 1 litro. Con 9 nutrientes esenciales.",
    stock: 20
  },
  {
    id: 56,
    nombre: "Manteca La Serenísima Clásica 200g",
    precio: 4500,
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
    precio: 1800,
    imagen: "/products/lacteos/lecheArmoniaSachet.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Leche Armonía en sachet de 1 litro.",
    stock: 20
  },
  {
    id: 301,
    nombre: "Leche La Serenísima Descremada 1L",
    precio: 2100,
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
    precio: 3100,
    imagen: "/products/lacteos/quesoUntableClasicoLaPaulina.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Queso untable clásico La Paulina, entero.",
    stock: 20
  },
  {
    id: 308,
    nombre: "Queso Untable Port Salud La Paulina",
    precio: 3100,
    imagen: "/products/lacteos/quesoUntablePortSaludLaPaulina.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Queso untable Port Salud La Paulina.",
    stock: 20
  },
  {
    id: 309,
    nombre: "Queso Untable Port Salud Equilibrio La Paulina",
    precio: 3100,
    imagen: "/products/lacteos/quesoUntablePortSaludEquilibrioLaPaulina.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Queso untable Port Salud Equilibrio La Paulina, descremado.",
    stock: 20
  },
  {
    id: 310,
    nombre: "Queso Untable 4 Quesos La Paulina",
    precio: 2100,
    imagen: "/products/lacteos/quesoUntable4quesosLaPaulina.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Queso untable sabor 4 quesos La Paulina.",
    stock: 20
  },
  {
    id: 311,
    nombre: "Queso Untable Azul La Paulina",
    precio: 2100,
    imagen: "/products/lacteos/quesoUntableAzulLaPaulina.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Queso untable sabor queso azul La Paulina.",
    stock: 20
  },
  {
    id: 312,
    nombre: "Queso Untable Cheddar La Paulina",
    precio: 2100,
    imagen: "/products/lacteos/quesoUntableCheddarLaPaulina.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Queso untable sabor cheddar La Paulina.",
    stock: 20
  },
  {
    id: 313,
    nombre: "Queso Untable Fontina La Paulina",
    precio: 2100,
    imagen: "/products/lacteos/quesoUntableFontinaLaPaulina.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Queso untable sabor fontina La Paulina.",
    stock: 20
  },
  {
    id: 314,
    nombre: "Queso Untable Jamón La Paulina",
    precio: 2100,
    imagen: "/products/lacteos/quesoUntableJamonLaPaulina.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Queso untable sabor jamón La Paulina.",
    stock: 20
  },
  {
    id: 315,
    nombre: "Queso Crema Tradicional La Paulina",
    precio: 3100,
    imagen: "/products/lacteos/quesoCremaTradicionalLaPaulina.png",
    categoria: "Almacén",
    subcategoria: "Lácteos",
    descripcion: "Queso crema tradicional La Paulina.",
    stock: 20
  },
  {
    id: 316,
    nombre: "Queso Crema Light La Paulina",
    precio: 3100,
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
    precio: 1300,
    imagen: "/products/bebidas/aguaMineralConGasSoda1500.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Agua mineral con gas Bon Aqua, 1.5 litros. Refrescante y burbujeante.",
    stock: 20
  },
  {
    id: 87,
    nombre: "Agua Mineral sin Gas Villavicencio 1.5L",
    precio: 1300,
    imagen: "/products/bebidas/aguaMineralSinGasVillavicencio1500.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Agua mineral sin gas Villavicencio, 1.5 litros. Origen Mendoza, pureza natural.",
    stock: 20
  },
  {
    id: 88,
    nombre: "Amargo Serrano Terma 1.25L",
    precio: 2200,
    imagen: "/products/bebidas/amargoSerranoTerma1250.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Amargo Serrano Terma, 1.25 litros. Bebida de hierbas serranas, sin alcohol.",
    stock: 20
  },
  {
    id: 89,
    nombre: "Gatorade Naranja 500ml",
    precio: 1800,
    imagen: "/products/bebidas/bebidaIsotonicaGatorade500.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Bebida isotónica Gatorade sabor naranja, 500ml. Repone electrolitos y energía.",
    stock: 20
  },
  {
    id: 90,
    nombre: "Coca-Cola 2.25L",
    precio: 2600,
    imagen: "/products/bebidas/cocaCola2250.png",
    categoria: "Bebidas",
    subcategoria: "Sin alcohol",
    descripcion: "Coca-Cola sabor original, botella 2.25 litros. La gaseosa más popular del mundo.",
    stock: 20
  },
  {
    id: 91,
    nombre: "Sprite 2.25L",
    precio: 2400,
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
    imagen: "/products/polleria/alitasPollo.png",
    descripcion: "Alitas de pollo frescas, ideales para la parrilla o al horno. Precio por kilogramo.",
    stock: 20,
    esAGranel: true
  },
  { 
    id: 95, 
    nombre: "Medio Pollo (x kg)", 
    precio: 5800, 
    categoria: "Pollería", 
    imagen: "/products/polleria/medioPollo.png",
    descripcion: "Medio pollo fresco y limpio, listo para cocinar. Precio por kilogramo.",
    stock: 20,
    esAGranel: true
  },
  { 
    id: 96, 
    nombre: "Milanesas de Pollo (x kg)", 
    precio: 6500, 
    categoria: "Pollería", 
    imagen: "/products/polleria/milaPollo.png",
    descripcion: "Milanesas de pollo elaboradas con pechuga de primera calidad. Precio por kilogramo.",
    stock: 20,
    esAGranel: true
  },
  { 
    id: 97, 
    nombre: "Pata Muslo (x kg)", 
    precio: 4800, 
    categoria: "Pollería", 
    imagen: "/products/polleria/pataMuslo.png",
    descripcion: "Cuartos traseros de pollo (pata y muslo) frescos. Precio por kilogramo.",
    stock: 20,
    esAGranel: true
  },
  { 
    id: 98, 
    nombre: "Pata de Pollo (x kg)", 
    precio: 3900, 
    categoria: "Pollería", 
    imagen: "/products/polleria/pataPollo.png",
    descripcion: "Patitas de pollo frescas, ideales para guisos o al horno. Precio por kilogramo.",
    stock: 20,
    esAGranel: true
  },
  { 
    id: 99, 
    nombre: "Pechugas de Pollo (x kg)", 
    precio: 7200, 
    categoria: "Pollería", 
    imagen: "/products/polleria/pechugasdePollo.png",
    descripcion: "Pechugas de pollo frescas, deshuesadas y sin piel. Precio por kilogramo.",
    stock: 20,
    esAGranel: true
  },
  { 
    id: 100, 
    nombre: "Pollo Entero (x kg)", 
    precio: 5200, 
    categoria: "Pollería", 
    imagen: "/products/polleria/polloEntero.png",
    descripcion: "Pollo entero fresco de granja, calidad superior. Precio por kilogramo.",
    stock: 20,
    esAGranel: true
  },
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
    precio: 1800,
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
    id: 128,
    nombre: "Detergente Magistral Limón 760ml",
    precio: 2400,
    imagen: "/products/limpiezaPerfumeria/detergenteMagistral.png",
    categoria: "Limpieza y Perfumería",
    descripcion: "Detergente lavavajillas Magistral Limón 760ml. X5 poder antigrasa, con jugo de limón natural.",
    stock: 20
  },
  {
    id: 129,
    nombre: "Detergente Cif Bioactive Lima 750ml",
    precio: 2200,
    imagen: "/products/limpiezaPerfumeria/detergenteCif1.png",
    categoria: "Limpieza y Perfumería",
    descripcion: "Detergente lavavajillas Cif Bioactive Lima 750ml. X5 poder desengrasante, nueva fórmula con fragancia a lima.",
    stock: 20
  },
  {
    id: 130,
    nombre: "Detergente Ala Ultra 500ml",
    precio: 3500,
    imagen: "/products/limpiezaPerfumeria/detergenteAla500ml.png",
    categoria: "Limpieza y Perfumería",
    descripcion: "Detergente lavavajillas Ala Ultra 500ml. Doble poder desengrasante, cuida las manos y los utensilios.",
    stock: 20
  },
  {
    id: 131,
    nombre: "Jabón Líquido Matic Granby 600ml",
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
    precio: 1600,
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
    id: 155,
    nombre: "Paty Express x4 110g",
    precio: 4400,
    imagen: "/products/congelados/patyExpressx4.png",
    categoria: "Congelados",
    descripcion: "Medallones de carne vacuna Paty Express x4 unidades, 110g cada uno. Supercongelados, listos para la plancha o parrilla.",
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
    nombre: "Chocolate Block 38g",
    precio: 2100,
    imagen: "/products/kiosco/coflerBlock38.png",
    categoria: "Kiosco",
    descripcion: "Chocolate Block 38g. Chocolate con leche clásico, suave y cremoso. El clásico argentino de siempre.",
    stock: 20
  },
  {
    id: 163,
    nombre: "Chocolate Block 110g",
    precio: 5400,
    imagen: "/products/kiosco/coflerBlock110.png",
    categoria: "Kiosco",
    descripcion: "Chocolate Block 110g. Chocolate con leche clásico en formato grande. Ideal para compartir.",
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

  const productosPorCategoria = productos.filter((p) => {
    if (selectedCat === "Todos") return true;
    if (selectedSubcat) {
      return p.categoria === selectedCat && p.subcategoria === selectedSubcat;
    }
    return p.categoria === selectedCat;
  });

  const productosFiltrados = searchTerm.trim() === ''
    ? productosPorCategoria
    : productos.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );

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
                      {formatPrice(p.precio)} {p.unidadPrecio && <span className="text-[10px] md:text-sm font-body text-gray-400">/ {p.unidadPrecio}</span>}
                    </span>
                    <button
                      onClick={(e) => handleAddToCart(e, p)}
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
                    {formatPrice(selectedProduct.precio)} {selectedProduct.unidadPrecio && <span className="text-xl md:text-2xl font-body text-gray-400 font-bold">/ {selectedProduct.unidadPrecio}</span>}
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

                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200">
                      <span className="text-gray-500 text-sm font-semibold whitespace-nowrap">O ingresá los gramos que necesitas:</span>
                      <input
                        type="number"
                        min={50}
                        step={50}
                        placeholder="ej: 350"
                        value={inputGramos}
                        onChange={(e) => {
                          setInputGramos(e.target.value);
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val > 0) setGramosSeleccionados(val);
                        }}
                        className="flex-1 bg-transparent outline-none text-gray-900 font-bold text-lg"
                      />
                      <span className="text-gray-400 font-semibold text-sm">g</span>
                    </div>

                    <div className="bg-primary/5 rounded-xl px-4 py-3 flex items-center justify-between border border-primary/20">
                      <span className="text-gray-500 text-sm font-semibold">Total estimado:</span>
                      <span className="text-primary font-black text-2xl">
                        {formatPrice(Math.round(selectedProduct.precio * gramosSeleccionados / 100))}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        const gramos = gramosSeleccionados;
                        const precioTotal = Math.round(selectedProduct.precio * gramos / 100);
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
                        handleAddToCart(e, selectedProduct, modalQuantity);
                        setSelectedProduct(null);
                      }}
                      className="bg-primary text-white flex-1 w-full h-14 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <ShoppingCart size={22} />
                      Agregar al Carrito
                    </button>
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
