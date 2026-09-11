# Prompt para Antigravity — cálculo de delivery en el frontend

## Contexto y rol

Actuá como desarrollador senior de React, Vite, TypeScript y Supabase. Trabajá únicamente sobre el frontend de Toniominimarket. La Edge Function segura de Supabase llamada `calcular-envio` ya existe y es la única responsable de consultar Google Routes y calcular el precio. No llames Google Maps, Google Routes, Nominatim ni otro geocodificador directamente desde el navegador.

## Tarea

Reemplazá el cálculo anterior de delivery por una invocación a:

```ts
supabase.functions.invoke("calcular-envio", {
  body: { street: calleYNumero.trim() },
});
```

Conservá sin cambios el diseño general, catálogo, carrito, pedidos, comprobante, ofertas y panel administrativo.

## Especificaciones

1. Mantener dos campos independientes:
   - `Calle y número`: único texto enviado a `calcular-envio`.
   - `Piso / Depto / Barrio / Referencias`: se guarda para el repartidor, pero nunca se envía para localizar la dirección.
2. No concatenar barrio, piso, departamento ni referencias con la calle y número.
3. No incluir ninguna API key de Google en React, variables `VITE_*`, código fuente, consola o solicitudes visibles del navegador.
4. Usar este contrato de respuesta:

```ts
type DeliveryQuote = {
  available: boolean;
  free: boolean;
  cost: number | null;
  routeDistanceKm: number;
  radialDistanceKm: number;
  duration: string | null;
  error?: string;
};
```

5. Al pulsar `Calcular envío`:
   - validar que exista calle y número;
   - mostrar estado `Calculando...`;
   - limpiar cualquier cotización anterior;
   - invocar la Edge Function;
   - si `available` es `false`, impedir confirmar el delivery y mostrar `error`;
   - si `cost` es `0`, mostrar `¡Envío gratis a tu zona!`;
   - si `cost` es mayor que cero, mostrar el precio formateado en pesos argentinos y `Recorrido estimado: X km de ida. El precio incluye el regreso.`
6. Si el usuario modifica calle y número después de cotizar, invalidar inmediatamente costo y distancia y obligarlo a calcular de nuevo.
7. Piso, departamento, barrio y referencias no deben invalidar la cotización cuando cambien.
8. Incluir el precio de envío y, cuando corresponda, la distancia estimada de ida en el mensaje de WhatsApp.
9. El botón para confirmar el pedido debe permanecer deshabilitado si el delivery no tiene una cotización válida o está fuera de cobertura.
10. No calcular precios en el frontend ni reconstruir la fórmula recibida: mostrar exactamente el `cost` devuelto por la función segura.

## Reglas comerciales ya implementadas por el backend

- Hasta 2 km de radio geográfico desde Falucho 275: gratis.
- Fuera del radio: recorrido real por calles.
- Auto chico de 10 km por litro.
- Ida y vuelta incluidas.
- Nafta de referencia: $2.500 por litro.
- Redondeo hacia arriba al siguiente múltiplo de $500.
- Más de 10 km de recorrido pago: fuera de cobertura.

No dupliques ni cambies estas reglas en React.

## Criterios de calidad

- TypeScript sin errores.
- Manejo claro de carga, éxito, dirección no encontrada, función no configurada y fuera de cobertura.
- Sin claves, tokens ni credenciales privadas.
- Sin cambios visuales o funcionales ajenos al cálculo del delivery.
- Pruebas del carrito y compilación de producción aprobadas.

## Respuesta esperada

Al terminar, informá:

1. Archivos modificados.
2. Comportamiento anterior reemplazado.
3. Confirmación de que no agregaste claves al frontend.
4. Resultado de TypeScript, pruebas y compilación.
