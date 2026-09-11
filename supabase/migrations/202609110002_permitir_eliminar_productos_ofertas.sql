-- Re-asegura los permisos de eliminación (DELETE) para productos y ofertas.
--
-- Estas políticas ya estaban declaradas en 202608290001_backend_completo.sql,
-- pero ese archivo usa "create table if not exists" y hay indicios de que las
-- tablas productos/ofertas ya existían antes de que corriera (igual que pasó
-- con admin_users), así que no hay garantía de que estas políticas puntuales
-- hayan quedado aplicadas en la base real. Este script las reafirma de forma
-- segura (DROP + CREATE), sin tocar ninguna otra política ni dato existente.
--
-- Sólo el rol "propietario" (is_owner()) puede eliminar — los empleados no
-- tienen acceso a Productos/Ofertas de todos modos.

BEGIN;

DROP POLICY IF EXISTS "Administrador elimina productos" ON public.productos;
CREATE POLICY "Administrador elimina productos"
ON public.productos
FOR DELETE
TO authenticated
USING (public.is_owner());

DROP POLICY IF EXISTS "Administrador elimina ofertas" ON public.ofertas;
CREATE POLICY "Administrador elimina ofertas"
ON public.ofertas
FOR DELETE
TO authenticated
USING (public.is_owner());

GRANT DELETE ON public.productos TO authenticated;
GRANT DELETE ON public.ofertas TO authenticated;

COMMIT;
