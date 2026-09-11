-- Vista "clientes": agrupa los pedidos por teléfono para dar de alta el panel
-- de administración "Clientes" (contacto y fidelización, sin campaña masiva).
--
-- No es una tabla nueva ni duplica datos: se arma en el momento a partir de
-- "pedidos", así que nunca se desincroniza. Se crea con security_invoker para
-- que las políticas RLS de "pedidos" (sólo is_admin()) se apliquen también acá,
-- sin tener que repetir la lógica de seguridad.
--
-- Prerrequisito: requiere Postgres 15+ (Supabase ya corre sobre 15+, así que
-- no debería ser un problema).

BEGIN;

CREATE OR REPLACE VIEW public.clientes
WITH (security_invoker = true) AS
SELECT
  cliente_telefono AS telefono,
  (array_agg(cliente_nombre ORDER BY fecha DESC))[1] AS nombre,
  count(*)::int AS cantidad_pedidos,
  max(fecha) AS ultimo_pedido,
  sum(total) AS total_gastado
FROM public.pedidos
WHERE cliente_telefono IS NOT NULL AND cliente_telefono <> ''
GROUP BY cliente_telefono;

REVOKE ALL ON public.clientes FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.clientes TO authenticated;

COMMIT;
