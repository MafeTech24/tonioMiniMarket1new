-- Migración manual y quirúrgica de public.pedidos.
-- NO forma parte de supabase/migrations y no debe ejecutarse automáticamente.
-- Preserva los pedidos históricos 1035, 2091 y 3801.

BEGIN ISOLATION LEVEL SERIALIZABLE;

LOCK TABLE public.pedidos IN ACCESS EXCLUSIVE MODE;

-- ---------------------------------------------------------------------------
-- Preflight: debe coincidir exactamente con el estado legacy inspeccionado.
-- ---------------------------------------------------------------------------

DO $preflight$
DECLARE
  v_columnas_correctas integer;
  v_indices text[];
BEGIN
  IF to_regclass('public.pedidos') IS NULL THEN
    RAISE EXCEPTION 'Cancelado: public.pedidos no existe';
  END IF;

  IF (SELECT count(*) FROM public.pedidos) <> 3 THEN
    RAISE EXCEPTION 'Cancelado: se esperaban exactamente 3 pedidos';
  END IF;

  IF (SELECT array_agg(numero_pedido ORDER BY numero_pedido) FROM public.pedidos)
     IS DISTINCT FROM ARRAY['1035', '2091', '3801']::text[] THEN
    RAISE EXCEPTION 'Cancelado: los pedidos históricos no coinciden';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.pedidos
    WHERE numero_pedido !~ '^[1-9][0-9]*$'
  ) THEN
    RAISE EXCEPTION 'Cancelado: existe un numero_pedido no convertible a bigint';
  END IF;

  WITH esperadas(nombre, udt, nullable) AS (
    VALUES
      ('id', 'uuid', 'NO'),
      ('fecha', 'timestamptz', 'NO'),
      ('numero_pedido', 'text', 'NO'),
      ('cliente_nombre', 'text', 'NO'),
      ('cliente_telefono', 'text', 'NO'),
      ('productos', 'jsonb', 'NO'),
      ('subtotal', 'numeric', 'NO'),
      ('costo_envio', 'numeric', 'NO'),
      ('total', 'numeric', 'NO'),
      ('calle', 'text', 'YES'),
      ('piso_dpto', 'text', 'YES'),
      ('barrio', 'text', 'YES'),
      ('direccion_completa', 'text', 'YES'),
      ('metodo_entrega', 'text', 'NO'),
      ('metodo_pago', 'text', 'NO'),
      ('notas', 'text', 'YES'),
      ('estado', 'text', 'NO')
  )
  SELECT count(*) INTO v_columnas_correctas
  FROM esperadas e
  JOIN information_schema.columns c
    ON c.table_schema = 'public'
   AND c.table_name = 'pedidos'
   AND c.column_name = e.nombre
   AND c.udt_name = e.udt
   AND c.is_nullable = e.nullable;

  IF v_columnas_correctas <> 17 OR (
    SELECT count(*) FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pedidos'
  ) <> 17 THEN
    RAISE EXCEPTION 'Cancelado: la estructura legacy de pedidos cambió';
  END IF;

  IF (SELECT column_default FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'pedidos'
        AND column_name = 'numero_pedido') IS NOT NULL
     OR (SELECT is_identity FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = 'pedidos'
           AND column_name = 'numero_pedido') <> 'NO' THEN
    RAISE EXCEPTION 'Cancelado: numero_pedido ya tiene generación automática';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pedidos'
      AND column_name IN ('token_publico', 'updated_at')
  ) THEN
    RAISE EXCEPTION 'Cancelado: token_publico o updated_at ya existen';
  END IF;

  IF (SELECT count(*) FROM pg_constraint con
      JOIN pg_class rel ON rel.oid = con.conrelid
      JOIN pg_namespace ns ON ns.oid = rel.relnamespace
      WHERE ns.nspname = 'public' AND rel.relname = 'pedidos') <> 2
     OR NOT EXISTS (
       SELECT 1 FROM pg_constraint con
       JOIN pg_class rel ON rel.oid = con.conrelid
       JOIN pg_namespace ns ON ns.oid = rel.relnamespace
       WHERE ns.nspname = 'public' AND rel.relname = 'pedidos'
         AND con.conname = 'pedidos_pkey' AND con.contype = 'p'
     )
     OR NOT EXISTS (
       SELECT 1 FROM pg_constraint con
       JOIN pg_class rel ON rel.oid = con.conrelid
       JOIN pg_namespace ns ON ns.oid = rel.relnamespace
       WHERE ns.nspname = 'public' AND rel.relname = 'pedidos'
         AND con.conname = 'pedidos_numero_pedido_key' AND con.contype = 'u'
     ) THEN
    RAISE EXCEPTION 'Cancelado: constraints legacy inesperados';
  END IF;

  SELECT array_agg(indexname ORDER BY indexname) INTO v_indices
  FROM pg_indexes
  WHERE schemaname = 'public' AND tablename = 'pedidos';

  IF v_indices IS DISTINCT FROM ARRAY[
    'idx_pedidos_numero_pedido',
    'pedidos_numero_pedido_key',
    'pedidos_pkey'
  ]::text[] THEN
    RAISE EXCEPTION 'Cancelado: índices legacy inesperados';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class rel ON rel.oid = t.tgrelid
    JOIN pg_namespace ns ON ns.oid = rel.relnamespace
    WHERE ns.nspname = 'public' AND rel.relname = 'pedidos'
      AND NOT t.tgisinternal
  ) THEN
    RAISE EXCEPTION 'Cancelado: pedidos ya tiene triggers';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace ns ON ns.oid = p.pronamespace
    WHERE ns.nspname = 'public'
      AND p.proname IN ('crear_pedido', 'obtener_comprobante')
  ) THEN
    RAISE EXCEPTION 'Cancelado: ya existe alguna RPC reservada';
  END IF;

  IF to_regprocedure('public.is_owner()') IS NULL
     OR NOT (SELECT p.prosecdef
             FROM pg_proc p
             WHERE p.oid = to_regprocedure('public.is_owner()'))
     OR position(
          'auth.uid()' IN
          (SELECT pg_get_functiondef(p.oid)
           FROM pg_proc p
           WHERE p.oid = to_regprocedure('public.is_owner()'))
        ) = 0 THEN
    RAISE EXCEPTION
      'Cancelado: public.is_owner() no existe o no usa SECURITY DEFINER + auth.uid()';
  END IF;

  IF (SELECT count(*) FROM public.admin_users WHERE rol = 'propietario') <> 2
     OR (SELECT count(*)
         FROM public.admin_users au
         JOIN auth.users u ON u.id = au.user_id
         WHERE au.rol = 'propietario'
           AND u.email_confirmed_at IS NOT NULL
           AND lower(au.email) = lower(u.email)) <> 2 THEN
    RAISE EXCEPTION 'Cancelado: no existen exactamente 2 propietarios válidos';
  END IF;

  IF NOT (SELECT relrowsecurity FROM pg_class rel
          JOIN pg_namespace ns ON ns.oid = rel.relnamespace
          WHERE ns.nspname = 'public' AND rel.relname = 'pedidos') THEN
    RAISE EXCEPTION 'Cancelado: RLS no está habilitado en pedidos';
  END IF;

  IF (SELECT count(*) FROM pg_policies
      WHERE schemaname = 'public' AND tablename = 'pedidos') <> 2
     OR NOT EXISTS (
       SELECT 1 FROM pg_policies
       WHERE schemaname = 'public' AND tablename = 'pedidos'
         AND policyname = 'Permitir lectura de pedidos'
         AND cmd = 'SELECT' AND roles = ARRAY['public']::name[]
         AND trim(qual) = 'true'
     )
     OR NOT EXISTS (
       SELECT 1 FROM pg_policies
       WHERE schemaname = 'public' AND tablename = 'pedidos'
         AND policyname = 'Permitir insertar pedidos'
         AND cmd = 'INSERT' AND roles = ARRAY['public']::name[]
         AND trim(with_check) = 'true'
     ) THEN
    RAISE EXCEPTION 'Cancelado: las políticas legacy no coinciden';
  END IF;

  IF to_regclass('public.pedidos_numero_pedido_seq') IS NOT NULL
     OR to_regclass('public.pedidos_fecha_idx') IS NOT NULL
     OR to_regclass('public.pedidos_estado_idx') IS NOT NULL THEN
    RAISE EXCEPTION 'Cancelado: ya existe un objeto reservado';
  END IF;

  IF to_regprocedure('public.catalogo_set_updated_at()') IS NULL THEN
    RAISE EXCEPTION 'Cancelado: falta catalogo_set_updated_at()';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.pedidos
    WHERE jsonb_typeof(productos) IS DISTINCT FROM 'array'
       OR subtotal < 0 OR costo_envio < 0 OR total < 0
       OR metodo_entrega NOT IN ('Delivery', 'Retiro en local')
       OR metodo_pago NOT IN ('Efectivo', 'Transferencia')
       OR estado NOT IN (
         'pendiente', 'confirmado', 'en preparación',
         'en camino', 'entregado', 'cancelado'
       )
  ) THEN
    RAISE EXCEPTION 'Cancelado: un pedido histórico incumple los nuevos CHECK';
  END IF;
END
$preflight$;

-- Copia transaccional para comparar todos los datos legacy antes del COMMIT.
CREATE TEMP TABLE pedidos_legacy_snapshot ON COMMIT DROP AS
SELECT
  id,
  numero_pedido,
  to_jsonb(p) - 'numero_pedido' AS datos_legacy
FROM public.pedidos p;

-- ---------------------------------------------------------------------------
-- Estructura: los únicos UPDATE afectan los dos nuevos campos técnicos.
-- ---------------------------------------------------------------------------

ALTER TABLE public.pedidos
  ALTER COLUMN numero_pedido TYPE bigint
  USING numero_pedido::bigint;

ALTER TABLE public.pedidos
  ALTER COLUMN numero_pedido
  ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.pedidos_numero_pedido_seq
    START WITH 100000
  );

ALTER TABLE public.pedidos
  ADD COLUMN token_publico uuid,
  ADD COLUMN updated_at timestamptz;

UPDATE public.pedidos
SET
  token_publico = gen_random_uuid(),
  updated_at = fecha;

ALTER TABLE public.pedidos
  ALTER COLUMN token_publico SET DEFAULT gen_random_uuid(),
  ALTER COLUMN token_publico SET NOT NULL,
  ALTER COLUMN updated_at SET DEFAULT now(),
  ALTER COLUMN updated_at SET NOT NULL,
  ADD CONSTRAINT pedidos_token_publico_key UNIQUE (token_publico),
  ADD CONSTRAINT pedidos_productos_array_check
    CHECK (jsonb_typeof(productos) = 'array'),
  ADD CONSTRAINT pedidos_subtotal_check CHECK (subtotal >= 0),
  ADD CONSTRAINT pedidos_costo_envio_check CHECK (costo_envio >= 0),
  ADD CONSTRAINT pedidos_total_check CHECK (total >= 0),
  ADD CONSTRAINT pedidos_metodo_entrega_check
    CHECK (metodo_entrega IN ('Delivery', 'Retiro en local')),
  ADD CONSTRAINT pedidos_metodo_pago_check
    CHECK (metodo_pago IN ('Efectivo', 'Transferencia')),
  ADD CONSTRAINT pedidos_estado_check
    CHECK (estado IN (
      'pendiente', 'confirmado', 'en preparación',
      'en camino', 'entregado', 'cancelado'
    ));

CREATE INDEX pedidos_fecha_idx ON public.pedidos (fecha DESC);
CREATE INDEX pedidos_estado_idx ON public.pedidos (estado, fecha DESC);

CREATE TRIGGER set_pedidos_updated_at
BEFORE UPDATE ON public.pedidos
FOR EACH ROW
EXECUTE FUNCTION public.catalogo_set_updated_at();

-- ---------------------------------------------------------------------------
-- RPC pública de creación: único camino de escritura para clientes.
-- ---------------------------------------------------------------------------

CREATE FUNCTION public.crear_pedido(
  p_cliente_nombre text,
  p_cliente_telefono text,
  p_productos jsonb,
  p_subtotal numeric,
  p_costo_envio numeric,
  p_total numeric,
  p_calle text,
  p_piso_dpto text,
  p_direccion_completa text,
  p_metodo_entrega text,
  p_metodo_pago text,
  p_notas text
)
RETURNS TABLE (numero_pedido bigint, token_publico uuid, fecha timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $crear_pedido$
DECLARE
  v_pedido public.pedidos%ROWTYPE;
  v_item jsonb;
  v_cantidad integer;
  v_precio numeric;
  v_subtotal_item numeric;
  v_subtotal_calculado numeric := 0;
  v_producto_id bigint;
  v_tipo text;
BEGIN
  IF char_length(trim(coalesce(p_cliente_nombre, ''))) NOT BETWEEN 2 AND 120 THEN
    RAISE EXCEPTION 'Nombre inválido';
  END IF;

  IF char_length(regexp_replace(coalesce(p_cliente_telefono, ''), '[^0-9]', '', 'g'))
     NOT BETWEEN 10 AND 15 THEN
    RAISE EXCEPTION 'Teléfono inválido';
  END IF;

  IF p_productos IS NULL
     OR jsonb_typeof(p_productos) <> 'array'
     OR jsonb_array_length(p_productos) NOT BETWEEN 1 AND 100
     OR pg_column_size(p_productos) > 100000 THEN
    RAISE EXCEPTION 'Productos inválidos';
  END IF;

  FOR v_item IN SELECT value FROM jsonb_array_elements(p_productos)
  LOOP
    IF jsonb_typeof(v_item) <> 'object'
       OR NOT (v_item ?& ARRAY[
         'producto_id', 'tipo', 'nombre', 'cantidad', 'precio', 'subtotal'
       ])
       OR (v_item - ARRAY[
         'producto_id', 'tipo', 'nombre', 'cantidad', 'precio', 'subtotal'
       ]) <> '{}'::jsonb
       OR coalesce(v_item->>'producto_id', '') !~ '^[1-9][0-9]*$'
       OR coalesce(v_item->>'cantidad', '') !~ '^[1-9][0-9]*$'
       OR coalesce(v_item->>'precio', '') !~ '^[0-9]+([.][0-9]+)?$'
       OR coalesce(v_item->>'subtotal', '') !~ '^[0-9]+([.][0-9]+)?$'
       OR v_item->>'tipo' NOT IN ('producto', 'oferta')
       OR char_length(trim(coalesce(v_item->>'nombre', ''))) NOT BETWEEN 1 AND 200 THEN
      RAISE EXCEPTION 'Detalle de productos inválido';
    END IF;

    v_producto_id := (v_item->>'producto_id')::bigint;
    v_cantidad := (v_item->>'cantidad')::integer;
    v_precio := (v_item->>'precio')::numeric;
    v_subtotal_item := (v_item->>'subtotal')::numeric;
    v_tipo := v_item->>'tipo';

    IF v_cantidad > 1000
       OR v_precio <= 0 OR v_precio > 100000000
       OR abs(v_subtotal_item - (v_cantidad * v_precio)) > 0.01 THEN
      RAISE EXCEPTION 'Detalle de productos inconsistente';
    END IF;

    IF v_tipo = 'producto' AND NOT EXISTS (
      SELECT 1 FROM public.productos
      WHERE id = v_producto_id AND activo = true
    ) THEN
      RAISE EXCEPTION 'Producto inexistente o inactivo';
    END IF;

    IF v_tipo = 'oferta' AND NOT EXISTS (
      SELECT 1 FROM public.ofertas
      WHERE id = v_producto_id
        AND activa = true
        AND (fecha_inicio IS NULL OR fecha_inicio <= current_date)
        AND (fecha_fin IS NULL OR fecha_fin >= current_date)
    ) THEN
      RAISE EXCEPTION 'Oferta inexistente o no vigente';
    END IF;

    v_subtotal_calculado := v_subtotal_calculado + v_subtotal_item;
  END LOOP;

  IF p_subtotal IS NULL OR p_costo_envio IS NULL OR p_total IS NULL
     OR p_subtotal < 0 OR p_costo_envio < 0 OR p_total < 0
     OR p_total > 10000000000
     OR abs(v_subtotal_calculado - p_subtotal) > 0.01
     OR abs((p_subtotal + p_costo_envio) - p_total) > 0.01 THEN
    RAISE EXCEPTION 'Totales inconsistentes';
  END IF;

  IF p_metodo_entrega NOT IN ('Delivery', 'Retiro en local') THEN
    RAISE EXCEPTION 'Método de entrega inválido';
  END IF;

  IF p_metodo_pago NOT IN ('Efectivo', 'Transferencia') THEN
    RAISE EXCEPTION 'Método de pago inválido';
  END IF;

  IF p_metodo_entrega = 'Delivery'
     AND char_length(trim(coalesce(p_direccion_completa, ''))) NOT BETWEEN 4 AND 300 THEN
    RAISE EXCEPTION 'Dirección inválida';
  END IF;

  IF p_metodo_entrega = 'Retiro en local'
     AND p_costo_envio <> 0 THEN
    RAISE EXCEPTION 'El retiro en local no puede tener costo de envío';
  END IF;

  IF char_length(coalesce(p_notas, '')) > 1000
     OR char_length(coalesce(p_calle, '')) > 200
     OR char_length(coalesce(p_piso_dpto, '')) > 200 THEN
    RAISE EXCEPTION 'Texto demasiado extenso';
  END IF;

  INSERT INTO public.pedidos (
    cliente_nombre,
    cliente_telefono,
    productos,
    subtotal,
    costo_envio,
    total,
    calle,
    piso_dpto,
    barrio,
    direccion_completa,
    metodo_entrega,
    metodo_pago,
    notas
  ) VALUES (
    trim(p_cliente_nombre),
    trim(p_cliente_telefono),
    p_productos,
    p_subtotal,
    p_costo_envio,
    p_total,
    nullif(trim(coalesce(p_calle, '')), ''),
    nullif(trim(coalesce(p_piso_dpto, '')), ''),
    NULL,
    CASE WHEN p_metodo_entrega = 'Delivery'
      THEN nullif(trim(coalesce(p_direccion_completa, '')), '')
      ELSE NULL
    END,
    p_metodo_entrega,
    p_metodo_pago,
    nullif(trim(coalesce(p_notas, '')), '')
  )
  RETURNING * INTO v_pedido;

  RETURN QUERY
  SELECT v_pedido.numero_pedido, v_pedido.token_publico, v_pedido.fecha;
END
$crear_pedido$;

REVOKE ALL ON FUNCTION public.crear_pedido(
  text, text, jsonb, numeric, numeric, numeric,
  text, text, text, text, text, text
) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.crear_pedido(
  text, text, jsonb, numeric, numeric, numeric,
  text, text, text, text, text, text
) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- RPC de comprobante: nunca devuelve token_publico.
-- ---------------------------------------------------------------------------

CREATE FUNCTION public.obtener_comprobante(
  p_numero_pedido bigint,
  p_token_publico uuid
)
RETURNS TABLE (
  id uuid,
  numero_pedido bigint,
  fecha timestamptz,
  cliente_nombre text,
  cliente_telefono text,
  productos jsonb,
  subtotal numeric,
  costo_envio numeric,
  total numeric,
  calle text,
  piso_dpto text,
  barrio text,
  direccion_completa text,
  metodo_entrega text,
  metodo_pago text,
  notas text,
  estado text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $obtener_comprobante$
  SELECT
    p.id,
    p.numero_pedido,
    p.fecha,
    p.cliente_nombre,
    p.cliente_telefono,
    p.productos,
    p.subtotal,
    p.costo_envio,
    p.total,
    p.calle,
    p.piso_dpto,
    p.barrio,
    p.direccion_completa,
    p.metodo_entrega,
    p.metodo_pago,
    p.notas,
    p.estado
  FROM public.pedidos p
  WHERE p.numero_pedido = p_numero_pedido
    AND p.token_publico = p_token_publico
  LIMIT 1;
$obtener_comprobante$;

REVOKE ALL ON FUNCTION public.obtener_comprobante(bigint, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.obtener_comprobante(bigint, uuid)
  TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- RLS y privilegios mínimos.
-- ---------------------------------------------------------------------------

DROP POLICY "Permitir lectura de pedidos" ON public.pedidos;
DROP POLICY "Permitir insertar pedidos" ON public.pedidos;

REVOKE ALL ON TABLE public.pedidos FROM PUBLIC, anon, authenticated;
REVOKE ALL ON SEQUENCE public.pedidos_numero_pedido_seq
  FROM PUBLIC, anon, authenticated;

-- El panel actual usa SELECT *; RLS limita esta lectura a propietarios.
GRANT SELECT ON TABLE public.pedidos TO authenticated;
GRANT UPDATE (estado) ON public.pedidos TO authenticated;

CREATE POLICY pedidos_propietarios_lectura
ON public.pedidos
FOR SELECT
TO authenticated
USING (public.is_owner());

CREATE POLICY pedidos_propietarios_actualizar_estado
ON public.pedidos
FOR UPDATE
TO authenticated
USING (public.is_owner())
WITH CHECK (public.is_owner());

-- ---------------------------------------------------------------------------
-- Postflight: cualquier diferencia aborta y revierte todo lo anterior.
-- ---------------------------------------------------------------------------

DO $postflight$
DECLARE
  v_last_value bigint;
  v_is_called boolean;
BEGIN
  IF (SELECT count(*) FROM public.pedidos) <> 3 THEN
    RAISE EXCEPTION 'Postflight: cambió la cantidad de pedidos';
  END IF;

  IF (SELECT array_agg(numero_pedido ORDER BY numero_pedido) FROM public.pedidos)
     IS DISTINCT FROM ARRAY[1035, 2091, 3801]::bigint[] THEN
    RAISE EXCEPTION 'Postflight: cambiaron los números históricos';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pedidos_legacy_snapshot s
    FULL JOIN public.pedidos p ON p.id = s.id
    WHERE p.id IS NULL OR s.id IS NULL
       OR p.numero_pedido::text IS DISTINCT FROM s.numero_pedido
       OR (to_jsonb(p) - ARRAY['numero_pedido', 'token_publico', 'updated_at'])
          IS DISTINCT FROM s.datos_legacy
  ) THEN
    RAISE EXCEPTION 'Postflight: se modificaron datos comerciales históricos';
  END IF;

  IF (SELECT count(*) FROM public.pedidos WHERE token_publico IS NOT NULL) <> 3
     OR (SELECT count(DISTINCT token_publico) FROM public.pedidos) <> 3
     OR EXISTS (SELECT 1 FROM public.pedidos WHERE updated_at IS NULL) THEN
    RAISE EXCEPTION 'Postflight: campos técnicos históricos inválidos';
  END IF;

  SELECT last_value, is_called INTO v_last_value, v_is_called
  FROM public.pedidos_numero_pedido_seq;

  IF v_last_value <> 100000 OR v_is_called THEN
    RAISE EXCEPTION 'Postflight: el siguiente numero_pedido no será 100000';
  END IF;

  IF to_regprocedure(
       'public.crear_pedido(text,text,jsonb,numeric,numeric,numeric,text,text,text,text,text,text)'
     ) IS NULL
     OR to_regprocedure('public.obtener_comprobante(bigint,uuid)') IS NULL
     OR (SELECT count(*) FROM pg_proc p
         JOIN pg_namespace ns ON ns.oid = p.pronamespace
         WHERE ns.nspname = 'public'
           AND p.proname IN ('crear_pedido', 'obtener_comprobante')) <> 2 THEN
    RAISE EXCEPTION 'Postflight: firmas RPC inesperadas';
  END IF;

  IF NOT has_function_privilege(
       'anon',
       'public.crear_pedido(text,text,jsonb,numeric,numeric,numeric,text,text,text,text,text,text)',
       'EXECUTE'
     )
     OR NOT has_function_privilege(
       'anon', 'public.obtener_comprobante(bigint,uuid)', 'EXECUTE'
     ) THEN
    RAISE EXCEPTION 'Postflight: anon no puede ejecutar las RPC autorizadas';
  END IF;

  IF has_table_privilege('anon', 'public.pedidos', 'SELECT')
     OR has_table_privilege('anon', 'public.pedidos', 'INSERT')
     OR has_table_privilege('anon', 'public.pedidos', 'UPDATE')
     OR has_table_privilege('anon', 'public.pedidos', 'DELETE')
     OR has_table_privilege('anon', 'public.pedidos', 'TRUNCATE') THEN
    RAISE EXCEPTION 'Postflight: anon conserva acceso directo a pedidos';
  END IF;

  IF NOT has_table_privilege('authenticated', 'public.pedidos', 'SELECT')
     OR NOT has_column_privilege('authenticated', 'public.pedidos', 'estado', 'UPDATE')
     OR has_table_privilege('authenticated', 'public.pedidos', 'INSERT')
     OR has_table_privilege('authenticated', 'public.pedidos', 'DELETE')
     OR has_table_privilege('authenticated', 'public.pedidos', 'TRUNCATE') THEN
    RAISE EXCEPTION 'Postflight: privilegios authenticated inesperados';
  END IF;

  IF (SELECT count(*) FROM pg_policies
      WHERE schemaname = 'public' AND tablename = 'pedidos') <> 2
     OR NOT EXISTS (
       SELECT 1 FROM pg_policies
       WHERE schemaname = 'public' AND tablename = 'pedidos'
         AND policyname = 'pedidos_propietarios_lectura'
         AND cmd = 'SELECT' AND roles = ARRAY['authenticated']::name[]
         AND position('is_owner()' IN qual) > 0
     )
     OR NOT EXISTS (
       SELECT 1 FROM pg_policies
       WHERE schemaname = 'public' AND tablename = 'pedidos'
         AND policyname = 'pedidos_propietarios_actualizar_estado'
         AND cmd = 'UPDATE' AND roles = ARRAY['authenticated']::name[]
         AND position('is_owner()' IN qual) > 0
         AND position('is_owner()' IN with_check) > 0
     ) THEN
    RAISE EXCEPTION 'Postflight: políticas finales inesperadas';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'pedidos'
      AND (
        roles @> ARRAY['public']::name[]
        OR policyname IN (
          'Permitir lectura de pedidos',
          'Permitir insertar pedidos'
        )
      )
  ) THEN
    RAISE EXCEPTION 'Postflight: permanece una política pública legacy';
  END IF;

  IF (SELECT count(*) FROM public.admin_users au
      JOIN auth.users u ON u.id = au.user_id
      WHERE au.rol = 'propietario'
        AND u.email_confirmed_at IS NOT NULL
        AND lower(au.email) = lower(u.email)) <> 2 THEN
    RAISE EXCEPTION 'Postflight: cambiaron los propietarios válidos';
  END IF;

  IF (SELECT count(*) FROM pg_trigger t
      JOIN pg_class rel ON rel.oid = t.tgrelid
      JOIN pg_namespace ns ON ns.oid = rel.relnamespace
      WHERE ns.nspname = 'public' AND rel.relname = 'pedidos'
        AND NOT t.tgisinternal
        AND t.tgname = 'set_pedidos_updated_at') <> 1 THEN
    RAISE EXCEPTION 'Postflight: trigger updated_at inesperado';
  END IF;
END
$postflight$;

COMMIT;
