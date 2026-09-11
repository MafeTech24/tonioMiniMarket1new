# Prompt para Antigravity — propietarios y empleado limitado

## Contexto y rol

Actuá como desarrollador senior de React, Vite, TypeScript y Supabase. El backend de Toniominimarket ya tiene una tabla `admin_users` con los roles `propietario` y `empleado`, además de políticas RLS. No modifiques la seguridad de Supabase ni crees usuarios o contraseñas desde React.

El funcionamiento habitual utiliza solamente dos propietarios: Marianella y Facundo. El rol `empleado` es una contingencia futura y no implica que deba existir una tercera cuenta durante la puesta en marcha.

## Tarea

Adaptá exclusivamente el panel administrativo para mostrar las funciones permitidas según el perfil autenticado.

## Especificaciones

1. Después de validar la sesión, consultar en `admin_users` el registro cuyo `user_id` coincida con el usuario autenticado.
2. Usar este tipo:

```ts
type AdminProfile = {
  user_id: string;
  email: string | null;
  nombre: string | null;
  rol: "propietario" | "empleado";
};
```

3. Para `propietario`:
   - mostrar Productos, Ofertas y Pedidos;
   - permitir las operaciones existentes del panel.
4. Para `empleado`:
   - mostrar únicamente Pedidos;
   - permitir consultar los pedidos, contactar al cliente y cambiar el estado;
   - no renderizar ni enlazar Productos, Ofertas, imágenes o gestión de usuarios;
   - no ofrecer eliminación de pedidos ni edición de importes o datos personales.
5. Mostrar en el encabezado el nombre o correo y la etiqueta `Propietario` o `Empleado`.
6. Mientras se consulta el perfil, mostrar `Cargando panel…` y no renderizar anticipadamente secciones protegidas.
7. Si el perfil no existe o falla la consulta, bloquear el panel y ofrecer cerrar sesión.
8. No confiar solamente en ocultar botones: conservar las llamadas normales a Supabase para que RLS sea la autoridad final.
9. No incluir claves privadas, `service_role`, contraseñas ni creación de usuarios en el frontend.

## Criterios de calidad

- Marianella y Facundo, con rol `propietario`, ven el panel completo.
- El empleado sólo ve Pedidos.
- Cambiar manualmente la URL o manipular React no habilita acciones bloqueadas por RLS.
- TypeScript, pruebas, lint y compilación de producción finalizan sin errores.
- No modificar catálogo público, carrito, checkout, comprobante, estilos generales ni cálculo de delivery.

## Respuesta esperada

Informá los archivos modificados, qué ve cada rol, cómo se manejan carga y errores, y los resultados de las verificaciones técnicas.
