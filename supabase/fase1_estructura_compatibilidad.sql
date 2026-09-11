-- Toniominimarket - Fase 1 estructural y de compatibilidad.
--
-- Esta migración NO sincroniza el catálogo, NO carga ofertas, NO crea usuarios
-- de Auth y NO activa las políticas RLS finales. Debe ejecutarse antes de
-- 202609080001_sincronizar_catalogo_aprobado.sql.
--
-- Estado remoto requerido: public.productos legacy con exactamente 391 filas,
-- sin public.admin_users, public.ofertas ni columnas snake_case de transición.

BEGIN;

SET LOCAL lock_timeout = '10s';
SET LOCAL statement_timeout = '120s';

-- ---------------------------------------------------------------------------
-- Preflight sin modificaciones persistentes
-- ---------------------------------------------------------------------------

DO $$
BEGIN
  IF to_regclass('public.productos') IS NULL THEN
    RAISE EXCEPTION 'Fase 1 cancelada: public.productos no existe';
  END IF;

  IF to_regclass('public.admin_users') IS NOT NULL THEN
    RAISE EXCEPTION
      'Fase 1 cancelada: public.admin_users ya existe; repetir inspección';
  END IF;

  IF to_regclass('public.ofertas') IS NOT NULL THEN
    RAISE EXCEPTION
      'Fase 1 cancelada: public.ofertas ya existe; repetir inspección';
  END IF;

  IF to_regclass('public.productos_id_seq') IS NOT NULL THEN
    RAISE EXCEPTION
      'Fase 1 cancelada: public.productos_id_seq ya existe';
  END IF;

  IF to_regclass('public.ofertas_id_seq') IS NOT NULL THEN
    RAISE EXCEPTION
      'Fase 1 cancelada: public.ofertas_id_seq ya existe';
  END IF;

  IF to_regprocedure('public.is_owner()') IS NOT NULL
     OR to_regprocedure('public.is_admin()') IS NOT NULL
     OR to_regprocedure('public.productos_compatibilizar_columnas()') IS NOT NULL
     OR to_regprocedure('public.catalogo_set_updated_at()') IS NOT NULL
     OR to_regprocedure('public.admin_users_limitar_propietarios()') IS NOT NULL
  THEN
    RAISE EXCEPTION
      'Fase 1 cancelada: ya existe una función reservada por esta migración';
  END IF;
END
$$;

-- Impide escrituras concurrentes mientras se verifica y transforma la tabla.
LOCK TABLE public.productos IN ACCESS EXCLUSIVE MODE;

DO $$
DECLARE
  v_columnas_legacy integer;
  v_columnas_totales integer;
  v_columnas_transicion integer;
  v_productos bigint;
  v_trigger_updated_at integer;
  v_triggers_inesperados text;
BEGIN
  SELECT count(*) INTO v_columnas_legacy
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'productos'
    AND (
      (column_name = 'id' AND data_type = 'bigint')
      OR (column_name = 'nombre' AND data_type = 'text')
      OR (column_name = 'precio' AND data_type = 'numeric')
      OR (column_name = 'imagen' AND data_type = 'text')
      OR (column_name = 'categoria' AND data_type = 'text')
      OR (column_name = 'subcategoria' AND data_type = 'text')
      OR (column_name = 'descripcion' AND data_type = 'text')
      OR (column_name = 'stock' AND data_type = 'integer')
      OR (column_name = 'unidadPrecio' AND data_type = 'text')
      OR (column_name = 'esAGranel' AND data_type = 'boolean')
      OR (column_name = 'esFactura' AND data_type = 'boolean')
      OR (column_name = 'esEmpanada' AND data_type = 'boolean')
      OR (column_name = 'preciosMultiples' AND data_type = 'jsonb')
      OR (column_name = 'sabores' AND data_type = 'jsonb')
      OR (column_name = 'presentaciones' AND data_type = 'jsonb')
      OR (column_name = 'created_at' AND data_type = 'timestamp with time zone')
      OR (column_name = 'updated_at' AND data_type = 'timestamp with time zone')
    );

  IF v_columnas_legacy <> 17 THEN
    RAISE EXCEPTION
      'Fase 1 cancelada: la estructura legacy de productos no coincide';
  END IF;

  SELECT count(*) INTO v_columnas_totales
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'productos';

  IF v_columnas_totales <> 17 THEN
    RAISE EXCEPTION
      'Fase 1 cancelada: productos contiene columnas no inspeccionadas';
  END IF;

  SELECT count(*) INTO v_columnas_transicion
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'productos'
    AND column_name IN (
      'unidad_precio',
      'es_a_granel',
      'es_factura',
      'es_empanada',
      'precios_multiples',
      'activo',
      'orden'
    );

  IF v_columnas_transicion <> 0 THEN
    RAISE EXCEPTION
      'Fase 1 cancelada: ya existen columnas de transición';
  END IF;

  SELECT count(*) INTO v_productos
  FROM public.productos;

  IF v_productos <> 391 THEN
    RAISE EXCEPTION
      'Fase 1 cancelada: se esperaban 391 productos y hay %',
      v_productos;
  END IF;

  IF (SELECT count(DISTINCT id) FROM public.productos) <> 391 THEN
    RAISE EXCEPTION
      'Fase 1 cancelada: productos contiene IDs duplicados';
  END IF;

  SELECT count(*) INTO v_trigger_updated_at
  FROM information_schema.triggers
  WHERE event_object_schema = 'public'
    AND event_object_table = 'productos'
    AND trigger_name = 'set_updated_at';

  IF v_trigger_updated_at <> 1 THEN
    RAISE EXCEPTION
      'Fase 1 cancelada: no se encontró el trigger legacy set_updated_at';
  END IF;

  SELECT string_agg(trigger_name, ', ' ORDER BY trigger_name)
  INTO v_triggers_inesperados
  FROM information_schema.triggers
  WHERE event_object_schema = 'public'
    AND event_object_table = 'productos'
    AND trigger_name <> 'set_updated_at';

  IF v_triggers_inesperados IS NOT NULL THEN
    RAISE EXCEPTION
      'Fase 1 cancelada: triggers no inspeccionados en productos: %',
      v_triggers_inesperados;
  END IF;
END
$$;

-- Snapshot temporal para demostrar al final que ningún dato legacy cambió.
CREATE TEMP TABLE fase1_productos_antes
ON COMMIT DROP
AS
SELECT
  id,
  nombre,
  precio,
  imagen,
  categoria,
  subcategoria,
  descripcion,
  stock,
  "unidadPrecio",
  "esAGranel",
  "esFactura",
  "esEmpanada",
  "preciosMultiples",
  sabores,
  presentaciones,
  created_at,
  updated_at
FROM public.productos;

-- ---------------------------------------------------------------------------
-- Administración: estructura vacía, sin credenciales ni propietarios cargados
-- ---------------------------------------------------------------------------

CREATE TABLE public.admin_users (
  user_id uuid PRIMARY KEY
    REFERENCES auth.users(id)
    ON DELETE RESTRICT,
  email text,
  nombre text,
  rol text NOT NULL DEFAULT 'empleado',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT admin_users_rol_check
    CHECK (rol IN ('propietario', 'empleado'))
);

CREATE UNIQUE INDEX admin_users_email_unique_idx
  ON public.admin_users (lower(email))
  WHERE email IS NOT NULL;

CREATE FUNCTION public.admin_users_limitar_propietarios()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_propietarios integer;
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.rol <> 'propietario' THEN
      RETURN NEW;
    END IF;
  ELSIF NEW.rol <> 'propietario'
        OR OLD.rol = 'propietario'
  THEN
    RETURN NEW;
  END IF;

  -- Evita la carrera de dos altas/promociones concurrentes.
  PERFORM pg_advisory_xact_lock(902701);

  SELECT count(*) INTO v_propietarios
  FROM public.admin_users
  WHERE rol = 'propietario';

  IF v_propietarios >= 2 THEN
    RAISE EXCEPTION 'No pueden existir más de dos propietarios';
  END IF;

  RETURN NEW;
END
$$;

REVOKE ALL
ON FUNCTION public.admin_users_limitar_propietarios()
FROM PUBLIC;

CREATE TRIGGER admin_users_limitar_propietarios
BEFORE INSERT OR UPDATE OF rol
ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.admin_users_limitar_propietarios();

CREATE FUNCTION public.is_owner()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users AS administrador
    WHERE administrador.user_id = auth.uid()
      AND administrador.rol = 'propietario'
  );
$$;

REVOKE ALL ON FUNCTION public.is_owner() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_owner() TO authenticated;

CREATE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users AS administrador
    WHERE administrador.user_id = auth.uid()
      AND administrador.rol IN ('propietario', 'empleado')
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Denegación predeterminada hasta ejecutar la Fase 2 aprobada.
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.admin_users FROM anon, authenticated;

-- ---------------------------------------------------------------------------
-- Productos: coexistencia camelCase / snake_case
-- ---------------------------------------------------------------------------

-- Evita que el backfill técnico modifique updated_at.
DROP TRIGGER set_updated_at ON public.productos;

ALTER TABLE public.productos
  ADD COLUMN unidad_precio text,
  ADD COLUMN es_a_granel boolean,
  ADD COLUMN es_factura boolean,
  ADD COLUMN es_empanada boolean,
  ADD COLUMN precios_multiples jsonb,
  ADD COLUMN activo boolean NOT NULL DEFAULT true,
  ADD COLUMN orden integer;

-- Los defaults booleanos se resuelven en el trigger mientras coexisten ambos
-- nombres. Sin defaults físicos se puede reconocer qué formato envió un INSERT.
ALTER TABLE public.productos
  ALTER COLUMN "esAGranel" DROP DEFAULT,
  ALTER COLUMN "esFactura" DROP DEFAULT,
  ALTER COLUMN "esEmpanada" DROP DEFAULT;

-- Copia exacta: no interpreta ni corrige los valores legacy.
UPDATE public.productos
SET
  unidad_precio = "unidadPrecio",
  es_a_granel = "esAGranel",
  es_factura = "esFactura",
  es_empanada = "esEmpanada",
  precios_multiples = "preciosMultiples";

WITH productos_ordenados AS (
  SELECT
    id,
    row_number() OVER (ORDER BY id)::integer AS nuevo_orden
  FROM public.productos
)
UPDATE public.productos AS producto
SET orden = productos_ordenados.nuevo_orden
FROM productos_ordenados
WHERE productos_ordenados.id = producto.id;

ALTER TABLE public.productos
  ALTER COLUMN orden SET NOT NULL,
  ALTER COLUMN orden SET DEFAULT 0;

CREATE FUNCTION public.productos_compatibilizar_columnas()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW."unidadPrecio" IS NOT NULL
       AND NEW.unidad_precio IS NOT NULL
       AND NEW."unidadPrecio" IS DISTINCT FROM NEW.unidad_precio
    THEN
      RAISE EXCEPTION
        'Valores contradictorios: unidadPrecio y unidad_precio';
    END IF;
    NEW.unidad_precio := coalesce(NEW.unidad_precio, NEW."unidadPrecio");
    NEW."unidadPrecio" := NEW.unidad_precio;

    IF NEW."esAGranel" IS NOT NULL
       AND NEW.es_a_granel IS NOT NULL
       AND NEW."esAGranel" IS DISTINCT FROM NEW.es_a_granel
    THEN
      RAISE EXCEPTION
        'Valores contradictorios: esAGranel y es_a_granel';
    END IF;
    NEW.es_a_granel := coalesce(NEW.es_a_granel, NEW."esAGranel", false);
    NEW."esAGranel" := NEW.es_a_granel;

    IF NEW."esFactura" IS NOT NULL
       AND NEW.es_factura IS NOT NULL
       AND NEW."esFactura" IS DISTINCT FROM NEW.es_factura
    THEN
      RAISE EXCEPTION
        'Valores contradictorios: esFactura y es_factura';
    END IF;
    NEW.es_factura := coalesce(NEW.es_factura, NEW."esFactura", false);
    NEW."esFactura" := NEW.es_factura;

    IF NEW."esEmpanada" IS NOT NULL
       AND NEW.es_empanada IS NOT NULL
       AND NEW."esEmpanada" IS DISTINCT FROM NEW.es_empanada
    THEN
      RAISE EXCEPTION
        'Valores contradictorios: esEmpanada y es_empanada';
    END IF;
    NEW.es_empanada := coalesce(NEW.es_empanada, NEW."esEmpanada", false);
    NEW."esEmpanada" := NEW.es_empanada;

    IF NEW."preciosMultiples" IS NOT NULL
       AND NEW.precios_multiples IS NOT NULL
       AND NEW."preciosMultiples" IS DISTINCT FROM NEW.precios_multiples
    THEN
      RAISE EXCEPTION
        'Valores contradictorios: preciosMultiples y precios_multiples';
    END IF;
    NEW.precios_multiples :=
      coalesce(NEW.precios_multiples, NEW."preciosMultiples");
    NEW."preciosMultiples" := NEW.precios_multiples;
  ELSE
    IF NEW.id IS DISTINCT FROM OLD.id THEN
      RAISE EXCEPTION
        'No se permite modificar productos.id durante la transición';
    END IF;

    IF NEW."unidadPrecio" IS DISTINCT FROM OLD."unidadPrecio"
       AND NEW.unidad_precio IS DISTINCT FROM OLD.unidad_precio
       AND NEW."unidadPrecio" IS DISTINCT FROM NEW.unidad_precio
    THEN
      RAISE EXCEPTION
        'Actualización contradictoria: unidadPrecio y unidad_precio';
    ELSIF NEW."unidadPrecio" IS DISTINCT FROM OLD."unidadPrecio" THEN
      NEW.unidad_precio := NEW."unidadPrecio";
    ELSIF NEW.unidad_precio IS DISTINCT FROM OLD.unidad_precio THEN
      NEW."unidadPrecio" := NEW.unidad_precio;
    END IF;

    IF NEW."esAGranel" IS DISTINCT FROM OLD."esAGranel"
       AND NEW.es_a_granel IS DISTINCT FROM OLD.es_a_granel
       AND NEW."esAGranel" IS DISTINCT FROM NEW.es_a_granel
    THEN
      RAISE EXCEPTION
        'Actualización contradictoria: esAGranel y es_a_granel';
    ELSIF NEW."esAGranel" IS DISTINCT FROM OLD."esAGranel" THEN
      NEW.es_a_granel := NEW."esAGranel";
    ELSIF NEW.es_a_granel IS DISTINCT FROM OLD.es_a_granel THEN
      NEW."esAGranel" := NEW.es_a_granel;
    END IF;

    IF NEW."esFactura" IS DISTINCT FROM OLD."esFactura"
       AND NEW.es_factura IS DISTINCT FROM OLD.es_factura
       AND NEW."esFactura" IS DISTINCT FROM NEW.es_factura
    THEN
      RAISE EXCEPTION
        'Actualización contradictoria: esFactura y es_factura';
    ELSIF NEW."esFactura" IS DISTINCT FROM OLD."esFactura" THEN
      NEW.es_factura := NEW."esFactura";
    ELSIF NEW.es_factura IS DISTINCT FROM OLD.es_factura THEN
      NEW."esFactura" := NEW.es_factura;
    END IF;

    IF NEW."esEmpanada" IS DISTINCT FROM OLD."esEmpanada"
       AND NEW.es_empanada IS DISTINCT FROM OLD.es_empanada
       AND NEW."esEmpanada" IS DISTINCT FROM NEW.es_empanada
    THEN
      RAISE EXCEPTION
        'Actualización contradictoria: esEmpanada y es_empanada';
    ELSIF NEW."esEmpanada" IS DISTINCT FROM OLD."esEmpanada" THEN
      NEW.es_empanada := NEW."esEmpanada";
    ELSIF NEW.es_empanada IS DISTINCT FROM OLD.es_empanada THEN
      NEW."esEmpanada" := NEW.es_empanada;
    END IF;

    IF NEW."preciosMultiples" IS DISTINCT FROM OLD."preciosMultiples"
       AND NEW.precios_multiples IS DISTINCT FROM OLD.precios_multiples
       AND NEW."preciosMultiples" IS DISTINCT FROM NEW.precios_multiples
    THEN
      RAISE EXCEPTION
        'Actualización contradictoria: preciosMultiples y precios_multiples';
    ELSIF NEW."preciosMultiples" IS DISTINCT FROM OLD."preciosMultiples" THEN
      NEW.precios_multiples := NEW."preciosMultiples";
    ELSIF NEW.precios_multiples IS DISTINCT FROM OLD.precios_multiples THEN
      NEW."preciosMultiples" := NEW.precios_multiples;
    END IF;
  END IF;

  RETURN NEW;
END
$$;

REVOKE ALL
ON FUNCTION public.productos_compatibilizar_columnas()
FROM PUBLIC;

CREATE TRIGGER productos_10_compatibilidad_columnas
BEFORE INSERT OR UPDATE
ON public.productos
FOR EACH ROW
EXECUTE FUNCTION public.productos_compatibilizar_columnas();

-- ---------------------------------------------------------------------------
-- Secuencia de productos
-- ---------------------------------------------------------------------------

CREATE SEQUENCE public.productos_id_seq AS bigint;

ALTER SEQUENCE public.productos_id_seq
  OWNED BY public.productos.id;

ALTER TABLE public.productos
  ALTER COLUMN id
  SET DEFAULT nextval('public.productos_id_seq');

-- Con is_called=false, el próximo nextval devuelve exactamente max(id)+1.
SELECT setval(
  'public.productos_id_seq',
  coalesce((SELECT max(id) + 1 FROM public.productos), 1),
  false
);

CREATE INDEX productos_activos_orden_idx
  ON public.productos (activo, orden, id);

CREATE INDEX productos_categoria_idx
  ON public.productos (categoria, subcategoria);

-- Mantiene funcionales los INSERT legacy mientras se prepara la Fase 2.
GRANT USAGE, SELECT
ON SEQUENCE public.productos_id_seq
TO authenticated;

-- ---------------------------------------------------------------------------
-- Ofertas: estructura vacía hasta la sincronización posterior
-- ---------------------------------------------------------------------------

CREATE TABLE public.ofertas (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  nombre text NOT NULL,
  precio_anterior numeric(12, 2) NOT NULL,
  precio_actual numeric(12, 2) NOT NULL,
  descripcion text NOT NULL DEFAULT '',
  imagen text NOT NULL,
  imagenes jsonb,
  stock integer NOT NULL DEFAULT 0,
  categoria text NOT NULL,
  activa boolean NOT NULL DEFAULT true,
  fecha_inicio date,
  fecha_fin date,
  orden integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ofertas_precio_anterior_check CHECK (precio_anterior >= 0),
  CONSTRAINT ofertas_precio_actual_check CHECK (precio_actual >= 0),
  CONSTRAINT ofertas_stock_check CHECK (stock >= 0),
  CONSTRAINT ofertas_fechas_check CHECK (
    fecha_fin IS NULL
    OR fecha_inicio IS NULL
    OR fecha_fin >= fecha_inicio
  )
);

CREATE INDEX ofertas_activas_orden_idx
  ON public.ofertas (activa, orden, id);

-- Denegación predeterminada hasta ejecutar la Fase 2 aprobada.
ALTER TABLE public.ofertas ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.ofertas FROM anon, authenticated;

-- ---------------------------------------------------------------------------
-- updated_at limitado a las tres tablas creadas o adaptadas por esta fase
-- ---------------------------------------------------------------------------

CREATE FUNCTION public.catalogo_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END
$$;

REVOKE ALL
ON FUNCTION public.catalogo_set_updated_at()
FROM PUBLIC;

CREATE TRIGGER admin_users_90_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.catalogo_set_updated_at();

CREATE TRIGGER productos_90_updated_at
BEFORE UPDATE ON public.productos
FOR EACH ROW
EXECUTE FUNCTION public.catalogo_set_updated_at();

CREATE TRIGGER ofertas_90_updated_at
BEFORE UPDATE ON public.ofertas
FOR EACH ROW
EXECUTE FUNCTION public.catalogo_set_updated_at();

-- ---------------------------------------------------------------------------
-- Postflight: cualquier diferencia aborta y revierte la transacción completa
-- ---------------------------------------------------------------------------

DO $$
BEGIN
  IF (SELECT count(*) FROM public.productos) <> 391 THEN
    RAISE EXCEPTION
      'Fase 1 cancelada: no se preservaron las 391 filas de productos';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM fase1_productos_antes AS anterior
    FULL JOIN public.productos AS actual USING (id)
    WHERE anterior.id IS NULL
       OR actual.id IS NULL
       OR anterior.nombre IS DISTINCT FROM actual.nombre
       OR anterior.precio IS DISTINCT FROM actual.precio
       OR anterior.imagen IS DISTINCT FROM actual.imagen
       OR anterior.categoria IS DISTINCT FROM actual.categoria
       OR anterior.subcategoria IS DISTINCT FROM actual.subcategoria
       OR anterior.descripcion IS DISTINCT FROM actual.descripcion
       OR anterior.stock IS DISTINCT FROM actual.stock
       OR anterior."unidadPrecio" IS DISTINCT FROM actual."unidadPrecio"
       OR anterior."esAGranel" IS DISTINCT FROM actual."esAGranel"
       OR anterior."esFactura" IS DISTINCT FROM actual."esFactura"
       OR anterior."esEmpanada" IS DISTINCT FROM actual."esEmpanada"
       OR anterior."preciosMultiples" IS DISTINCT FROM actual."preciosMultiples"
       OR anterior.sabores IS DISTINCT FROM actual.sabores
       OR anterior.presentaciones IS DISTINCT FROM actual.presentaciones
       OR anterior.created_at IS DISTINCT FROM actual.created_at
       OR anterior.updated_at IS DISTINCT FROM actual.updated_at
  ) THEN
    RAISE EXCEPTION
      'Fase 1 cancelada: se modificó algún dato legacy de productos';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.productos
    WHERE unidad_precio IS DISTINCT FROM "unidadPrecio"
       OR es_a_granel IS DISTINCT FROM "esAGranel"
       OR es_factura IS DISTINCT FROM "esFactura"
       OR es_empanada IS DISTINCT FROM "esEmpanada"
       OR precios_multiples IS DISTINCT FROM "preciosMultiples"
  ) THEN
    RAISE EXCEPTION
      'Fase 1 cancelada: el espejo camelCase/snake_case es inconsistente';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.productos
    WHERE activo IS DISTINCT FROM true
  ) THEN
    RAISE EXCEPTION
      'Fase 1 cancelada: ningún producto debe quedar desactivado';
  END IF;

  IF (SELECT count(*) FROM public.admin_users) <> 0 THEN
    RAISE EXCEPTION
      'Fase 1 cancelada: admin_users debe finalizar vacío';
  END IF;

  IF (SELECT count(*) FROM public.ofertas) <> 0 THEN
    RAISE EXCEPTION
      'Fase 1 cancelada: ofertas debe finalizar vacía';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('admin_users', 'ofertas')
  ) THEN
    RAISE EXCEPTION
      'Fase 1 cancelada: no deben existir políticas finales nuevas';
  END IF;
END
$$;

COMMIT;
