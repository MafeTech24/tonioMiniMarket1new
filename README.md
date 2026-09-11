# Tonio MiniMarket

Tienda web de Tonio MiniMarket desarrollada con React, Vite, TypeScript y Supabase.

La versión consolidada incluye:

- catálogo administrable desde Supabase;
- 389 productos activos y conservación de bajas como registros inactivos;
- 17 ofertas administrables con precio, stock y vigencia;
- carrito persistente en el navegador;
- cálculo de delivery desde la ubicación confirmada de Falucho 275;
- pedidos guardados antes de abrir WhatsApp;
- comprobantes privados mediante número y token;
- autenticación para los dos propietarios y soporte opcional para un empleado limitado;
- panel de productos, ofertas y pedidos;
- carga de imágenes en Supabase Storage;
- políticas RLS para proteger modificaciones y datos personales.

## Requisitos

- Node.js 22 o superior.
- Un proyecto de Supabase.
- Dos usuarios propietarios creados en Supabase Auth.

## Instalación local

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Completar `.env.local` con:

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=TU_CLAVE_PUBLICA_ANON
VITE_MAINTENANCE_MODE=false
```

La clave privada `service_role` no se utiliza en el frontend y nunca debe agregarse al repositorio ni a variables que comiencen con `VITE_`.

## Cálculo de delivery con Google Routes

El carrito utiliza la Edge Function `calcular-envio`; la clave de Google Maps nunca se envía al navegador.

Reglas aplicadas:

- radio geográfico de hasta 2 km desde Falucho 275: envío gratis;
- fuera del radio: distancia real de ida por calles, con ida y regreso incluidos;
- auto chico: rendimiento conservador de 10 km por litro;
- combustible de referencia: $2.500 por litro;
- precio redondeado hacia arriba al siguiente múltiplo de $500;
- recorrido pago superior a 10 km: fuera de cobertura;
- sólo calle y número intervienen en la localización; piso, departamento, barrio y referencias se conservan para el repartidor.

Para habilitarlo:

1. Crear o utilizar un proyecto de Google Cloud con facturación habilitada.
2. Activar **Routes API**.
3. Crear una clave restringida exclusivamente a Routes API y establecer cuotas/alertas.
4. En Supabase, guardar la clave en **Edge Functions > Secrets** con el nombre `GOOGLE_MAPS_API_KEY`.
5. Desplegar `supabase/functions/calcular-envio`.

Con Supabase CLI, el despliegue se realiza desde la raíz del proyecto:

```bash
supabase login
supabase link --project-ref TU_REFERENCIA_DE_PROYECTO
supabase functions deploy calcular-envio
```

La clave real debe cargarse desde el panel de Supabase. No debe escribirse en `.env.local`, GitHub, Vercel ni archivos con prefijo `VITE_`.

## Preparación de Supabase

Ejecutar desde el SQL Editor y en este orden:

1. `supabase/migrations/202608290001_backend_completo.sql`
2. `supabase/seed.sql`

Después:

1. Crear en **Authentication > Users** únicamente las cuentas de Marianella y Facundo.
2. Copiar `supabase/bootstrap-propietarios.sql.example`.
3. Reemplazar los dos correos de ejemplo por los correos de las cuentas creadas.
4. Ejecutar la sentencia en SQL Editor.

Marianella y Facundo podrán ingresar en `/admin/login`. Los pedidos también abren el WhatsApp del negocio, que ambos pueden atender desde WhatsApp Web. No se deben guardar contraseñas en SQL, GitHub ni variables del frontend.

No se crea ninguna cuenta de empleado durante la puesta en marcha normal. Si en el futuro autorizan a un tercero, se crea primero su usuario en Supabase Auth y recién entonces se ejecuta `supabase/bootstrap-empleado-opcional.sql.example`.

### Permisos administrativos

| Acción | Marianella y Facundo | Empleado |
|---|---:|---:|
| Ver, crear y editar productos | Sí | No |
| Activar o desactivar ofertas | Sí | No |
| Subir o eliminar imágenes | Sí | No |
| Ver pedidos y datos de entrega | Sí | Sí |
| Cambiar el estado del pedido | Sí | Sí |
| Modificar importes o datos del pedido | Sí | No |
| Eliminar pedidos | Sí | No |
| Consultar los otros usuarios administrativos | Sí | No |

El perfil de empleado queda disponible sólo como contingencia futura. Si alguna vez se activa, su panel muestra únicamente **Pedidos**. Estas restricciones también están aplicadas en la base mediante RLS y un trigger, por lo que no dependen solamente de ocultar botones.

## Datos iniciales

- `data/productos.json`: catálogo consolidado.
- `data/ofertas.json`: ofertas consolidadas.
- `data/mapeo-imagenes-legacy.json`: correspondencia histórica con Storage.
- `supabase/seed.sql`: importación inicial idempotente.

Para regenerar `supabase/seed.sql` desde los JSON:

```bash
npm run data:generate
```

El seed desactiva los registros anteriores y reactiva los incluidos en los archivos consolidados. Debe utilizarse para la importación inicial, no como mecanismo cotidiano de actualización; luego los cambios se realizan desde el panel.

## Comandos de verificación

```bash
npm exec tsc -- --noEmit -p tsconfig.app.json
npm run lint
npm test
npm run build
```

## Despliegue

Configurar en Vercel las tres variables de `.env.example`. Para activar temporalmente el modo mantenimiento, establecer `VITE_MAINTENANCE_MODE=true` y volver a desplegar.

Antes de publicar:

1. Abrir varias imágenes históricas del catálogo. Esas rutas apuntan al bucket público `productos-imagenes` del proyecto de Storage utilizado por la versión anterior; deben continuar públicas o migrarse al proyecto definitivo.
2. Probar un pedido completo dentro y fuera del radio de entrega.
3. Comprobar que WhatsApp reciba el detalle correcto.
4. Abrir el comprobante privado desde la URL generada.
5. Ingresar al panel y verificar el cambio de estado del pedido.
6. Crear una oferta de prueba con fecha de inicio y fin, verificar que aparezca en la tienda y luego desactivarla.
7. Probar direcciones dentro del radio gratuito, fuera del radio y por encima de 10 km, comparando la ruta con Google Maps.

La migración SQL y el seed están preparados, pero deben ejecutarse en el proyecto real de Supabase antes del despliegue. No hace falta compartir ninguna clave privada para realizar esos pasos desde el SQL Editor.
