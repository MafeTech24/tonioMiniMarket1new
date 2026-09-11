-- Sincronización transaccional del catálogo aprobado.
-- Fuentes: data/sources/Catalogo.definitivo.tsx y data/sources/Ofertas.actualizadas.tsx.
-- SHA-256 datos: d5e8a72c3c590a56f1cd6807934413363cb498b82c78dc2b850e1d4f19bb3129
-- No elimina filas ni modifica pedidos o historial.
-- Las únicas bajas aplicadas son los 7 IDs de producto confirmados.
-- Corrección legacy deliberada: los IDs 413-418 se venden c/u y no a granel.

BEGIN;

UPDATE public.productos
SET activo = false
WHERE id IN (5, 26, 27, 113, 127, 411, 412)
  AND activo IS DISTINCT FROM false;

-- Corrige el dato legacy remoto. Durante la transición, el trigger de
-- compatibilidad replica este false hacia "esAGranel".
UPDATE public.productos
SET es_a_granel = false
WHERE id IN (413, 414, 415, 416, 417, 418)
  AND es_a_granel IS DISTINCT FROM false;

INSERT INTO public.productos (
  id, nombre, precio, imagen, categoria, subcategoria, descripcion, stock,
  unidad_precio, es_a_granel, es_factura, es_empanada,
  precios_multiples, sabores, presentaciones, activo, orden
) VALUES
(
    1, 'Azúcar Ledesma Clásica 1kg', 2000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/azucarLedesma1000.png',
    'Almacén', 'Desayuno', 'Azúcar común tipo A, libre de gluten. Ideal para endulzar infusiones y preparaciones.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 1
  ),
(
    111, 'Café La Virginia Doy Pack 100g', 5100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/cafeLaVirginiaDoyPack100.png',
    'Almacén', 'Desayuno', 'Café instantáneo torrado La Virginia pack ahorro 100g, formato doy pack recargable. Sin TACC, industria argentina.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 2
  ),
(
    6, 'Café La Virginia Doy Pack 170g', 7600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/cafeLaVirginiaDoyPack170.png',
    'Almacén', 'Desayuno', 'Café instantáneo torrado La Virginia en formato doy pack recargable de 170g.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 3
  ),
(
    7, 'Café La Virginia en Saquitos x20', 5700, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/cafeLaVirginiaenSaquitos20unid.png',
    'Almacén', 'Desayuno', 'Café molido torrado La Virginia en saquitos individuales, caja x20 unidades de 5g cada uno.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 4
  ),
(
    8, 'Café La Virginia Torrado 250g', 6100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/cafeLaVirginiaTorrado250.png',
    'Almacén', 'Desayuno', 'Café molido torrado clásico La Virginia, paquete de 250g. Sabor equilibrado y tradicional.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 5
  ),
(
    106, 'Café La Virginia Torrado 500g', 11900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/cafeLaVirginiaTorrado500.png',
    'Almacén', 'Desayuno', 'Café molido torrado clásico La Virginia, paquete de 500g. Sabor equilibrado y tradicional, ideal para preparar en cafetera o filtro.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 6
  ),
(
    787, 'Café La Virginia Torrado 125g', 3800, '/products/desayuno/cafeLaVirginiaTorrado125.jpg',
    'Almacén', 'Desayuno', 'Café molido torrado clásico La Virginia, paquete de 125g. Sabor equilibrado y tradicional.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 7
  ),
(
    9, 'Chocolino La Virginia 180g', 2000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/chocolino180.png',
    'Almacén', 'Desayuno', 'Chispitas granuladas de chocolate La Virginia para agregar a la leche. Con vitamina B y zinc, 180g.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 8
  ),
(
    10, 'Copos de Maíz con Azúcar x 100g', 700, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/coposMaizConAzucar.png',
    'Almacén', 'Desayuno', 'Copos de maíz azucarados a granel. Precio por 100g.', 20,
    '100g', true, false, false,
    NULL, NULL, NULL, true, 9
  ),
(
    11, 'Copos de Maíz sin Azúcar x 100g', 700, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/coposMaizSinAzucar.png',
    'Almacén', 'Desayuno', 'Copos de maíz sin azúcar a granel. Precio por 100g.', 20,
    '100g', true, false, false,
    NULL, NULL, NULL, true, 10
  ),
(
    12, 'Dulce de Leche La Serenísima Estilo Colonial 400g', 4250, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/dLecheEstiloColonialLaSerenisima400.png',
    'Almacén', 'Desayuno', 'Dulce de leche estilo colonial La Serenísima, 400g. Sin TACC, libre de lactosa y sin gluten.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 11
  ),
(
    788, 'Dulce de Leche La Serenísima Estilo Colonial 250g', 3100, '/products/desayuno/dLecheEstiloColonialLaSerenisima250.png',
    'Almacén', 'Desayuno', 'Dulce de leche estilo colonial La Serenísima, 250g. Sin TACC, libre de gluten.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 12
  ),
(
    789, 'Dulce de Leche La Serenísima Clásico 400g', 3950, '/products/desayuno/dLecheClasicoLaSerenisima400.png',
    'Almacén', 'Desayuno', 'Dulce de leche clásico La Serenísima, 400g. El sabor tradicional argentino, sin TACC.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 13
  ),
(
    790, 'Dulce de Leche La Serenísima Clásico 250g', 2900, '/products/desayuno/dLecheClasicoLaSerenisima250.png',
    'Almacén', 'Desayuno', 'Dulce de leche clásico La Serenísima, 250g. El sabor tradicional argentino, sin TACC.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 14
  ),
(
    13, 'Edulcorante Hileret Clásico 280g', 2600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/edulcoranteHileretClasico280.png',
    'Almacén', 'Desayuno', 'Edulcorante líquido clásico Hileret en frasco de 280g. Sin calorías, apto para diabéticos.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 15
  ),
(
    14, 'Edulcorante Líquido Sweet Hileret 200ml', 3500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/EdulcoranteLiquidoSweetHileret200.png',
    'Almacén', 'Desayuno', 'Edulcorante líquido Sweet Hileret, 200ml. Sin calorías, ideal para endulzar infusiones y postres.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 16
  ),
(
    15, 'Edulcorante Si Diet 250ml', 1900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/edulcoranteSiDiet250.png',
    'Almacén', 'Desayuno', 'Edulcorante líquido Si Diet, 250ml. Sin calorías, sabor clásico para uso diario.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 17
  ),
(
    16, 'Stevia Tuy x100 sobres', 2000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/edulcoranteSteviaTuy100.png',
    'Almacén', 'Desayuno', 'Edulcorante en sobres de stevia natural Tuy, caja x100 unidades. Sin calorías, origen vegetal.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 18
  ),
(
    110, 'Edulcorante Si Diet 500ml', 3100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/edulcoranteSiDiet500.png',
    'Almacén', 'Desayuno', 'Edulcorante líquido Si Diet Clásico, 500ml. Sin calorías, sabor clásico para uso diario. Formato familiar ahorro.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 19
  ),
(
    17, 'Galletas Criollitas x3', 2100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/galletasCriollitasx3.png',
    'Almacén', 'Desayuno', 'Galletitas de agua Criollitas Bagley, pack familiar x3 paquetes, 300g total. Clásicas y versátiles.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 20
  ),
(
    18, 'Galletas Mediatarde x3', 2100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/galletasMediatardex3.png',
    'Almacén', 'Desayuno', 'Galletitas crackers Mediatarde Lia, pack x3 paquetes. Clásicas para acompañar infusiones.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 21
  ),
(
    19, 'Oreo Sin TACC', 2700, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/galletasOreoSinTacc.png',
    'Almacén', 'Desayuno', 'Galletitas Oreo certificadas Sin TACC, aptas para celíacos. Rellenas de crema de vainilla.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 22
  ),
(
    20, 'Galletas Traviatas x3', 2700, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/galletasTraviatax3.png',
    'Almacén', 'Desayuno', 'Galletitas de agua Traviata Bagley sabor original, pack familiar x3.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 23
  ),
(
    21, 'Galletas Oreos Clásicas', 2200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/galletasOreo.png',
    'Almacén', 'Desayuno', 'Galletitas Oreo clásicas rellenas de crema de vainilla.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 24
  ),
(
    24, 'Mermelada Durazno Arcor 454g', 4500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/mermeladaDuraznoArcor454.png',
    'Almacén', 'Desayuno', 'Mermelada de durazno Arcor, frasco de 454g. Elaborada con fruta seleccionada, sin TACC.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 25
  ),
(
    501, 'Mermelada Arcor light Durazno 390gr', 4900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/mermeladaDuraznoArcorLight390gr.png',
    'Almacén', 'Desayuno', 'Mermelada Arcor light sabor durazno, 390gr.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 26
  ),
(
    28, 'Té La Virginia x25 saquitos', 950, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/teLaVirginia25.png',
    'Almacén', 'Desayuno', 'Té negro La Virginia en saquitos, caja x25 unidades. Sabor suave y equilibrado, industria argentina.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 27
  ),
(
    29, 'Té La Virginia x50 saquitos', 1800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/teLaVirginia50.png',
    'Almacén', 'Desayuno', 'Té negro La Virginia en saquitos, caja x50 unidades. Formato familiar, sabor clásico.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 28
  ),
(
    107, 'Té Velez x25 saquitos', 800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/teVelez25.png',
    'Almacén', 'Desayuno', 'Té negro Velez en saquitos, caja x25 unidades. Sabor suave y tradicional, industria argentina.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 29
  ),
(
    108, 'Mate Cocido Litoral x25 saquitos', 1300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/matecocidoLitoral25.png',
    'Almacén', 'Desayuno', 'Mate cocido Litoral La Virginia en saquitos, caja x25 unidades de 3g. Yerba mate elaborada, único como la amistad.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 30
  ),
(
    109, 'Mate Cocido Litoral x50 saquitos', 2400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/matecocidoLitoral50.png',
    'Almacén', 'Desayuno', 'Mate cocido Litoral La Virginia en saquitos sin envoltura, caja x50 unidades. Yerba mate sin palo, formato ahorro.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 31
  ),
(
    32, 'Yerba Amanda 500g', 2300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/yerbaAmanda500.png',
    'Almacén', 'Desayuno', 'Yerba mate elaborada Amanda, 500g. Libre de gluten, sabor suave y parejo, industria argentina.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 32
  ),
(
    33, 'Yerba CBSé Hierbas Serranas 500g', 2100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/yerbaCBSe500.png',
    'Almacén', 'Desayuno', 'Yerba mate CBSé compuesta con hierbas serranas, 500g. Sin TACC, sabor herbal característico.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 33
  ),
(
    34, 'Yerba Playadito 1kg', 2900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/yerbaPlayadito500.png',
    'Almacén', 'Desayuno', 'Yerba mate Playadito elaborada con palo, 1kg. Origen Colonia Liebig, Corrientes. Desde 1926.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 34
  ),
(
    35, 'Yerba Rosamonte 500g', 2400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/yerbaRosamonte500.png',
    'Almacén', 'Desayuno', 'Yerba mate Rosamonte, 500g. Sabor intenso y persistente, una de las marcas más reconocidas del país.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 35
  ),
(
    36, 'Yerba Verdeflor Hierbas Serranas 500g', 2300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/yerbaVerdeFlor500.png',
    'Almacén', 'Desayuno', 'Yerba mate Verdeflor elaborada con palo and hierbas serranas, 500g. Suave, digestiva y sin acidez.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 36
  ),
(
    37, 'Nesquik Original 180g', 2300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/cacaoNesquik180.png',
    'Almacén', 'Desayuno', 'Cacao en polvo instantáneo Nestlé Nesquik, 180g. Enriquecido con vitaminas y minerales, libre de gluten.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 37
  ),
(
    39, 'Salsa Barbacoa Dánica 200g', 1800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/aderezos/barbacoaDanica250.png',
    'Almacén', 'Aderezos', 'Salsa barbacoa Dánica sabor ahumado, 200g. Ideal para carnes a la parrilla y sándwiches.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 38
  ),
(
    40, 'Ketchup Dánica 190g', 1700, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/aderezos/ketchupDanica250.png',
    'Almacén', 'Aderezos', 'Ketchup Dánica elaborado con tomates de la huerta, 190g. Sin TACC.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 39
  ),
(
    41, 'Mayonesa Dánica 250cm³', 1300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/aderezos/mayonesaDanica250.png',
    'Almacén', 'Aderezos', 'Mayonesa Dánica sabor tradicional con jugo de limón, 250cm³.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 40
  ),
(
    42, 'Mayonesa Hellmann''s Clásica', 2200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/aderezos/mayonesaHellmans.png',
    'Almacén', 'Aderezos', 'Mayonesa Hellmann''s Clásica. Sabor suave y cremoso, ideal para todo tipo de preparaciones.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 41
  ),
(
    43, 'Mayonesa Natura 125gr', 1900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/aderezos/mayonesaNatura125.png',
    'Almacén', 'Aderezos', 'Mayonesa Natura con jugo de limón, 125cm³. Reducida en valor lipídico, sin TACC.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 42
  ),
(
    44, 'Mayonesa Natura 250gr', 2200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/aderezos/mayonesaNatura250.png',
    'Almacén', 'Aderezos', 'Mayonesa Natura con jugo de limón, 250cm³. Reducida en valor lipídico, sin TACC.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 43
  ),
(
    45, 'Mayonesa Natura 500gr', 3400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/aderezos/mayonesaNatura500.png',
    'Almacén', 'Aderezos', 'Mayonesa Natura con jugo de limón, 500cm³. Formato familiar, reducida en valor lipídico.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 44
  ),
(
    46, 'Mostaza Dánica 250g', 1300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/aderezos/mostazaDanica250.png',
    'Almacén', 'Aderezos', 'Mostaza Dánica a base de semillas seleccionadas, 250g. Sabor intenso y característico.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 45
  ),
(
    47, 'Mostaza Savora Original 250g', 1800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/aderezos/mostazaSavora250.png',
    'Almacén', 'Aderezos', 'Mostaza Savora Original, 250g. Clásica mostaza argentina de sabor suave y equilibrado.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 46
  ),
(
    48, 'Salsa Golf Dánica 300g', 1800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/aderezos/salsaGolfDanica250.png',
    'Almacén', 'Aderezos', 'Salsa golf Dánica, 300g. Combinación de mayonesa y ketchup, ideal para ensaladas y mariscos.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 47
  ),
(
    502, 'Pimienta Negra Molida Alikante 25gr', 1200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/condimentos/pimientaNegraMolidaAlikante25.png',
    'Almacén', 'Condimentos', 'Pimienta negra molida Alikante, 25gr.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 48
  ),
(
    50, 'Sal Fina Celusal 500g', 1200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/condimentos/salFinaCelusal500.png',
    'Almacén', 'Condimentos', 'Sal fina de mesa Celusal, 500g. Sal natural de origen argentino para uso cotidiano.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 49
  ),
(
    51, 'Sal Gruesa Celusal 1kg', 2300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/condimentos/salGruesaCelusal1000.png',
    'Almacén', 'Condimentos', 'Sal gruesa Celusal, 1kg. Ideal para cocción de pastas y vegetales.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 50
  ),
(
    52, 'Sal Parrillera Celusal 1kg', 2300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/condimentos/salParrilleraCelusal1000.png',
    'Almacén', 'Condimentos', 'Sal entrefina Celusal para parrilla, 1kg. Especial para carnes asadas y embutidos caseros.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 51
  ),
(
    55, 'Leche La Serenísima Entera 1L', 2500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/lecheSachet1L.png',
    'Almacén', 'Lácteos', 'Leche entera La Serenísima en sachet de 1 litro. Con 9 nutrientes esenciales.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 52
  ),
(
    56, 'Manteca La Serenísima Clásica 200g', 5500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/mantecaSerenisima200.png',
    'Almacén', 'Lácteos', 'Manteca clásica La Serenísima, 200g. Sin TACC, apta para repostería y uso diario.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 53
  ),
(
    57, 'Yogur Tregar Arándano 900g', 2200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/yogurTregarLitro.png',
    'Almacén', 'Lácteos', 'Yogur entero Tregar sabor arándano, 900g. Bebible, en sachet familiar.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 54
  ),
(
    300, 'Leche Armonía Clásica 1L', 2200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/lecheArmoniaSachet.png',
    'Almacén', 'Lácteos', 'Leche Armonía en sachet de 1 litro.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 55
  ),
(
    301, 'Leche La Serenísima Descremada 1L', 2400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/lecheSachetDescremadaLS1L.png',
    'Almacén', 'Lácteos', 'Leche La Serenísima descremada en sachet de 1 litro.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 56
  ),
(
    302, 'Leche La Serenísima Zero Lactosa 1L', 3200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/lecheZeroLactosaLS.png',
    'Almacén', 'Lácteos', 'Leche La Serenísima Zero Lactosa de 1 litro.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 57
  ),
(
    303, 'Crema de Leche Tonadita', 2700, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/cremaTonadita.png',
    'Almacén', 'Lácteos', 'Crema de leche Tonadita.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 58
  ),
(
    304, 'Crema de Leche DJ', 1800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/cremaDJ.png',
    'Almacén', 'Lácteos', 'Crema de leche DJ.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 59
  ),
(
    305, 'Crema de Leche Milkaut 200g', 2900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/cremaMilkaut200.png',
    'Almacén', 'Lácteos', 'Crema de leche Milkaut de 200g.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 60
  ),
(
    306, 'Crema de Leche Milkaut 350g', 4000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/cremaMilkaut350.png',
    'Almacén', 'Lácteos', 'Crema de leche Milkaut de 350g.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 61
  ),
(
    307, 'Queso Untable Clásico La Paulina', 2500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/quesoUntableClasicoLaPaulina.png',
    'Almacén', 'Lácteos', 'Queso untable clásico La Paulina, entero.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 62
  ),
(
    308, 'Queso Untable Port Salud La Paulina', 2500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/quesoUntablePortSaludLaPaulina.png',
    'Almacén', 'Lácteos', 'Queso untable Port Salud La Paulina.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 63
  ),
(
    309, 'Queso Untable Port Salud Equilibrio La Paulina', 2500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/quesoUntablePortSaludEquilibrioLaPaulina.png',
    'Almacén', 'Lácteos', 'Queso untable Port Salud Equilibrio La Paulina, descremado.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 64
  ),
(
    310, 'Queso Untable 4 Quesos La Paulina', 2500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/quesoUntable4quesosLaPaulina.png',
    'Almacén', 'Lácteos', 'Queso untable sabor 4 quesos La Paulina.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 65
  ),
(
    311, 'Queso Untable Azul La Paulina', 2500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/quesoUntableAzulLaPaulina.png',
    'Almacén', 'Lácteos', 'Queso untable sabor queso azul La Paulina.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 66
  ),
(
    312, 'Queso Untable Cheddar La Paulina', 2500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/quesoUntableCheddarLaPaulina.png',
    'Almacén', 'Lácteos', 'Queso untable sabor cheddar La Paulina.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 67
  ),
(
    313, 'Queso Untable Fontina La Paulina', 2500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/quesoUntableFontinaLaPaulina.png',
    'Almacén', 'Lácteos', 'Queso untable sabor fontina La Paulina.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 68
  ),
(
    314, 'Queso Untable Jamón La Paulina', 2500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/quesoUntableJamonLaPaulina.png',
    'Almacén', 'Lácteos', 'Queso untable sabor jamón La Paulina.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 69
  ),
(
    315, 'Queso Crema Tradicional La Paulina', 3300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/quesoCremaTradicionalLaPaulina.png',
    'Almacén', 'Lácteos', 'Queso crema tradicional La Paulina.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 70
  ),
(
    316, 'Queso Crema Light La Paulina', 3300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/quesoCremaLightLaPaulina.png',
    'Almacén', 'Lácteos', 'Queso crema light La Paulina.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 71
  ),
(
    350, 'Manteca La Serenísima 100g', 2500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/mantecaSerenisima100.png',
    'Almacén', 'Lácteos', 'Manteca clásica La Serenísima, 100g.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 72
  ),
(
    351, 'Yogur Cremoso Tregar Dulce de Leche', 700, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/yogurtCremosoDLTregar.png',
    'Almacén', 'Lácteos', 'Yogur cremoso Tregar sabor dulce de leche.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 73
  ),
(
    352, 'Yogur Cremoso Tregar Frutilla', 700, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/yogurtCremosoFrutillaTregar.png',
    'Almacén', 'Lácteos', 'Yogur cremoso Tregar sabor frutilla.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 74
  ),
(
    353, 'Yogur Cremoso Tregar Vainilla', 700, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/yogurtCremosoVainillaTregar.png',
    'Almacén', 'Lácteos', 'Yogur cremoso Tregar sabor vainilla.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 75
  ),
(
    354, 'Yogur con Frutas Tregar Ananá', 1200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/yogurtFrutaAnanaTregar.png',
    'Almacén', 'Lácteos', 'Yogur con trozos de frutas Tregar sabor ananá.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 76
  ),
(
    355, 'Yogur con Frutas Tregar Arándano', 1200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/yogurtFrutaArandanoTregar.png',
    'Almacén', 'Lácteos', 'Yogur con trozos de frutas Tregar sabor arándano.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 77
  ),
(
    356, 'Yogur con Frutas Tregar Cereza', 1200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/yogurtFrutaCerezaTregar.png',
    'Almacén', 'Lácteos', 'Yogur con trozos de frutas Tregar sabor cereza.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 78
  ),
(
    357, 'Yogur con Frutas Tregar Durazno', 1200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/yogurtFrutaDuraznoTregar.png',
    'Almacén', 'Lácteos', 'Yogur con trozos de frutas Tregar sabor durazno.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 79
  ),
(
    358, 'Yogur con Frutas Tregar Frutilla', 1200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/yogurtFrutaFrutillaTregar.png',
    'Almacén', 'Lácteos', 'Yogur con trozos de frutas Tregar sabor frutilla.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 80
  ),
(
    359, 'Yogur con Frutas Tregar Mango', 1200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/yogurtFrutaMangoTregar.png',
    'Almacén', 'Lácteos', 'Yogur con trozos de frutas Tregar sabor mango.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 81
  ),
(
    360, 'Yogur Natural Endulzado Tregar', 1000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/yogurtNaturalEndulzadoTregar.png',
    'Almacén', 'Lácteos', 'Yogur natural endulzado Tregar, presentación chica.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 82
  ),
(
    361, 'Yogur Natural Sin Azúcar Tregar', 1000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/yogurtNaturalSinAzucarTregar.png',
    'Almacén', 'Lácteos', 'Yogur natural sin azúcar Tregar, presentación chica.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 83
  ),
(
    362, 'Yogur Natural Endulzado Tregar Grande', 1900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/yogurtNaturalEndulzadoGrandeTregar.png',
    'Almacén', 'Lácteos', 'Yogur natural endulzado Tregar, presentación grande.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 84
  ),
(
    363, 'Yogur Natural Sin Azúcar Tregar Grande', 1900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/yogurtNaturalSinAzucarGrandeTregar.png',
    'Almacén', 'Lácteos', 'Yogur natural sin azúcar Tregar, presentación grande.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 85
  ),
(
    59, 'Lucchetti Codito 500g', 1950, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/pastas/luccettiCodito.png',
    'Almacén', 'Pastas frescas y secas', 'Fideos codito Lucchetti, 500g. Enriquecidos con vitaminas y minerales NutriVit Plus.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 86
  ),
(
    60, 'Lucchetti Tallarín 500g', 1950, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/pastas/luccettiTallarin.png',
    'Almacén', 'Pastas frescas y secas', 'Fideos tallarín Lucchetti, 500g. Enriquecidos con vitaminas y minerales NutriVit Plus.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 87
  ),
(
    61, 'Lucchetti Spaghetti 500g', 1950, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/pastas/lucchettiSpaghetti.png',
    'Almacén', 'Pastas frescas y secas', 'Fideos spaghetti Lucchetti, 500g. Enriquecidos con vitaminas y minerales NutriVit Plus.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 88
  ),
(
    62, 'Lucchetti Tirabuzón Nº34 500g', 1950, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/pastas/lucchettiTirabuzon.png',
    'Almacén', 'Pastas frescas y secas', 'Fideos tirabuzón Nº34 Lucchetti, 500g. Enriquecidos con vitaminas y minerales NutriVit Plus.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 89
  ),
(
    63, 'Matarazzo Spaghetti Libre de Gluten 500g', 4100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/pastas/matarazoSpaghettiSinGluten.png',
    'Almacén', 'Pastas frescas y secas', 'Fideos spaghetti Matarazzo sin gluten, 500g. Aptos para celíacos, para toda la familia.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 90
  ),
(
    66, 'Aceite Natura 900ml', 5100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/almacen/aceiteNatura900.png',
    'Almacén', NULL, 'Aceite refinado de girasol Natura, 900ml. Refinado en frío, sin colesterol.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 91
  ),
(
    67, 'Aceite Natura 1500ml', 8200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/almacen/aceiteNatura1500.png',
    'Almacén', NULL, 'Aceite refinado de girasol Natura, 1500ml. Formato familiar, refinado en frío.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 92
  ),
(
    68, 'Arroz Dos Hermanos Largo Fino 500g', 1200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/almacen/arrozDosHnosLF500.png',
    'Almacén', NULL, 'Arroz largo fino Dos Hermanos, 500g. Sin TACC, calidad superior, industria argentina.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 93
  ),
(
    69, 'Arroz Dos Hermanos Parboil 500g', 1200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/almacen/arrozDosHnosParboil500.png',
    'Almacén', NULL, 'Arroz parboil Dos Hermanos, 500g. No se pasa, listo en 15 minutos. Sin TACC.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 94
  ),
(
    70, 'Arroz Gallo Oro Parboil 500g', 1400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/almacen/arrozGalloOroParboil500.png',
    'Almacén', NULL, 'Arroz parboil Gallo Oro, 500g. No se pasa ni se pega, con vitaminas y minerales.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 95
  ),
(
    71, 'Arroz Mandisoví Largo Fino 1kg', 1400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/almacen/arrozMandisoviLF1000.png',
    'Almacén', NULL, 'Arroz pulido Mandisoví tipo largo fino calidad 00000, 1kg. Industria argentina.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 96
  ),
(
    72, 'Arroz Mandisoví Largo Fino 500g', 800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/almacen/arrozMandisoviLg500.png',
    'Almacén', NULL, 'Arroz pulido Mandisoví tipo largo fino calidad 00000, 500g. Industria argentina.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 97
  ),
(
    73, 'Harina Pureza 0000 Ultra Refinada 1kg', 1200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/almacen/harina0000Pureza1000.png',
    'Almacén', NULL, 'Harina 0000 ultra refinada Pureza, 1kg. Para pastas, repostería y pan. Con vitamina D.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 98
  ),
(
    74, 'Harina Leudante Corona de Trigo 1kg', 1800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/almacen/harinaCoronaTrigoLeudante1000.png',
    'Almacén', NULL, 'Harina leudante Corona de Trigo, 1kg. Fortificada con hierro y vitaminas, industria argentina.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 99
  ),
(
    75, 'Harina Pureza Leudante 1kg', 1800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/almacen/harinaPurezaLeudante1000.png',
    'Almacén', NULL, 'Harina leudante ultra refinada Pureza, 1kg. Ideal para repostería casera. Con vitamina D.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 100
  ),
(
    76, 'Harina Pureza Especial Pizzas Caseras 1kg', 2300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/almacen/harinaPurezaPizzasCaseras1000.png',
    'Almacén', NULL, 'Harina Pureza especial para pizzas caseras con levadura incluida, 1kg. Lista en 10 minutos.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 101
  ),
(
    77, 'Lentejas Egran 400g', 2900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/almacen/lentejasEgran500.png',
    'Almacén', NULL, 'Lentejas Egran súper rápidas, 400g. Sin remojo previo, listas en minutos.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 102
  ),
(
    78, 'Polenta Presto Pronta 500g', 1200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/almacen/polentaPrestoPronta500.png',
    'Almacén', NULL, 'Polenta instantánea Presto Pronta, 500g. Lista en minutos, textura cremosa y consistente.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 103
  ),
(
    79, 'Puré Instantáneo Knorr 125g', 1600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/almacen/pureInstantaneoKnorr125.png',
    'Almacén', NULL, 'Puré de papas instantáneo Knorr, 125g. Rinde 4 porciones, listo en minutos.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 104
  ),
(
    164, 'Puré Instantáneo Mamá Cocina', 1700, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/almacen/pureInstantaneoMamaCocina.png',
    'Almacén', NULL, 'Puré de papas instantáneo Mamá Cocina. Rinde varias porciones, listo en minutos. Sabor casero y cremoso.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 105
  ),
(
    80, 'Puré de Tomates De La Huerta 210g', 600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/almacen/pureTomateLaHuerta210.png',
    'Almacén', NULL, 'Puré de tomates De La Huerta Baggio, 210g. Libre de gluten, sin TACC.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 106
  ),
(
    81, 'Puré de Tomates De La Huerta 530g', 1300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/almacen/pureTomateLaHuerta530.png',
    'Almacén', NULL, 'Puré de tomates De La Huerta Baggio, 530g. Libre de gluten, sin TACC. Formato familiar.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 107
  ),
(
    82, 'Sopa Crema Knorr Receta del Chef 60g', 1200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/almacen/sopaCremaKnorr60.png',
    'Almacén', NULL, 'Sopa crema Knorr Receta del Chef, 60g. Rinde 3 porciones, lista en minutos.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 108
  ),
(
    83, 'Cerveza Stella Artois', 3700, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/cervezaStellaArtois.png',
    'Bebidas', 'Con alcohol', 'Cerveza Stella Artois de origen belga. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"1L","precio":5900},{"nombre":"LATA","precio":3700}]'::jsonb, true, 109
  ),
(
    84, 'Cerveza Quilmes', 2200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/cervezaQuilmes.png',
    'Bebidas', 'Con alcohol', 'Cerveza clásica Quilmes, la cerveza argentina por excelencia. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"1L","precio":3700},{"nombre":"LATA","precio":2200}]'::jsonb, true, 110
  ),
(
    85, 'Fernet Branca 750ml', 23900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/fernetBranca750.png',
    'Bebidas', 'Con alcohol', 'Fernet Branca, 750ml. Bitter italiano de hierbas, el clásico para mezclar con Coca-Cola.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 111
  ),
(
    428, 'VINO TORO BOTELLÓN ETIQUETA AMARILLA', 3300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/vinoToroBotellonEtiqAmarilla.png',
    'Bebidas', 'Con alcohol', 'Vino Toro botellón de etiqueta amarilla, un clásico de la mesa argentina.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 112
  ),
(
    429, 'VINO VIÑAS DE BALBO TINTO', 3300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/vinoVinasBalboTinto.png',
    'Bebidas', 'Con alcohol', 'Vino tinto clásico Viñas de Balbo.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 113
  ),
(
    430, 'VINO ESTANCIA MENDOZA CABERNET SAUVIGNON', 3900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/vinoEstanciaMendozaCabernet.png',
    'Bebidas', 'Con alcohol', 'Vino Estancia Mendoza varietal Cabernet Sauvignon.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 114
  ),
(
    431, 'VINO ESTANCIA MENDOZA CHARDONNAY CHENIN', 3900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/vinoEstanciaMendozaChenin.png',
    'Bebidas', 'Con alcohol', 'Vino Estancia Mendoza varietal blanco Chardonnay Chenin.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 115
  ),
(
    432, 'VINO ESTANCIA MENDOZA MALBEC', 3900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/vinoEstanciaMendozaMalbec.png',
    'Bebidas', 'Con alcohol', 'Vino Estancia Mendoza varietal Malbec.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 116
  ),
(
    86, 'Agua Mineral con Gas Bon Aqua 1.5L', 2500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/aguaMineralConGasSoda1500.png',
    'Bebidas', 'Sin alcohol', 'Agua mineral con gas Bon Aqua, 1.5 litros. Refrescante y burbujeante.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 117
  ),
(
    87, 'Agua Mineral sin Gas Villavicencio 2L', 2400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/aguaMineralSinGasVillavicencio2000.png',
    'Bebidas', 'Sin alcohol', 'Agua mineral sin gas Villavicencio, 2 litros. Origen Mendoza, pureza natural.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 118
  ),
(
    88, 'Amargo Serrano Terma 1.25L', 2500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/amargoSerranoTerma1250.png',
    'Bebidas', 'Sin alcohol', 'Amargo Serrano Terma, 1.25 litros. Bebida de hierbas serranas, sin alcohol.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 119
  ),
(
    89, 'Bebida Energética Gatorade Naranja', 2800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/gatoradeNaranja.png',
    'Bebidas', 'Sin alcohol', 'Bebida energética / isotónica Gatorade sabor naranja. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"500 ml","precio":2800},{"nombre":"1 Litro","precio":5800}]'::jsonb, true, 120
  ),
(
    90, 'Coca-Cola', 2100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/cocaCola.png',
    'Bebidas', 'Sin alcohol', 'Coca-Cola sabor original. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"500ML","precio":2100},{"nombre":"LITRO","precio":3300},{"nombre":"1,5L","precio":4300},{"nombre":"2,25L","precio":5600}]'::jsonb, true, 121
  ),
(
    601, 'Coca-Cola Zero', 1800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/cocaColaZeroBotella.png',
    'Bebidas', 'Sin alcohol', 'Coca-Cola Zero sabor original sin azúcar. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"500ML","precio":1800},{"nombre":"LITRO","precio":3200},{"nombre":"1,5L","precio":4200},{"nombre":"2,25L","precio":5300}]'::jsonb, true, 122
  ),
(
    622, 'Sprite', 1800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/spriteBotella.png',
    'Bebidas', 'Sin alcohol', 'Gaseosa Sprite sabor lima-limón refrescante. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"500ML","precio":1800},{"nombre":"1L","precio":3200},{"nombre":"1,5L","precio":4200},{"nombre":"2,25L","precio":5300}]'::jsonb, true, 123
  ),
(
    623, 'Sprite Lata', 1600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/spriteLata.png',
    'Bebidas', 'Sin alcohol', 'Gaseosa Sprite en lata de 354ml sabor lima-limón.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"LATA 354ML","precio":1600}]'::jsonb, true, 124
  ),
(
    624, 'Sprite Zero', 1800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/spriteZeroBotella.png',
    'Bebidas', 'Sin alcohol', 'Gaseosa Sprite Zero sabor lima-limón sin azúcar. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"500ML","precio":1800},{"nombre":"1L","precio":3200},{"nombre":"1,5L","precio":4200},{"nombre":"2,25L","precio":5300}]'::jsonb, true, 125
  ),
(
    625, 'Sprite Zero Lata', 1600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/spriteLataZero.png',
    'Bebidas', 'Sin alcohol', 'Gaseosa Sprite Zero en lata de 354ml sabor lima-limón sin azúcar.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"LATA 354ML","precio":1600}]'::jsonb, true, 126
  ),
(
    626, 'Fanta', 1800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/fantaBotella.png',
    'Bebidas', 'Sin alcohol', 'Gaseosa Fanta sabor naranja. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"500ML","precio":1800},{"nombre":"1L","precio":3200},{"nombre":"1,5L","precio":4200},{"nombre":"2,25L","precio":5300}]'::jsonb, true, 127
  ),
(
    627, 'Fanta Lata', 1600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/fantaLata.png',
    'Bebidas', 'Sin alcohol', 'Gaseosa Fanta en lata de 354ml sabor naranja.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"LATA 354ML","precio":1600}]'::jsonb, true, 128
  ),
(
    628, 'Fanta Zero', 1800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/fantaZeroBotella.png',
    'Bebidas', 'Sin alcohol', 'Gaseosa Fanta Zero sabor naranja sin azúcar. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"500ML","precio":1800},{"nombre":"1,5L","precio":4200}]'::jsonb, true, 129
  ),
(
    629, 'Fanta Zero Lata', 1600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/fantaZeroLata.png',
    'Bebidas', 'Sin alcohol', 'Gaseosa Fanta Zero en lata de 354ml sabor naranja sin azúcar.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"LATA 354ML","precio":1600}]'::jsonb, true, 130
  ),
(
    630, 'Powerade Manzana', 2400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/poweradeManzana.png',
    'Bebidas', 'Sin alcohol', 'Bebida isotónica Powerade sabor manzana. Repone electrolitos y energía.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"500ML","precio":2400},{"nombre":"1L","precio":3700}]'::jsonb, true, 131
  ),
(
    631, 'Powerade Mountain Blast', 2400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/poweradeMountainBlast.png',
    'Bebidas', 'Sin alcohol', 'Bebida isotónica Powerade sabor Mountain Blast. Repone electrolitos y energía.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"500ML","precio":2400},{"nombre":"1L","precio":3700}]'::jsonb, true, 132
  ),
(
    632, 'Powerade Naranja', 2400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/poweradeNaranja.png',
    'Bebidas', 'Sin alcohol', 'Bebida isotónica Powerade sabor naranja. Repone electrolitos y energía.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"500ML","precio":2400}]'::jsonb, true, 133
  ),
(
    633, 'Powerade Frutas Tropicales', 2400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/poweradeFrutasTropicales.png',
    'Bebidas', 'Sin alcohol', 'Bebida isotónica Powerade sabor frutas tropicales. Repone electrolitos y energía.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"500ML","precio":2400}]'::jsonb, true, 134
  ),
(
    634, 'Monster Energy Green Lata 473cc', 3100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/monsterClasico.png',
    'Bebidas', 'Sin alcohol', 'Bebida energizante Monster Energy original, lata de 473cc.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 135
  ),
(
    635, 'Monster Energy Green Zero Lata 473cc', 3100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/monsterZero.png',
    'Bebidas', 'Sin alcohol', 'Bebida energizante Monster Energy original sin azúcar, lata de 473cc.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 136
  ),
(
    636, 'Monster Energy Ultra Sin Azúcar Lata 473cc', 3100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/monsterBlanco.png',
    'Bebidas', 'Sin alcohol', 'Bebida energizante Monster Energy Ultra sin azúcar, lata de 473cc.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 137
  ),
(
    637, 'Monster Energy Ultra Mango Loco Lata 473cc', 3100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/monsterMango.png',
    'Bebidas', 'Sin alcohol', 'Bebida energizante Monster Energy Ultra Mango Loco, lata de 473cc.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 138
  ),
(
    638, 'Energizante Speed Lata', 1900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/speed.png',
    'Bebidas', 'Sin alcohol', 'Bebida energizante Speed Unlimited en lata. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"269 CC","precio":1900},{"nombre":"473 CC","precio":2500}]'::jsonb, true, 139
  ),
(
    639, 'Cerveza Brahma', 2400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/cervezaBrahma.png',
    'Bebidas', 'Con alcohol', 'Cerveza Brahma pilsen, suave y refrescante. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"1L","precio":3900},{"nombre":"LATA","precio":2400}]'::jsonb, true, 140
  ),
(
    640, 'Cerveza Budweiser', 2400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/cervezaBudweiser.png',
    'Bebidas', 'Con alcohol', 'Cerveza Budweiser, refrescante y con carácter. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"1L","precio":3900},{"nombre":"LATA","precio":2400}]'::jsonb, true, 141
  ),
(
    641, 'Cerveza Imperial Golden', 2600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/cervezaGoldenImperial.png',
    'Bebidas', 'Con alcohol', 'Cerveza Imperial Golden, aroma frutado y cuerpo liviano. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"1L","precio":4600},{"nombre":"LATA","precio":2600}]'::jsonb, true, 142
  ),
(
    642, 'Cerveza Heineken', 3800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/cervezaHeineken.png',
    'Bebidas', 'Con alcohol', 'Cerveza premium Heineken de origen holandés. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"1L","precio":6000},{"nombre":"LATA","precio":3800}]'::jsonb, true, 143
  ),
(
    602, 'Ades Durazno', 1300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/adesDurazno.png',
    'Bebidas', 'Sin alcohol', 'Alimento líquido a base de soja sabor durazno. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"200ML","precio":1300},{"nombre":"LITRO","precio":3500}]'::jsonb, true, 144
  ),
(
    603, 'Ades Manzana', 1300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/adesManzan.png',
    'Bebidas', 'Sin alcohol', 'Alimento líquido a base de soja sabor manzana. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"200ML","precio":1300},{"nombre":"LITRO","precio":3500}]'::jsonb, true, 145
  ),
(
    604, 'Ades Tropical', 1300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/adesMultifruta.png',
    'Bebidas', 'Sin alcohol', 'Alimento líquido a base de soja sabor tropical/multifruta. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"200ML","precio":1300},{"nombre":"LITRO","precio":3500}]'::jsonb, true, 146
  ),
(
    605, 'Pepsi', 1800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/pepsiBotella.png',
    'Bebidas', 'Sin alcohol', 'Pepsi sabor original refrescante. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"500ML","precio":1800},{"nombre":"2 LITROS","precio":3800}]'::jsonb, true, 147
  ),
(
    606, 'Pepsi Lata', 1500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/pepsiLata.png',
    'Bebidas', 'Sin alcohol', 'Pepsi en lata de 354ml sabor original.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"LATA 354","precio":1500}]'::jsonb, true, 148
  ),
(
    607, '7Up', 1800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/7upBotella.png',
    'Bebidas', 'Sin alcohol', '7Up refrescante sabor lima-limón. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"500ML","precio":1800},{"nombre":"2 LITROS","precio":3800}]'::jsonb, true, 149
  ),
(
    608, '7Up Lata', 1500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/7upLata.png',
    'Bebidas', 'Sin alcohol', '7Up en lata de 354ml sabor lima-limón.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"LATA 354","precio":1500}]'::jsonb, true, 150
  ),
(
    609, '7Up Free', 1800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/7upBotellaFree.png',
    'Bebidas', 'Sin alcohol', '7Up Free libre de azúcares. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"500ML","precio":1800},{"nombre":"2 LITROS","precio":3800}]'::jsonb, true, 151
  ),
(
    610, '7Up Lata Free', 1500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/7upLataFree.png',
    'Bebidas', 'Sin alcohol', '7Up Free en lata de 354ml libre de azúcares.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"LATA 354","precio":1500}]'::jsonb, true, 152
  ),
(
    611, 'Pepsi Black', 1800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/pepsiBotellaBlack.png',
    'Bebidas', 'Sin alcohol', 'Pepsi Black sabor intenso sin azúcar. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"500ML","precio":1800},{"nombre":"2 LITROS","precio":3800}]'::jsonb, true, 153
  ),
(
    612, 'Pepsi Lata Black', 1500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/pepsiLataBlack.png',
    'Bebidas', 'Sin alcohol', 'Pepsi Black en lata de 354ml sabor intenso sin azúcar.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"LATA 354","precio":1500}]'::jsonb, true, 154
  ),
(
    613, 'Vino Toro Tinto', 2300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/vinoToroTinto.png',
    'Bebidas', 'Con alcohol', 'Clásico vino Toro tinto en caja (Tetrabrik) de 1 Litro.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 155
  ),
(
    614, 'Vino Toro Blanco', 2300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/vinoToroBlanco.png',
    'Bebidas', 'Con alcohol', 'Clásico vino Toro blanco en caja (Tetrabrik) de 1 Litro.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 156
  ),
(
    615, 'Vino Viñas Riojanas Tinto', 2200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/vinasRiojanasTinto.png',
    'Bebidas', 'Con alcohol', 'Vino Viñas Riojanas tinto en caja de 1 Litro.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 157
  ),
(
    616, 'Vino Viñas Riojanas Blanco', 2200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/vinasRiojanasBlanco.png',
    'Bebidas', 'Con alcohol', 'Vino Viñas Riojanas blanco en caja de 1 Litro.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 158
  ),
(
    617, 'Vino Nativo Tinto', 2000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/vinoNativoTinto.png',
    'Bebidas', 'Con alcohol', 'Vino Nativo tinto en caja de 1 Litro.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 159
  ),
(
    618, 'Vino Nativo Blanco', 2000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/vinoNativoBlanco.png',
    'Bebidas', 'Con alcohol', 'Vino Nativo blanco en caja de 1 Litro.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 160
  ),
(
    619, 'Red Bull', 3400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/redBull.png',
    'Bebidas', 'Sin alcohol', 'Bebida energizante Red Bull, lata de 250ml.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 161
  ),
(
    620, 'Pritty', 2500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/prittyLimon.png',
    'Bebidas', 'Sin alcohol', 'Gaseosa cordobesa sabor limón original. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"1,5 L","precio":2500},{"nombre":"2,25 L","precio":2800},{"nombre":"3 L","precio":3600}]'::jsonb, true, 162
  ),
(
    621, 'Pritty Cero', 2500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/prittyLimonCero.png',
    'Bebidas', 'Sin alcohol', 'Gaseosa cordobesa sabor limón sin azúcar. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"1,5 L","precio":2500},{"nombre":"2,25 L","precio":2800},{"nombre":"3 L","precio":3600}]'::jsonb, true, 163
  ),
(
    650, 'Jugo Baggio Durazno', 700, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/baggioDurazno.png',
    'Bebidas', 'Sin alcohol', 'Delicioso jugo Baggio sabor durazno. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"200 ml","precio":700},{"nombre":"1 Litro","precio":2200}]'::jsonb, true, 164
  ),
(
    651, 'Jugo Baggio Manzana', 700, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/baggioManzana.png',
    'Bebidas', 'Sin alcohol', 'Delicioso jugo Baggio sabor manzana. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"200 ml","precio":700},{"nombre":"1 Litro","precio":2200}]'::jsonb, true, 165
  ),
(
    652, 'Jugo Baggio Naranja', 700, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/baggioNaranja.png',
    'Bebidas', 'Sin alcohol', 'Delicioso jugo Baggio sabor naranja. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"200 ml","precio":700},{"nombre":"1 Litro","precio":2200}]'::jsonb, true, 166
  ),
(
    653, 'Jugo Baggio Multifruta', 700, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/baggioMultifruta.png',
    'Bebidas', 'Sin alcohol', 'Delicioso jugo Baggio sabor multifruta. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"200 ml","precio":700},{"nombre":"1 Litro","precio":2200}]'::jsonb, true, 167
  ),
(
    654, 'Jugo Citric Naranja 1 Litro', 4200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/citricNaranja.png',
    'Bebidas', 'Sin alcohol', 'Jugo exprimido de naranja Citric, 100% natural, sin conservantes.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 168
  ),
(
    655, 'Jugo Citric Naranja-Durazno 1 Litro', 4200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/citricNaranjaDurazno.png',
    'Bebidas', 'Sin alcohol', 'Jugo exprimido de naranja y durazno Citric, 100% natural, sin conservantes.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 169
  ),
(
    656, 'Jugo Citric Naranja-Frutilla 1 Litro', 4200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/citricNaranjaFrutilla.png',
    'Bebidas', 'Sin alcohol', 'Jugo exprimido de naranja y frutilla Citric, 100% natural, sin conservantes.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 170
  ),
(
    657, 'Jugo Citric Naranja-Mango 1 Litro', 4200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/citricNaranjaMango.png',
    'Bebidas', 'Sin alcohol', 'Jugo exprimido de naranja y mango Citric, 100% natural, sin conservantes.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 171
  ),
(
    658, 'Bebida Energética Gatorade Cool Blue', 2800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/gatoradeCoolBlue.png',
    'Bebidas', 'Sin alcohol', 'Bebida energética / isotónica Gatorade sabor Cool Blue. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"500 ml","precio":2800},{"nombre":"1 Litro","precio":5800}]'::jsonb, true, 172
  ),
(
    659, 'Bebida Energética Gatorade Manzana', 2800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/gatoradeManzana.png',
    'Bebidas', 'Sin alcohol', 'Bebida energética / isotónica Gatorade sabor manzana. Seleccioná tu presentación favorita.', 20,
    NULL, false, false, false,
    NULL, NULL, '[{"nombre":"500 ml","precio":2800},{"nombre":"1 Litro","precio":5800}]'::jsonb, true, 173
  ),
(
    660, 'Cerveza Andes Roja Lata', 2700, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/cervezaAndesRoja.png',
    'Bebidas', 'Con alcohol', 'Cerveza Andes Roja en lata. Sabor equilibrado con maltas tostadas.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 174
  ),
(
    661, 'Gaseosa Paso de los Toros Pomelo 1.5L', 3500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/pasoToroPomelo.png',
    'Bebidas', 'Sin alcohol', 'Gaseosa Paso de los Toros sabor pomelo, botella de 1.5 Litros.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 175
  ),
(
    662, 'Gaseosa Paso de los Toros Tónica 1.5L', 3500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/pasoToroTonica.png',
    'Bebidas', 'Sin alcohol', 'Gaseosa tónica Paso de los Toros, botella de 1.5 Litros.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 176
  ),
(
    663, 'Aperitivo Gancia Sin Alcohol Lata 473cc', 2100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/bebidas/ganciaSinAlcohol.png',
    'Bebidas', 'Sin alcohol', 'Aperitivo Gancia sin alcohol en lata de 473cc. Refrescante, herbal y listo para disfrutar.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 177
  ),
(
    114, 'Papel Higiénico Sanidad x4', 1700, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/limpiezaPerfumeria/higienicoSanidadx4.png',
    'Limpieza y Perfumería', NULL, 'Papel higiénico Sanidad Clásico blanco, pack x4 rollos de hoja simple, 30 metros cada uno. Suave y absorbente.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 178
  ),
(
    115, 'Papel Higiénico Elegante Doble Hoja x4', 3500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/limpiezaPerfumeria/higienicoElegantex4.png',
    'Limpieza y Perfumería', NULL, 'Papel higiénico Elegante doble hoja, pack x4 rollos. Ultra suave y ultra absorbente, nueva textura.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 179
  ),
(
    116, 'Rollos de Cocina Elegante x3', 2300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/limpiezaPerfumeria/rolloCocinaElegantex3.png',
    'Limpieza y Perfumería', NULL, 'Rollos de cocina Elegante súper absorbente, pack x3 rollos de 50 metros aprox. Ideal para cocina y limpieza del hogar.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 180
  ),
(
    117, 'Rollos de Cocina Cartabella x3', 2000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/limpiezaPerfumeria/rolloCocinaCartabellax3.png',
    'Limpieza y Perfumería', NULL, 'Rollos de cocina Cartabella Daily doble hoja, pack x3 rollos, 120 paños cada uno. Nueva textura, alta absorción.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 181
  ),
(
    118, 'Jabón de Tocador Rexona 125g', 1500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/limpiezaPerfumeria/jabonTocadorRexona125.png',
    'Limpieza y Perfumería', NULL, 'Jabón de tocador Rexona Frescura Relajante, 125g. Cuida e hidrata la piel.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 182
  ),
(
    119, 'Jabón Seiseme 300g', 2800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/limpiezaPerfumeria/jabonSeiseme300.png',
    'Limpieza y Perfumería', NULL, 'Jabón en pan Seiseme para lavar ropa, 300g. 60 años de trayectoria, elaborado con materias primas naturales y degradables.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 183
  ),
(
    120, 'Lavandina Ayudín 1L', 1500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/limpiezaPerfumeria/lavandinaAyudinlitro.png',
    'Limpieza y Perfumería', NULL, 'Agua lavandina común Ayudín Original 1 litro. Elimina el 99,9% de virus y bacterias.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 184
  ),
(
    121, 'Perfumina Poett 900ml', 2100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/limpiezaPerfumeria/perfuminapoett900.png',
    'Limpieza y Perfumería', NULL, 'Perfumina para pisos Poett 900ml. Variedad de fragancias, deja aroma duradero en todos los ambientes.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 185
  ),
(
    122, 'Perfumina Procenex 900ml', 1900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/limpiezaPerfumeria/procenex900.png',
    'Limpieza y Perfumería', NULL, 'Perfumina para pisos Procenex 900ml. Variedad de fragancias frutales y florales, limpia y perfuma en un solo paso.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 186
  ),
(
    123, 'Insecticida Raid Aerosol', 7200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/limpiezaPerfumeria/raid.png',
    'Limpieza y Perfumería', NULL, 'Insecticida Raid aerosol, mata moscas, mosquitos y cucarachas. Acción rápida y efectividad comprobada.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 187
  ),
(
    124, 'Insecticida Fuyi Aerosol 400ml', 6400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/limpiezaPerfumeria/fuyi.png',
    'Limpieza y Perfumería', NULL, 'Insecticida Fuyi aerosol 400ml. Mata moscas y mosquitos, efectividad comprobada. Industria argentina.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 188
  ),
(
    125, 'Lysoform Desinfectante Aerosol 360ml', 5100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/limpiezaPerfumeria/lysoformAerosol.png',
    'Limpieza y Perfumería', NULL, 'Desinfectante Lysoform aerosol 360ml. Elimina el 99,9% de gérmenes, virus y bacterias. Listo para usar.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 189
  ),
(
    126, 'Poett Aerosol 250ml', 3900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/limpiezaPerfumeria/poettAerosol.png',
    'Limpieza y Perfumería', NULL, 'Desodorante de ambientes Poett aerosol 250ml. Variedad de fragancias florales y frescas.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 190
  ),
(
    129, 'Detergente Cif Bioactive Lima 300ml', 2700, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/limpiezaPerfumeria/detergenteCif1.png',
    'Limpieza y Perfumería', NULL, 'Detergente lavavajillas Cif Bioactive Lima 750ml. X5 poder desengrasante, nueva fórmula con fragancia a lima.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 191
  ),
(
    130, 'Detergente Ala Ultra 300ml', 2600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/limpiezaPerfumeria/detergenteAla300ml.png',
    'Limpieza y Perfumería', NULL, 'Detergente lavavajillas Ala Ultra 500ml. Doble poder desengrasante, cuida las manos y los utensilios.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 192
  ),
(
    131, 'Jabón Líquido Matic Granby 800ml', 2600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/limpiezaPerfumeria/jabonLiquidoMaticGranby800.png',
    'Limpieza y Perfumería', NULL, 'Jabón líquido para lavarropas Granby Bicarbonato 600ml. Limpieza profunda con fragancia duradera.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 193
  ),
(
    132, 'Jabón Líquido Matic Ala Eco Lavado 800ml', 3900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/limpiezaPerfumeria/jabonLiquidoMaticAla800.png',
    'Limpieza y Perfumería', NULL, 'Jabón líquido para lavarropas Ala Mustic Eco Lavado 800ml. Fórmula concentrada, cuida las fibras de la ropa.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 194
  ),
(
    133, 'Jabón Líquido Matic Gigante Bio 800ml', 3100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/limpiezaPerfumeria/jabonLiquidoMaticGiganteBio800.png',
    'Limpieza y Perfumería', NULL, 'Jabón líquido para lavarropas Gigante Bio 800ml. Con bio-enzimas activas para manchas difíciles.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 195
  ),
(
    134, 'Repelente Off Family Crema 60g', 3600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/limpiezaPerfumeria/repelenteOffCrema60.png',
    'Limpieza y Perfumería', NULL, 'Repelente en crema Off Family 60g, concentrado sin alcohol. Apto para niños desde 4 años.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 196
  ),
(
    135, 'Arvejas Inalpa', 800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/conservas/arvejasInalpa.png',
    'Almacén', 'Conservas', 'Arvejas Inalpa en lata, listas para servir. Tiernas y de primera calidad, industria argentina. Sin TACC.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 197
  ),
(
    136, 'Lentejas Inalpa', 1200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/conservas/lentejasInalpa.png',
    'Almacén', 'Conservas', 'Lentejas Inalpa en lata, listas para servir. Cocidas y condimentadas, ideales para guisos y ensaladas.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 198
  ),
(
    137, 'Choclo Blanco Cremoso Inalpa', 1000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/conservas/chocloBlancoCremoso.png',
    'Almacén', 'Conservas', 'Choclo blanco cremoso Inalpa en lata, listo para servir. Ideal para tartas, pasteles y guarniciones.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 199
  ),
(
    138, 'Choclo Amarillo Inalpa', 1800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/conservas/chocloAmarillo.png',
    'Almacén', 'Conservas', 'Choclo amarillo en granos enteros Inalpa, listo para servir. Dulce y tierno, industria argentina.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 200
  ),
(
    139, 'Jardinera Inalpa', 1200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/conservas/jardineraInalpa.png',
    'Almacén', 'Conservas', 'Jardinera Inalpa en lata, ensalada de hortalizas y legumbres lista para servir. Arvejas, zanahorias, papas y choclo.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 201
  ),
(
    140, 'Garbanzos Inalpa', 1200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/conservas/garbanzosInalpa.png',
    'Almacén', 'Conservas', 'Garbanzos Inalpa en lata, secos remojados en conserva. Listos para usar en guisos, ensaladas y hummus.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 202
  ),
(
    141, 'Atún al Natural La Campagnola 170g', 7200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/conservas/atunNaturalLomoLaCampagnola170.png',
    'Almacén', 'Conservas', 'Atún en lomo al natural La Campagnola, 170g. Libre de gluten, sin TACC. Calidad premium, listo para consumir.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 203
  ),
(
    142, 'Atún Desmenuzado Cumaná 170g', 1800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/conservas/atunDesmenuzadoCumana170.png',
    'Almacén', 'Conservas', 'Atún desmenuzado al natural Cumaná, 170g. Económico y práctico, ideal para ensaladas, sándwiches y tartas.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 204
  ),
(
    143, 'Duraznos en Almíbar Molto', 3400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/conservas/duraznosAlmibarMolto.png',
    'Almacén', 'Conservas', 'Duraznos en almíbar Molto, lata. En mitades, listos para postre o repostería.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 205
  ),
(
    144, 'Duraznos en Almíbar Agrosabor 950g', 3500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/conservas/duraznosAlmibarAgrosabor.png',
    'Almacén', 'Conservas', 'Duraznos en mitades en almíbar Agrosabor, 950g. Fruta seleccionada, ideal para postres y repostería.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 206
  ),
(
    145, 'Lucchetti Moños 500g', 2800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/pastas/luccettiMonitos.png',
    'Almacén', 'Pastas frescas y secas', 'Fideos moños Lucchetti 500g. Enriquecidos con vitaminas y minerales NutriVit Plus. Ideales con salsas cremosas.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 207
  ),
(
    146, 'Lucchetti Dedalitos 500g', 1950, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/pastas/luccettiDedalitos.png',
    'Almacén', 'Pastas frescas y secas', 'Fideos dedalitos Lucchetti 500g. Enriquecidos con vitaminas y minerales NutriVit Plus. Ideales para sopas y guisos.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 208
  ),
(
    147, 'Lucchetti Municiones 500g', 1950, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/pastas/luccettiMuniciones.png',
    'Almacén', 'Pastas frescas y secas', 'Fideos municiones Lucchetti 500g. Enriquecidos con vitaminas y minerales NutriVit Plus. Clásicos para sopas y caldos.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 209
  ),
(
    148, 'Spaghetti Verizzia 500g', 1000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/pastas/spaghettiVerizzia.png',
    'Almacén', 'Pastas frescas y secas', 'Spaghetti Verizzia 500g. Pasta seca de calidad, elaborada con sémola de trigo. Amore per la Pasta.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 210
  ),
(
    151, 'Jamón Cocido La Tirolesa', 1000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/almacen/fiambres/jamonCocidoTirolesa.png',
    'Almacén', 'Fiambres', 'Jamón cocido La Tirolesa, precio por 100g. Tierno y sabroso, ideal para sándwiches y picadas.', 20,
    '100g', true, false, false,
    NULL, NULL, NULL, true, 211
  ),
(
    152, 'Jamón Cocido Colonial', 1300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/almacen/fiambres/jamonCocidoColonial.png',
    'Almacén', 'Fiambres', 'Jamón cocido Colonial, precio por 100g. Sabor suave y textura premium, perfecto para picadas y sándwiches.', 20,
    '100g', true, false, false,
    NULL, NULL, NULL, true, 212
  ),
(
    153, 'Jamón Cocido con Cuero Ibarazzi', 1800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/almacen/fiambres/jamonCocidoconCuero.png',
    'Almacén', 'Fiambres', 'Jamón cocido natural con cuero Ibarazzi, precio por 100g. Elaboración artesanal, sabor intenso y característico.', 20,
    '100g', true, false, false,
    NULL, NULL, NULL, true, 213
  ),
(
    154, 'Salame Tipo Milán La Tirolesa', 1400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/almacen/fiambres/salameTipoMilanTirolesa.png',
    'Almacén', 'Fiambres', 'Salame tipo Milán La Tirolesa, precio por 100g. Sabor intenso y curación tradicional, ideal para picadas.', 20,
    '100g', true, false, false,
    NULL, NULL, NULL, true, 214
  ),
(
    513, 'Hamburguesas Paty Express x4', 5500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/hamburguesasPatyExpress.png',
    'Congelados', NULL, 'Hamburguesas Paty Express x4 unidades. Supercongeladas, listas para la plancha o parrilla.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 215
  ),
(
    514, 'Tarta de Pollo', 6500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/tartaPollo.png',
    'Congelados', NULL, 'Tarta de pollo artesanal supercongelada. Relleno jugoso y masa crocante, lista para hornear.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 216
  ),
(
    515, 'Tarta de Verdura', 6000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/tartaVerduras.png',
    'Congelados', NULL, 'Tarta de verduras artesanal supercongelada. Nutritiva y sabrosa, lista para hornear.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 217
  ),
(
    516, 'Tarta de Choclo Cremoso', 6000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/tartaChocloCremoso.png',
    'Congelados', NULL, 'Tarta de choclo cremoso artesanal supercongelada. Dulce y suave, lista para hornear.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 218
  ),
(
    517, 'Tarta de Jamón y Queso', 6000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/tartaJamonQueso.png',
    'Congelados', NULL, 'Tarta de jamón y queso artesanal supercongelada. Relleno generoso y masa crocante, lista para hornear.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 219
  ),
(
    518, 'Tarta de Calabaza y Muzzarella', 6000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/tartaCalabazaMuzza.png',
    'Congelados', NULL, 'Tarta de calabaza y muzzarella artesanal supercongelada. Cremosa y dulce, lista para hornear.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 220
  ),
(
    156, 'Papas Lay''s Clásicas 40g', 2300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/lays40.png',
    'Kiosco', NULL, 'Papas fritas Lay''s Clásicas 40g. Solo 3 ingredientes: papa, aceite y sal. El snack clásico de siempre.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 221
  ),
(
    157, 'Papas Lay''s Clásicas 75g', 3300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/lays75.png',
    'Kiosco', NULL, 'Papas fritas Lay''s Clásicas 75g. Solo 3 ingredientes: papa, aceite y sal. Formato familiar.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 222
  ),
(
    158, 'Cheetos 3D 40g', 2300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/3D40.png',
    'Kiosco', NULL, 'Snack de maíz Cheetos 3D 40g. Crujientes y con sabor a queso, ideales para el recreo o la merienda.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 223
  ),
(
    159, 'Cheetos 3D 75g', 3700, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/3D75.png',
    'Kiosco', NULL, 'Snack de maíz Cheetos 3D 75g. Crujientes y con sabor a queso. Formato familiar.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 224
  ),
(
    160, 'Doritos 40g', 2300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/doritos40.png',
    'Kiosco', NULL, 'Nachos Doritos 40g. Chips de maíz con intenso sabor, crujientes e irresistibles.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 225
  ),
(
    161, 'Doritos 75g', 3700, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/doritos75gr.png',
    'Kiosco', NULL, 'Nachos Doritos 75g. Chips de maíz con intenso sabor. Formato familiar.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 226
  ),
(
    162, 'Chocolate Cofler Block 38 Gr', 2400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/coflerBlock38gr.png',
    'Kiosco', NULL, 'Chocolate Cofler Block 38g. Chocolate con leche clásico, suave y cremoso. El clásico argentino de siempre.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 227
  ),
(
    163, 'Chocolate Cofler Block 110 Gr', 6000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/coflerBlock110gr.png',
    'Kiosco', NULL, 'Chocolate Cofler Block 110g. Chocolate con leche clásico en formato grande. Ideal para compartir.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 228
  ),
(
    701, 'Galletitas Mini Oreo', 1100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/galletasMiniOreo.png',
    'Kiosco', NULL, 'Mini galletitas Oreo de chocolate rellenas con crema.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 229
  ),
(
    702, 'Galletitas Mini Pepitos', 1100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/galletasMiniPepitos.png',
    'Kiosco', NULL, 'Mini galletitas dulces Pepitos con chips de chocolate.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 230
  ),
(
    703, 'Alfajor Triple Turimar Blanco', 600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/alfajorTripleTurimarBlanco.png',
    'Kiosco', NULL, 'Alfajor triple Turimar relleno de dulce de leche con baño de repostería blanco.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 231
  ),
(
    704, 'Alfajor Triple Turimar Negro', 600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/alfajorTripleTurimarNegro.png',
    'Kiosco', NULL, 'Alfajor triple Turimar relleno de dulce de leche con baño de repostería de fantasía negro.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 232
  ),
(
    705, 'Alfajor Triple Fantoche Blanco', 1300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/alfajorTripleFantocheBlanco.png',
    'Kiosco', NULL, 'Alfajor triple Fantoche relleno de dulce de leche con baño de repostería blanco.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 233
  ),
(
    706, 'Alfajor Triple Fantoche Negro', 1300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/alfajorTripleFantocheNegro.png',
    'Kiosco', NULL, 'Alfajor triple Fantoche relleno de dulce de leche con baño de repostería de chocolate negro.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 234
  ),
(
    707, 'Alfajor Triple Terrabusi', 2000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/alfajorTripleTerrabusi.png',
    'Kiosco', NULL, 'Alfajor triple Terrabusi clásico con relleno de dulce de leche y baño de repostería.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 235
  ),
(
    708, 'Alfajor Triple Milka Dulce de Leche', 2000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/alfajorTripleMilkaDLeche.png',
    'Kiosco', NULL, 'Alfajor triple Milka relleno de dulce de leche cubierto con chocolate con leche Milka.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 236
  ),
(
    709, 'Alfajor Triple Milka Mousse', 2000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/alfajorTripleMilkaMousse.png',
    'Kiosco', NULL, 'Alfajor triple Milka relleno de mousse de chocolate cubierto con chocolate con leche Milka.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 237
  ),
(
    710, 'Alfajor Triple Milka Oreo', 2000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/alfajorTripleMilkaOreo.png',
    'Kiosco', NULL, 'Alfajor triple Milka con galletitas Oreo, relleno de crema y cubierto con chocolate Milka.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 238
  ),
(
    711, 'Alfajor Triple Oreo', 2000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/alfajorTripleOreo.png',
    'Kiosco', NULL, 'Alfajor triple Oreo, relleno de crema y cubierto con baño de repostería de chocolate.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 239
  ),
(
    712, 'Alfajor Triple Pepito', 2000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/alfajorTriplePepitos.png',
    'Kiosco', NULL, 'Alfajor triple con galletitas Pepito, relleno de dulce de leche y cubierto con chocolate.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 240
  ),
(
    713, 'Alfajor Triple Bon o Bon Blanco', 2300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/alfajorTripleBobBlanco.png',
    'Kiosco', NULL, 'Alfajor triple Bon o Bon con relleno a base de pasta de maní y baño de repostería blanco.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 241
  ),
(
    714, 'Alfajor Triple Bon o Bon Negro', 2300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/alfajorTripleBobNegro.png',
    'Kiosco', NULL, 'Alfajor triple Bon o Bon con relleno a base de pasta de maní y baño de repostería de chocolate con leche.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 242
  ),
(
    715, 'Alfajor Triple Águila Clásico', 2300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/alfajorTripleAguila.png',
    'Kiosco', NULL, 'Alfajor triple Águila clásico, relleno de dulce de leche y cubierto con chocolate semi-amargo Águila.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 243
  ),
(
    716, 'Alfajor Triple Águila Blanco', 2300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/alfajorTripleAguilaBlanco.png',
    'Kiosco', NULL, 'Alfajor triple Águila blanco (mousse), con relleno de dulce de leche y cubierto con chocolate blanco Águila.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 244
  ),
(
    717, 'Alfajor Triple Águila Coco', 2300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/alfajorTripleAguilaCoco.png',
    'Kiosco', NULL, 'Alfajor triple Águila sabor coco, relleno de dulce de leche y cubierto con chocolate blanco.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 245
  ),
(
    718, 'Alfajor Triple Tofi Blanco', 2300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/alfajorTripleTofiBlanco.png',
    'Kiosco', NULL, 'Alfajor triple Tofi con relleno de dulce de leche y cubierto con baño de repostería blanco.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 246
  ),
(
    719, 'Alfajor Triple Tofi Negro', 2300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/alfajorTripleTofiNegro.png',
    'Kiosco', NULL, 'Alfajor triple Tofi con relleno de dulce de leche y cubierto con chocolate negro.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 247
  ),
(
    720, 'Alfajor Block Triple', 2300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/alfajorTripleBlock.png',
    'Kiosco', NULL, 'Alfajor triple Block con dulce de leche, trozos de maní y cubierto con chocolate con leche Block.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 248
  ),
(
    721, 'Alfajor Tatin Triple Blanco', 1450, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/alfajorTripleTatinBco.png',
    'Kiosco', NULL, 'Alfajor triple Tatin relleno de dulce de leche con baño de repostería blanco.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 249
  ),
(
    722, 'Alfajor Tatin Triple Negro', 1450, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/alfajorTripleTatinNegro.png',
    'Kiosco', NULL, 'Alfajor triple Tatin relleno de dulce de leche con baño de repostería negro.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 250
  ),
(
    723, 'Alfajor Tatin Simple Blanco', 700, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/alfajorTatinBco.png',
    'Kiosco', NULL, 'Alfajor simple Tatin relleno de dulce de leche con baño de repostería blanco.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 251
  ),
(
    724, 'Alfajor Tatin Simple Negro', 700, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/alfajorTatinNegro.png',
    'Kiosco', NULL, 'Alfajor simple Tatin relleno de dulce de leche con baño de repostería negro.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 252
  ),
(
    725, 'Alfajor Simple Bon o Bon Blanco', 1100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/alfajorBonobonBco.png',
    'Kiosco', NULL, 'Alfajor simple Bon o Bon relleno a base de pasta de maní and baño de repostería blanco.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 253
  ),
(
    726, 'Alfajor Simple Bon o Bon Negro', 1100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/alfajorBonobonNegro.png',
    'Kiosco', NULL, 'Alfajor simple Bon o Bon relleno a base de pasta de maní and baño de repostería de chocolate con leche.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 254
  ),
(
    727, 'Alfajor Simple Tofi Blanco', 1100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/alfajorTofiBco.png',
    'Kiosco', NULL, 'Alfajor simple Tofi con relleno de dulce de leche and baño de repostería blanco.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 255
  ),
(
    728, 'Alfajor Simple Tofi Negro', 1100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/alfajorTofiNegro.png',
    'Kiosco', NULL, 'Alfajor simple Tofi con relleno de dulce de leche and baño de repostería negro.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 256
  ),
(
    729, 'Galletitas Opera Chica', 900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/galletaOpera.png',
    'Kiosco', NULL, 'Galletitas Opera rellenas con crema sabor vainilla y frutilla, presentación chica.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 257
  ),
(
    750, 'Chocolate Arcor Blanco', 1600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/chocolateBlancoArcor.png',
    'Kiosco', NULL, 'Chocolate blanco Arcor, clásico sabor suave y cremoso.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 258
  ),
(
    751, 'Chocolate Arcor Negro', 1600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/chocolateNegroArcor.png',
    'Kiosco', NULL, 'Chocolate con leche Arcor, el clásico sabor tradicional.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 259
  ),
(
    752, 'Oblea Bon o Bon Blanca', 1300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/obleaBonobonBca.png',
    'Kiosco', NULL, 'Oblea crujiente rellena con pasta de maní Bon o Bon y cobertura blanca.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 260
  ),
(
    753, 'Oblea Bon o Bon Negra', 1300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/obleaBonobonNegra.png',
    'Kiosco', NULL, 'Oblea crujiente rellena con pasta de maní Bon o Bon y cobertura de chocolate con leche.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 261
  ),
(
    754, 'Bon o Bon Negro', 800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/bonobonNegro.png',
    'Kiosco', NULL, 'Bombón de chocolate con leche relleno con pasta de maní.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 262
  ),
(
    755, 'Bon o Bon Blanco', 800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/bonobonBco.png',
    'Kiosco', NULL, 'Bombón de chocolate blanco relleno con pasta de maní.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 263
  ),
(
    756, 'Bon o Bon Coco', 800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/bonobonCoco.png',
    'Kiosco', NULL, 'Bombón de chocolate blanco con relleno sabor coco y pasta de maní.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 264
  ),
(
    757, 'Bon o Bon Cookies-Cream', 800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/bonobnCookiesCream.png',
    'Kiosco', NULL, 'Bombón relleno sabor cookies & cream con galletitas de chocolate.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 265
  ),
(
    758, 'Tofi con Dulce de Leche Blanco', 2300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/chocolateTofiBco.png',
    'Kiosco', NULL, 'Chocolate Tofi blanco relleno con dulce de leche.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 266
  ),
(
    759, 'Tofi con Dulce de Leche Negro', 2300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/chocolateTofiNegro.png',
    'Kiosco', NULL, 'Chocolate Tofi negro con leche relleno con dulce de leche.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 267
  ),
(
    760, 'Mogul Dientes', 1300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/mogulDientes80gr.png',
    'Kiosco', NULL, 'Gomitas Mogul con forma de dientes y sabor a frutas, paquete de 80g.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 268
  ),
(
    761, 'Mogul Moras', 1300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/mogulMoras80gr.png',
    'Kiosco', NULL, 'Gomitas Mogul con forma de moras rojas y negras, paquete de 80g.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 269
  ),
(
    762, 'Mogul Jelly Beans', 1300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/mogulJellyBeans80gr.png',
    'Kiosco', NULL, 'Gomitas Mogul Jelly Beans con formas variadas y sabor frutal, paquete de 80g.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 270
  ),
(
    763, 'Mogul Extrem', 1300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/mogulExtreme80gr.png',
    'Kiosco', NULL, 'Gomitas Mogul Extreme ácidas con sabores frutales, paquete de 80g.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 271
  ),
(
    764, 'Mogul Ositos', 800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/mogulOsitos.png',
    'Kiosco', NULL, 'Clásicas gomitas Mogul con forma de ositos y sabores frutales.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 272
  ),
(
    765, 'Mogul Tiburoncitos', 800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/mogulTiburoncitos.png',
    'Kiosco', NULL, 'Divertidas gomitas Mogul con forma de tiburoncitos.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 273
  ),
(
    766, 'Mogul Cerebritos', 800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/mogulCerebritos.png',
    'Kiosco', NULL, 'Gomitas Mogul con forma de cerebritos y divertidos sabores frutales.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 274
  ),
(
    767, 'Mogul Rollitos', 800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/mogulRollitos.png',
    'Kiosco', NULL, 'Gomitas Mogul en rollitos azucarados sabor frutal.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 275
  ),
(
    768, 'Menthoplus Cereza', 900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/menthoplusCereza.png',
    'Kiosco', NULL, 'Pastillas Menthoplus sabor cereza fresca.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 276
  ),
(
    769, 'Menthoplus Miel', 900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/menthoplusMiel.png',
    'Kiosco', NULL, 'Pastillas Menthoplus sabor miel y mentol.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 277
  ),
(
    770, 'Menthoplus Negro', 900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/menthoplusStrong.png',
    'Kiosco', NULL, 'Pastillas Menthoplus Strong sabor mentol extra fuerte.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 278
  ),
(
    771, 'Menthoplus Sin Azúcar Cereza', 1250, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/menthoplusSinAzucarCereza.png',
    'Kiosco', NULL, 'Pastillas Menthoplus Zero sin azúcar sabor cereza.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 279
  ),
(
    772, 'Menthoplus Sin Azúcar Durazno', 1250, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/menthoplusZeroDurazno.png',
    'Kiosco', NULL, 'Pastillas Menthoplus Zero sin azúcar sabor durazno.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 280
  ),
(
    773, 'Menthoplus Sin Azúcar Mentol', 1250, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/menthoplusZeroMentol.png',
    'Kiosco', NULL, 'Pastillas Menthoplus Zero sin azúcar sabor mentol.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 281
  ),
(
    774, 'Menthoplus Sin Azúcar Negro', 1250, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/menthoplusZeroMints.png',
    'Kiosco', NULL, 'Pastillas Menthoplus Zero sin azúcar sabor mentol extra fuerte.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 282
  ),
(
    775, 'Topline Fruta', 800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/toplineFruta.png',
    'Kiosco', NULL, 'Chicles Topline sabor fruta de larga duración.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 283
  ),
(
    776, 'Topline Menta', 800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/toplineMenta.png',
    'Kiosco', NULL, 'Chicles Topline sabor menta clásica y refrescante.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 284
  ),
(
    777, 'Topline Mentol Strong', 800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/toplineStrong.png',
    'Kiosco', NULL, 'Chicles Topline sabor mentol fuerte de larga duración.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 285
  ),
(
    778, 'Topline Extreme Ácidos Ananá', 800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/toplineAcidosAnana.png',
    'Kiosco', NULL, 'Chicles Topline Extreme sabor ácido de ananá.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 286
  ),
(
    779, 'Topline 7 Cherry Violet', 1100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/topline7Cherry.png',
    'Kiosco', NULL, 'Chicles Topline Seven sabor cherry violeta intensa y refrescante.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 287
  ),
(
    780, 'Topline 7 Frutilla Vibrante', 1100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/topline7Frutilla.png',
    'Kiosco', NULL, 'Chicles Topline Seven sabor Frutilla Vibrante de larga duración.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 288
  ),
(
    781, 'Topline 7 Menta Explosiva', 1100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/topline7MentaExplosiva.png',
    'Kiosco', NULL, 'Chicles Topline Seven sabor menta explosiva.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 289
  ),
(
    782, 'Topline 7 Mentol Glacial', 1100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/topline7Mentol.png',
    'Kiosco', NULL, 'Chicles Topline Seven sabor mentol glacial intenso.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 290
  ),
(
    783, 'Turrón Arcor', 350, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/turronMani.png',
    'Kiosco', NULL, 'Turrón de maní Arcor con oblea, ideal para un snack rápido.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 291
  ),
(
    784, 'Galletas Oblita Chocolate', 600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/oblitaChocolate50gr.png',
    'Kiosco', NULL, 'Galletitas Oblita sabor chocolate, crocantes y deliciosas, presentación de 50g.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 292
  ),
(
    785, 'Galletas Oblita Vainilla', 600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/oblitaVainilla50gr.png',
    'Kiosco', NULL, 'Galletitas Oblita sabor vainilla, crocantes y deliciosas, presentación de 50g.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 293
  ),
(
    786, 'Galletas Oblita Frutilla', 600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/kiosco/oblitaFrutilla50gr.png',
    'Kiosco', NULL, 'Galletitas Oblita sabor frutilla, crocantes y deliciosas, presentación de 50g.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 294
  ),
(
    730, 'Galletitas Surtidas Bagley', 4100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/surtidoBagley.png',
    'Almacén', 'Desayuno', 'Galletitas surtidas Bagley de sabores variados, ideales para compartir en la merienda.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 295
  ),
(
    731, 'Galletitas Surtidas Diversión', 3200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/surtidoDiversion.png',
    'Almacén', 'Desayuno', 'Galletitas surtidas Diversión de sabores dulces y variados, ideales para los más chicos.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 296
  ),
(
    732, 'Galletitas Surtidas La Nonna', 2500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/surtidoLaNonna.png',
    'Almacén', 'Desayuno', 'Galletitas dulces surtidas La Nonna con sabor casero.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 297
  ),
(
    733, 'Galletitas Mana Vainilla', 1500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/galletasManaVainilla.png',
    'Almacén', 'Desayuno', 'Galletitas dulces clásicas Mana sabor vainilla.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 298
  ),
(
    734, 'Galletitas Mana Leche', 1500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/galletasManaLeche.png',
    'Almacén', 'Desayuno', 'Galletitas dulces clásicas Mana sabor leche.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 299
  ),
(
    735, 'Galletitas Mana Acarameladas', 1500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/galletasManaAcarameladas.png',
    'Almacén', 'Desayuno', 'Galletitas dulces clásicas Mana con baño acaramelado.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 300
  ),
(
    736, 'Galletitas Mana Rellenas Limón', 1900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/galletasManaRellenasLimon.png',
    'Almacén', 'Desayuno', 'Galletitas dulces Mana rellenas con crema sabor limón.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 301
  ),
(
    737, 'Galletitas Mana Rellenas Chocolate', 1900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/galletasManaRellenasChocolate.png',
    'Almacén', 'Desayuno', 'Galletitas dulces Mana rellenas con crema sabor chocolate.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 302
  ),
(
    738, 'Galletitas Mana Rellenas Vainilla', 1900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/galletasManaRellenasVainilla.png',
    'Almacén', 'Desayuno', 'Galletitas dulces Mana rellenas con crema sabor vainilla.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 303
  ),
(
    739, 'Galletitas Mana Rellenas Frutilla', 1900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/galletasManaRellenasFrutilla.png',
    'Almacén', 'Desayuno', 'Galletitas dulces Mana rellenas con crema sabor frutilla.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 304
  ),
(
    740, 'Galletitas Oreos Menta', 2200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/galletasOreoMenta.png',
    'Almacén', 'Desayuno', 'Galletitas de chocolate Oreo rellenas con crema sabor menta.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 305
  ),
(
    741, 'Galletitas Oreos Frutilla', 2200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/galletasOreoFrutilla.png',
    'Almacén', 'Desayuno', 'Galletitas de chocolate Oreo rellenas con crema sabor frutilla.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 306
  ),
(
    742, 'Galletitas Pepitos', 2200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/desayuno/galletasPepitos.png',
    'Almacén', 'Desayuno', 'Galletitas dulces clásicas Pepitos con chips de chocolate.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 307
  ),
(
    503, 'Pan Bollito', 3400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/panificacion/panBollito.png',
    'Panificación', NULL, 'Pan bollito fresco. Precio por kilogramo.', 20,
    'Kg', true, false, false,
    NULL, NULL, NULL, true, 308
  ),
(
    504, 'Pan Mignon', 3400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/panificacion/panMignon.png',
    'Panificación', NULL, 'Pan mignon fresco. Precio por kilogramo.', 20,
    'Kg', true, false, false,
    NULL, NULL, NULL, true, 309
  ),
(
    505, 'Pan Criollo Económico', 3400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/panificacion/criolloComunEconomico.png',
    'Panificación', NULL, 'Pan criollo económico fresco. Precio por kilogramo.', 20,
    'Kg', true, false, false,
    NULL, NULL, NULL, true, 310
  ),
(
    506, 'Pan Criollo Común', 5500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/panificacion/criolloComun.png',
    'Panificación', NULL, 'Pan criollo común fresco. Precio por kilogramo.', 20,
    'Kg', true, false, false,
    NULL, NULL, NULL, true, 311
  ),
(
    507, 'Pan Criollo de Hojaldre', 5500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/panificacion/criolloHojaldre.png',
    'Panificación', NULL, 'Pan criollo de hojaldre fresco. Precio por kilogramo.', 20,
    'Kg', true, false, false,
    NULL, NULL, NULL, true, 312
  ),
(
    165, 'Facturas Surtidas', 800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/panificacion/facturas.png',
    'Panificación', NULL, 'Facturas surtidas de panadería artesanales. Precio por unidad o por docena.', 100,
    'c/u', false, true, false,
    NULL, NULL, NULL, true, 313
  ),
(
    508, 'Cremonas', 2800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/panificacion/cremonas.png',
    'Panificación', NULL, 'Cremonas artesanales frescas.', 20,
    'c/u', false, false, false,
    NULL, NULL, NULL, true, 314
  ),
(
    509, 'Pan Casero', 2400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/panificacion/panCasero.png',
    'Panificación', NULL, 'Pan casero tradicional fresco.', 20,
    'c/u', false, false, false,
    NULL, NULL, NULL, true, 315
  ),
(
    510, 'Manteca Clucelat 100g', 1400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/mantecaClucelat100.png',
    'Almacén', 'Lácteos', 'Manteca Clucelat, presentación por 100g.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 316
  ),
(
    511, 'Manteca Clucelat 200g', 2800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/lacteos/mantecaClucelat200.png',
    'Almacén', 'Lácteos', 'Manteca Clucelat, presentación por 200g.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 317
  ),
(
    166, 'Filet de Merluza Finas Hierbas', 16900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/filettMerluzaFinasHierbas.png',
    'Congelados', NULL, 'Filet de merluza rebozado con finas hierbas. Tierno por dentro, crocante por fuera. Ideal al horno o frito. Precio por 1kg.', 20,
    '1kg', true, false, false,
    NULL, NULL, NULL, true, 318
  ),
(
    167, 'Filet de Merluza Rebozado', 16900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/filetMerluzaRebozado.png',
    'Congelados', NULL, 'Filet de merluza con rebozado clásico, jugoso y crocante. Listo para freír u hornear. Precio por 1kg.', 20,
    '1kg', true, false, false,
    NULL, NULL, NULL, true, 319
  ),
(
    168, 'Crocante de Merluza', 14800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/crocanteMerluza.png',
    'Congelados', NULL, 'Merluza con cobertura extra crocante, perfecta para horno o fritura. Rendidora y sabrosa. Precio por 1kg.', 20,
    '1kg', true, false, false,
    NULL, NULL, NULL, true, 320
  ),
(
    169, 'Medallón de Merluza con Espinaca', 9500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/medallonMerluzaEspinacaQueso.png',
    'Congelados', NULL, 'Medallón de merluza relleno de espinaca y queso, rebozado y supercongelado. Nutritivo y fácil de preparar. Precio por 1kg.', 20,
    '1kg', true, false, false,
    NULL, NULL, NULL, true, 321
  ),
(
    170, 'Medallón de Pollo Jamón y Queso', 10500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/medallonPolloconJamonQueso.png',
    'Congelados', NULL, 'Medallón de pollo relleno de jamón y queso, rebozado y supercongelado. Ideal para el horno o la sartén. Precio por 1kg.', 20,
    '1kg', true, false, false,
    NULL, NULL, NULL, true, 322
  ),
(
    171, 'Medallón de Pollo Espinaca y Queso', 10500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/medallonPolloEspinacaQueso.png',
    'Congelados', NULL, 'Medallón de pollo relleno de espinaca y queso, rebozado y supercongelado. Una opción nutritiva y sabrosa. Precio por 1kg.', 20,
    '1kg', true, false, false,
    NULL, NULL, NULL, true, 323
  ),
(
    172, 'Medallón Mix de Vegetales', 10500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/medallonMixVegetales.png',
    'Congelados', NULL, 'Medallón vegetal con mix de verduras, rebozado y supercongelado. Ideal para vegetarianos y toda la familia. Precio por 1kg.', 20,
    '1kg', true, false, false,
    NULL, NULL, NULL, true, 324
  ),
(
    173, 'Bocaditos de Calabaza', 9500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/bocaditosCalabazaQueso.png',
    'Congelados', NULL, 'Bocaditos de calabaza y queso, rebozados y supercongelados. Cremosos por dentro, doraditos por fuera. Precio por 1kg.', 20,
    '1kg', true, false, false,
    NULL, NULL, NULL, true, 325
  ),
(
    174, 'Mini Pechugas al Verdeo', 14500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/miniPechugasVerdeo.png',
    'Congelados', NULL, 'Mini pechugas de pollo con salsa de verdeo, rebozadas y supercongeladas. Tiernas y llenas de sabor. Precio por 1kg.', 20,
    '1kg', true, false, false,
    NULL, NULL, NULL, true, 326
  ),
(
    175, 'Rabas Rebozadas', 28000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/rabasRebozadas.png',
    'Congelados', NULL, 'Rabas de calamar rebozadas y supercongeladas. Tiernas y crocantes, ideales para freír u hornear. Precio por 1kg.', 20,
    '1kg', true, false, false,
    NULL, NULL, NULL, true, 327
  ),
(
    176, 'Aros de Cebolla Rebozados', 16500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/arosCebollaRebozadas.png',
    'Congelados', NULL, 'Aros de cebolla con rebozado crocante, supercongelados. Perfectos como entrada o guarnición. Precio por 1kg.', 20,
    '1kg', true, false, false,
    NULL, NULL, NULL, true, 328
  ),
(
    177, 'Bastones de Muzzarella', 17300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/bastonesMuzza.png',
    'Congelados', NULL, 'Bastones de muzzarella rebozados y supercongelados. Se derriten por dentro con una cobertura dorada y crocante. Precio por 1kg.', 20,
    '1kg', true, false, false,
    NULL, NULL, NULL, true, 329
  ),
(
    178, 'Mini Croquetas Jamón y Queso', 11200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/miniCroquetasJamonQueso.png',
    'Congelados', NULL, 'Mini croquetas rellenas de jamón y queso, rebozadas y supercongeladas. Irresistibles como picada o entrada. Precio por 1kg.', 20,
    '1kg', true, false, false,
    NULL, NULL, NULL, true, 330
  ),
(
    179, 'Mini Croquetas Espinaca y Queso', 11200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/miniCroquetasEspinacaQueso.png',
    'Congelados', NULL, 'Mini croquetas rellenas de espinaca y queso, rebozadas y supercongeladas. Una opción nutritiva y deliciosa. Precio por 1kg.', 20,
    '1kg', true, false, false,
    NULL, NULL, NULL, true, 331
  ),
(
    180, 'Croqueta de Papa Jamón y Queso', 10500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/croquetaPapaJamonQueso.png',
    'Congelados', NULL, 'Croqueta de papa rellena de jamón y queso, rebozada y supercongelada. Cremosa por dentro, dorada por fuera. Precio por 1kg.', 20,
    '1kg', true, false, false,
    NULL, NULL, NULL, true, 332
  ),
(
    181, 'Alitas de Pollo Rebozadas', 6900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/alitaPolloRebozada.png',
    'Congelados', NULL, 'Alitas de pollo con rebozado crocante, supercongeladas. Ideales para el horno o la freidora. Precio por 1kg.', 20,
    '1kg', true, false, false,
    NULL, NULL, NULL, true, 333
  ),
(
    182, 'Patitas de Pollo Rebozadas', 11000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/patitasRebozadas.png',
    'Congelados', NULL, 'Patitas de pollo con rebozado crocante, supercongeladas. Jugosas por dentro y doradas por fuera. Precio por 1kg.', 20,
    '1kg', true, false, false,
    NULL, NULL, NULL, true, 334
  ),
(
    183, 'Nuggets de Pollo', 13600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/nuggetsPollo.png',
    'Congelados', NULL, 'Nuggets de pechuga de pollo rebozados y supercongelados. Clásicos e irresistibles para toda la familia. Precio por 1kg.', 20,
    '1kg', true, false, false,
    NULL, NULL, NULL, true, 335
  ),
(
    184, 'Tiritas de Pollo', 13900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/tiritasDePollo.png',
    'Congelados', NULL, 'Tiritas de pechuga de pollo rebozadas y supercongeladas. Crocantes y tiernas, ideales para picar o acompañar. Precio por 1kg.', 20,
    '1kg', true, false, false,
    NULL, NULL, NULL, true, 336
  ),
(
    185, 'Papas Bastón', 7400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/papasBaston.png',
    'Congelados', NULL, 'Papas bastón supercongeladas, clásicas y rendidoras. Doradas y crocantes al horno o freidora. Precio por 1kg.', 20,
    '1kg', true, false, false,
    NULL, NULL, NULL, true, 337
  ),
(
    186, 'Papas Smile', 10900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/papasSmile.png',
    'Congelados', NULL, 'Papas smile supercongeladas con forma de carita sonriente. Las favoritas de los chicos, crocantes y esponjosas. Precio por 1kg.', 20,
    '1kg', true, false, false,
    NULL, NULL, NULL, true, 338
  ),
(
    187, 'Papas Noisette', 10900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/papaNoisette.png',
    'Congelados', NULL, 'Papas noisette supercongeladas, bolitas de papa crocantes por fuera y suaves por dentro. Ideales como guarnición. Precio por 1kg.', 20,
    '1kg', true, false, false,
    NULL, NULL, NULL, true, 339
  ),
(
    188, 'Formitas de Pollo', 10500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/formitasPollo.png',
    'Congelados', NULL, 'Formitas de pollo rebozadas y supercongeladas. Divertidas y crocantes, ideales para los más chicos. Precio por 1kg.', 20,
    '1kg', true, false, false,
    NULL, NULL, NULL, true, 340
  ),
(
    189, 'Hamburguesas de Pollo', 11400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/hamburguesasPollo.png',
    'Congelados', NULL, 'Hamburguesas de pollo supercongeladas. Jugosas y sabrosas, listas para la plancha o parrilla. Precio por 1kg.', 20,
    '1kg', true, false, false,
    NULL, NULL, NULL, true, 341
  ),
(
    190, 'Pata Muslo', 5600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/pataMuslo.png',
    'Pollería', NULL, 'Pata muslo de pollo fresco. Ideal para el horno, la parrilla o guisos. Precio por kilogramo.', 50,
    'Kg', true, false, false,
    NULL, NULL, NULL, true, 342
  ),
(
    191, 'Alitas de Pollo con rancho', 3200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/alitasPolloConRancho.png',
    'Pollería', NULL, 'Alitas de pollo con rancho  frescas, ideales para la parrilla o al horno. Precio por kilogramo.', 50,
    'Kg', true, false, false,
    NULL, NULL, NULL, true, 343
  ),
(
    192, 'Alitas de Pollo Sin Rancho', 6500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/alitasPolloSinRancho.png',
    'Pollería', NULL, 'Alitas de pollo sin rancho, limpias y listas para cocinar. Precio por kilogramo.', 50,
    'Kg', true, false, false,
    NULL, NULL, NULL, true, 344
  ),
(
    193, 'Pata Muslo Deshuesada', 12800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/pataMusloDeshuesada.png',
    'Pollería', NULL, 'Pata muslo de pollo deshuesada, sin hueso y lista para cocinar. Práctica y rendidora. Precio por kilogramo.', 50,
    'Kg', true, false, false,
    NULL, NULL, NULL, true, 345
  ),
(
    194, 'Pechugas de Pollo', 13200, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/pechugasdePollo.png',
    'Pollería', NULL, 'Pechugas de pollo frescas, deshuesadas y sin piel. La opción más magra y versátil. Precio por kilogramo.', 50,
    'Kg', true, false, false,
    NULL, NULL, NULL, true, 346
  ),
(
    195, 'Pollo Entero', 5600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/polloEntero.png',
    'Pollería', NULL, 'Pollo entero fresco de granja, calidad superior. Ideal para el horno o la parrilla. Precio por kilogramo.', 20,
    'Kg', true, false, false,
    NULL, NULL, NULL, true, 347
  ),
(
    196, 'Milanesas de Pollo con Provenzal', 11400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/milaPolloConProvenzal.png',
    'Pollería', NULL, 'Milanesas de pollo con provenzal, elaboradas con pechuga de primera calidad. Listas para freír u hornear. Precio por kilogramo.', 30,
    'Kg', true, false, false,
    NULL, NULL, NULL, true, 348
  ),
(
    197, 'Milanesas de Pollo Sin Provenzal', 11400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/milaPolloSinProvenzal.png',
    'Pollería', NULL, 'Milanesas de pollo sin provenzal, elaboradas con pechuga de primera calidad. Listas para freír u hornear. Precio por kilogramo.', 30,
    'Kg', true, false, false,
    NULL, NULL, NULL, true, 349
  ),
(
    199, 'Medio Pollo', 5800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/medioPollo.png',
    'Pollería', NULL, 'Medio pollo fresco y limpio, listo para cocinar al horno o a la parrilla. Precio por kilogramo.', 20,
    'Kg', true, false, false,
    NULL, NULL, NULL, true, 350
  ),
(
    200, 'Arrollado de Pollo', 9000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/arrolladoPollo.png',
    'Pollería', NULL, 'Arrollado de pollo artesanal. Disponible en dos variedades: jamón, queso, morrón, aceituna y huevo — o roquefort, jamón, morrón, aceituna y huevo. Consultá disponibilidad.', 10,
    'c/u', false, false, false,
    NULL, '["Jamón, Queso, Morrón, Aceituna y Huevo","Roquefort, Jamón, Morrón, Aceituna y Huevo"]'::jsonb, NULL, true, 351
  ),
(
    201, 'Milanesa de Carne', 17100, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/milasCarne.png',
    'Pollería', NULL, 'Milanesa de carne vacuna tierna y sabrosa, empanada lista para cocinar. Precio por kilogramo.', 30,
    'Kg', true, false, false,
    NULL, NULL, NULL, true, 352
  ),
(
    202, 'Milanesa de Pata Muslo', 9500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/milaPataMuslo.png',
    'Pollería', NULL, 'Milanesa elaborada con pata muslo de pollo fresca y deshuesada. Súper jugosa y tierna. Precio por kilogramo.', 30,
    'Kg', true, false, false,
    NULL, NULL, NULL, true, 353
  ),
(
    203, 'Milanesa de Merluza', 13500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/milaMerluza.png',
    'Pollería', NULL, 'Milanesa de filete de merluza rebozada, fresca y deliciosa. Precio por kilogramo.', 30,
    'Kg', true, false, false,
    NULL, NULL, NULL, true, 354
  ),
(
    204, 'Molida de Pechuga de Pollo (500g)', 6600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/molidaPechugaPollo.png',
    'Pollería', NULL, 'Carne picada/molida de pechuga de pollo, 100% magra y fresca. Presentación en bolsita de 500g.', 30,
    'Bolsa', false, false, false,
    NULL, NULL, NULL, true, 355
  ),
(
    205, 'Molida de Pata Muslo (500g)', 6400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/molidaPataMuslo.png',
    'Pollería', NULL, 'Carne picada/molida elaborada con pata muslo de pollo deshuesada, más jugosa y sabrosa. Presentación en bolsita de 500g.', 30,
    'Bolsa', false, false, false,
    NULL, NULL, NULL, true, 356
  ),
(
    400, 'Escabeche Artesanal de berenjena', 6500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/comidas%20listas/escabecheBerenjena.png',
    'Comidas listas', NULL, 'Escabeche artesanal de berenjena.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 357
  ),
(
    401, 'Escabeche Artesanal de pollo', 7500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/comidas%20listas/escabechePollo.png',
    'Comidas listas', NULL, 'Escabeche artesanal de pollo.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 358
  ),
(
    402, 'Bandeja Ensalada de Zanahoria, Remolacha y Repollo', 1600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/bandejaEnsalada1.png',
    'Pollería', NULL, 'Bandeja de ensalada fresca con zanahoria, remolacha y repollo.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 359
  ),
(
    403, 'Bandeja Ensalada de Zanahoria, Achicoria y Repollo', 1600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/bandejaEnsalada2.png',
    'Pollería', NULL, 'Bandeja de ensalada fresca con zanahoria, achicoria y repollo.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 360
  ),
(
    404, 'Bandeja Sopera', 1600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/bandejaSopera.png',
    'Pollería', NULL, 'Bandeja sopera con verduras frescas listas para sopa.', 20,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 361
  ),
(
    407, 'Hamburguesa de Carne', 13400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/hamburguesasCarne.png',
    'Congelados', NULL, 'Hamburguesa de carne congelada de primera calidad. Ideal para preparar a la plancha o a la parrilla. Precio por kilogramo.', 20,
    'Kg', true, false, false,
    NULL, NULL, NULL, true, 362
  ),
(
    408, 'Fideos La Buona Pasta Cinta Ancha', 3300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/pastas/buonaPastaCintaAncha.png',
    'Almacén', 'Pastas frescas y secas', 'Fideos secos cinta ancha de sémola. Disponibles en varios sabores.', 20,
    NULL, false, false, false,
    NULL, '["Huevo","Morrón","Espinaca"]'::jsonb, NULL, true, 363
  ),
(
    409, 'Fideos La Buona Pasta Cinta Fina', 3300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/pastas/buonaPastaCintaFina.png',
    'Almacén', 'Pastas frescas y secas', 'Fideos secos cinta fina de sémola. Disponibles en varios sabores.', 20,
    NULL, false, false, false,
    NULL, '["Huevo","Morrón","Espinaca"]'::jsonb, NULL, true, 364
  ),
(
    410, 'Fideos La Buona Pasta Cinta Intermedia', 3300, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/pastas/buonaPastaCintaIntermedia.png',
    'Almacén', 'Pastas frescas y secas', 'Fideos secos cinta intermedia de sémola. Disponibles en varios sabores.', 20,
    NULL, false, false, false,
    NULL, '["Huevo","Morrón","Espinaca"]'::jsonb, NULL, true, 365
  ),
(
    413, 'Milanesas de Soja Rellenas de Jamón y Queso', 1000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/milaSojaJamonQueso.png',
    'Congelados', NULL, 'Milanesa de soja congelada, rellena de jamón y queso. Precio por unidad.', 30,
    'c/u', false, false, false,
    NULL, NULL, NULL, true, 366
  ),
(
    414, 'Milanesas de Soja Rellenas de Roquefort', 1000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/milanesasSojaRoquefort.png',
    'Congelados', NULL, 'Milanesa de soja congelada, rellena de queso roquefort. Precio por unidad.', 30,
    'c/u', false, false, false,
    NULL, NULL, NULL, true, 367
  ),
(
    415, 'Milanesas de Soja Rellenas de Calabaza y Muzzarella', 1000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/milanesasSojaCalabazaMuzza.png',
    'Congelados', NULL, 'Milanesa de soja congelada, rellena de calabaza y muzzarella. Precio por unidad.', 30,
    'c/u', false, false, false,
    NULL, NULL, NULL, true, 368
  ),
(
    416, 'Milanesas de Soja Rellenas de Aceituna, Tomate y Muzzarella', 1000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/milanesasSojaTomateQuesoAceitunas.png',
    'Congelados', NULL, 'Milanesa de soja congelada, rellena de aceituna, tomate y muzzarella. Precio por unidad.', 30,
    'c/u', false, false, false,
    NULL, NULL, NULL, true, 369
  ),
(
    417, 'Milanesas de Soja Rellenas de Espinaca y Muzzarella', 1000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/milanesasSojaEspinacaMuzza.png',
    'Congelados', NULL, 'Milanesa de soja congelada, rellena de espinaca y muzzarella. Precio por unidad.', 30,
    'c/u', false, false, false,
    NULL, NULL, NULL, true, 370
  ),
(
    418, 'Milanesas de Soja Rellenas de Cebolla y Muzzarella', 1000, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/milanesasSojaCebollaMuzza.png',
    'Congelados', NULL, 'Milanesa de soja congelada, rellena de cebolla y muzzarella. Precio por unidad.', 30,
    'c/u', false, false, false,
    NULL, NULL, NULL, true, 371
  ),
(
    419, 'Sorrentinos de Jamón y Queso', 11500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/sorrentinosJamonQueso.png',
    'Congelados', NULL, 'Sorrentinos congelados de jamón y queso. Precio por 15 unidades.', 50,
    '15un', false, false, false,
    NULL, NULL, NULL, true, 372
  ),
(
    420, 'Sorrentinos de Jamón, Queso y Nuez', 11500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/sorrentinosJamonQuesoNuez.png',
    'Congelados', NULL, 'Sorrentinos congelados de jamón, queso y nuez. Precio por 15 unidades.', 50,
    '15un', false, false, false,
    NULL, NULL, NULL, true, 373
  ),
(
    421, 'Sorrentinos de Berenjena Ahumada', 11500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/sorrentinosBerenjenaAhumada.png',
    'Congelados', NULL, 'Sorrentinos congelados de berenjena ahumada. Precio por 15 unidades.', 50,
    '15un', false, false, false,
    NULL, NULL, NULL, true, 374
  ),
(
    422, 'Sorrentinos de Calabaza y Muzzarella', 11500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/sorrentinosCalabazaMuzzarella.png',
    'Congelados', NULL, 'Sorrentinos congelados de calabaza y muzzarella. Precio por 15 unidades.', 50,
    '15un', false, false, false,
    NULL, NULL, NULL, true, 375
  ),
(
    423, 'Sorrentinos de Pollo y Espinaca', 11500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/sorrentinosPolloEspinaca.png',
    'Congelados', NULL, 'Sorrentinos congelados de pollo y espinaca. Precio por 15 unidades.', 50,
    '15un', false, false, false,
    NULL, NULL, NULL, true, 376
  ),
(
    500, 'Sorrentinos Cuatro Quesos', 11500, '/products/congelados/sorrentinosCuatroQuesos.png',
    'Congelados', NULL, 'Sorrentinos congelados rellenos de una exquisita combinación de cuatro quesos. Precio por 15 unidades.', 50,
    '15un', false, false, false,
    NULL, NULL, NULL, true, 377
  ),
(
    424, 'Empanadas de Pollo', 1400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/comidas%20listas/empanadasPollo.png',
    'Comidas listas', NULL, 'Empanadas de pollo listas para disfrutar. Se venden por unidad, media docena o docena.', 100,
    NULL, false, false, true,
    '{"unidad":1400,"mediaDocena":8000,"docena":15000}'::jsonb, NULL, NULL, true, 378
  ),
(
    425, 'Empanadas de Carne', 1400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/comidas%20listas/empanadasCarne.png',
    'Comidas listas', NULL, 'Empanadas de carne listas para disfrutar. Se venden por unidad, media docena o docena.', 100,
    NULL, false, false, true,
    '{"unidad":1400,"mediaDocena":8000,"docena":15000}'::jsonb, NULL, NULL, true, 379
  ),
(
    426, 'Roulette de Pollo', 4900, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/roulettePollo.png',
    'Pollería', NULL, 'Roulette de pollo congelado. Disponible en diferentes sabores.', 50,
    NULL, false, false, false,
    NULL, '["Jamón, Queso y Morrón","Roquefort"]'::jsonb, NULL, true, 380
  ),
(
    427, 'Albóndigas de Pollo', 11600, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/albondigasPollo.png',
    'Congelados', NULL, 'Albóndigas de pollo congeladas, listas para cocinar. Precio por kilogramo.', 50,
    'Kg', true, false, false,
    NULL, NULL, NULL, true, 381
  ),
(
    436, 'Sandwich de miga de Jamón y Queso', 1800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/comidas%20listas/sandwichJamonQueso.png',
    'Comidas listas', NULL, 'Sándwich de miga de jamón y queso, súper frescos. Se venden por unidad, media docena o docena.', 100,
    'c/u', false, false, false,
    '{"unidad":1800,"mediaDocena":10000,"docena":20000}'::jsonb, NULL, NULL, true, 382
  ),
(
    437, 'Sandwich de miga de Verdura', 1800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/comidas%20listas/sandwichVerdura.png',
    'Comidas listas', NULL, 'Sándwich de miga sabor verdura, frescos y del día. Se venden por unidad, media docena o docena.', 100,
    'c/u', false, false, false,
    '{"unidad":1800,"mediaDocena":10000,"docena":20000}'::jsonb, NULL, NULL, true, 383
  ),
(
    438, 'Pebetón de Jamón y Queso', 1800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/comidas%20listas/pebetonJamonQueso.png',
    'Comidas listas', NULL, 'Pebetón de jamón y queso tiernos y abundantes. Se venden por unidad, media docena o docena.', 100,
    'c/u', false, false, false,
    '{"unidad":1800,"mediaDocena":10000,"docena":20000}'::jsonb, NULL, NULL, true, 384
  ),
(
    439, 'Pebetón de Salame y Queso', 1800, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/comidas%20listas/pebetonSalameQueso.png',
    'Comidas listas', NULL, 'Pebetón de salame y queso, frescos y listos para saborear. Se venden por unidad, media docena o docena.', 100,
    'c/u', false, false, false,
    '{"unidad":1800,"mediaDocena":10000,"docena":20000}'::jsonb, NULL, NULL, true, 385
  ),
(
    440, 'Empanadas árabes', 1400, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/comidas%20listas/empanadasArabes.png',
    'Comidas listas', NULL, 'Empanadas árabes con un toque de limón, deliciosas y cocidas en su punto. Se venden por unidad, media docena o docena.', 100,
    'c/u', false, false, true,
    '{"unidad":1400,"mediaDocena":8000,"docena":13000}'::jsonb, NULL, NULL, true, 386
  ),
(
    441, 'Pizza freezada Muzzarela', 6500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/pizzaMuzzarella.png',
    'Congelados', NULL, 'Pizza individual con abundante muzzarela, lista para el horno.', 50,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 387
  ),
(
    442, 'Pizza freezada Napolitana', 6500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/pizzaNapolitana.png',
    'Congelados', NULL, 'Pizza individual napolitana con muzzarela, rodajas de tomate fresco, albahaca y ajo.', 50,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 388
  ),
(
    443, 'Pizza freezada Especial', 6500, 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/pizzaEspecial.png',
    'Congelados', NULL, 'Pizza individual especial con muzzarela, jamón cocido y tiras de morrón.', 50,
    NULL, false, false, false,
    NULL, NULL, NULL, true, 389
  )
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
(
    1, 'Promo Hamburguesas Paty', 10500, 8500,
    '¡La hamburguesada perfecta en casa! Incluye: 4 Hamburguesas Paty Express + 4 Panes de hamburguesa + 1 Mayonesa Hellmann''s 125g + 1 Mostaza o Ketchup Danica 60g. Todo listo para armar las mejores hamburguesas caseras. Ideal para el fin de semana con toda la familia.', 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/promoHamburguesa5.png', NULL, 12, 'Almacén',
    true, 1
  ),
(
    2, 'Promo Tarta', 8500, 6500,
    '¡Todo para una tarta en familia! Incluye: 1 Pascualina San Vicente + 200g Jamón Cocido Tirolesa + 200g Queso Cremoso + 2 Huevos frescos. Una promo completa para preparar una tarta casera deliciosa. Ideal para el almuerzo o cena familiar.', 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/ofertaTarta.png', NULL, 10, 'Almacén',
    true, 2
  ),
(
    3, 'Oferta Pizza', 11000, 8000,
    '¡Combo ideal para tu noche de pizza! Incluye: 2 Pre pizzas + 400g Muzzarella de primera calidad + 150g Jamón Cocido Tirolesa + 100g Aceitunas seleccionadas. Todo lo que necesitás para armar dos pizzas increíbles en minutos.', 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/oferta_pizza2.png', NULL, 15, 'Almacén',
    true, 3
  ),
(
    4, 'Oferta Picada Premium', 16000, 13000,
    'La mejor selección para una picada inolvidable. Incluye: 2 Tiras de pan de Panificación Modelo + 100g Jamón Cocido Colonial + 100g Salame + 100g Mortadela Paladini + 100g Bondiola Colonial + 100g Queso La Paulina + 150g Papas Danal + 100g Maní (común o saborizado). Calidad premium para compartir.', 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/ofertaPicadaPremium3.png', NULL, 8, 'Almacén',
    true, 4
  ),
(
    5, 'Oferta Picada Económica', 11000, 9300,
    'Picada completa al mejor precio. Incluye: 2 Tiras de pan + 100g Jamón Tirolesa + 100g Mortadela Tirolesa + 100g Patita de cerdo Tirolesa + 100g Bondiola + 100g Queso Makis + 100g Papas Danal + 100g Maní. ¡No te quedes sin la tuya!', 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/ofertaPicadaEconomica2.png', NULL, 10, 'Almacén',
    true, 5
  ),
(
    6, 'Pata Muslo 2kg', 11200, 10400,
    '2kg de pata muslo de pollo fresco. Ideal para el horno, la parrilla o guisos. Precio especial por llevar 2kg.', 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/pataMuslo.png', NULL, 20, 'Pollería',
    true, 6
  ),
(
    7, 'Pata Muslo 3kg', 16800, 14700,
    '3kg de pata muslo de pollo fresco. El formato más rendidor para toda la semana. Precio especial por llevar 3kg.', 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/pataMuslo.png', NULL, 20, 'Pollería',
    true, 7
  ),
(
    8, 'Pata Muslo 4kg', 22400, 19000,
    '4kg de pata muslo de pollo fresco. El mejor precio por mayor cantidad. Ideal para familias grandes o congelar.', 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/pataMuslo.png', NULL, 20, 'Pollería',
    true, 8
  ),
(
    9, 'Alitas de Pollo con Rancho 2kg', 6400, 5800,
    '2kg de alitas de pollo con Rancho frescas. Perfectas para la parrilla o el horno. Precio especial por llevar 2kg.', 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/alitasPolloConRancho.png', NULL, 20, 'Pollería',
    true, 9
  ),
(
    10, 'Alitas de Pollo con Rancho 3kg', 9600, 7500,
    '3kg de alitas de pollo con Rancho frescas. El formato más conveniente para compartir en familia. Precio especial por llevar 3kg.', 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/alitasPolloConRancho.png', NULL, 20, 'Pollería',
    true, 10
  ),
(
    11, 'Alitas de Pollo Sin Rancho 2kg', 13000, 12000,
    '2kg de alitas de pollo sin rancho, limpias y listas para cocinar. Precio especial por llevar 2kg.', 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/alitasPolloSinRancho.png', NULL, 20, 'Pollería',
    true, 11
  ),
(
    12, 'Pata Muslo Deshuesada 2kg', 25600, 24800,
    '2kg de pata muslo deshuesada, sin hueso y lista para cocinar. Práctica y rendidora. Precio especial por llevar 2kg.', 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/pataMusloDeshuesada.png', NULL, 20, 'Pollería',
    true, 12
  ),
(
    13, 'Pechugas 3kg', 39600, 37500,
    '3kg de pechugas de pollo frescas, deshuesadas y sin piel. Precio especial por llevar 3kg. Ideal para congelar.', 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/pechugasdePollo.png', NULL, 20, 'Pollería',
    true, 13
  ),
(
    14, 'Milanesas de Pollo con Provenzal 2kg', 22800, 21000,
    '2kg de milanesas de pollo con provenzal, elaboradas con pechuga de primera calidad. Precio especial por llevar 2kg.', 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/milaPolloConProvenzal.png', NULL, 20, 'Pollería',
    true, 14
  ),
(
    15, 'Milanesas de Pollo Sin Provenzal 2kg', 22800, 21000,
    '2kg de milanesas de pollo sin provenzal, elaboradas con pechuga de primera calidad. Precio especial por llevar 2kg.', 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/milaPolloSinProvenzal.png', NULL, 20, 'Pollería',
    true, 15
  ),
(
    16, 'Hamburguesas de Carne 2kg', 26800, 26000,
    '2kg de hamburguesas de carne congeladas de primera calidad. Ideal para tener stock en casa o para tus parrilladas. Precio especial por llevar 2kg.', 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/congelados/hamburguesasCarne.png', NULL, 20, 'Congelados',
    true, 16
  ),
(
    17, 'Milanesas de Carne 2kg', 35000, 32600,
    '2kg de milanesas de carne, listas para cocinar. La opción más rendidora para toda la familia. Precio especial por llevar 2kg.', 'https://eiclwaokjudabsqvmtkf.supabase.co/storage/v1/object/public/productos-imagenes/polleria/milasCarne.png', NULL, 20, 'Pollería',
    true, 17
  )
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
    WHERE id IN (5, 26, 27, 113, 127, 411, 412) AND activo = true
  ) THEN
    RAISE EXCEPTION 'Sincronización cancelada: una baja confirmada quedó activa';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.productos
    WHERE id IN (413, 414, 415, 416, 417, 418)
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
