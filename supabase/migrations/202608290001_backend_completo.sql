-- Backend consolidado de Tonio MiniMarket.
-- Aplicar desde Supabase SQL Editor antes de ejecutar supabase/seed.sql.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Administradores
-- ---------------------------------------------------------------------------

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  nombre text,
  rol text not null default 'empleado'
    check (rol in ('propietario', 'empleado')),
  created_at timestamptz not null default now()
);

alter table public.admin_users
  add column if not exists nombre text,
  add column if not exists rol text not null default 'empleado';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'admin_users_rol_check'
      and conrelid = 'public.admin_users'::regclass
  ) then
    alter table public.admin_users
      add constraint admin_users_rol_check
      check (rol in ('propietario', 'empleado'));
  end if;
end $$;

create unique index if not exists admin_users_email_unique_idx
  on public.admin_users (lower(email))
  where email is not null;

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and rol in ('propietario', 'empleado')
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and rol = 'propietario'
  );
$$;

revoke all on function public.is_owner() from public;
grant execute on function public.is_owner() to authenticated;

drop policy if exists "Administrador puede verse" on public.admin_users;
create policy "Administrador puede verse"
on public.admin_users
for select
to authenticated
using (user_id = auth.uid() or public.is_owner());

grant select on public.admin_users to authenticated;

-- ---------------------------------------------------------------------------
-- Productos (compatible con la tabla anterior)
-- ---------------------------------------------------------------------------

create table if not exists public.productos (
  id bigint primary key,
  nombre text not null,
  precio numeric(12, 2) not null check (precio >= 0),
  imagen text not null,
  categoria text not null,
  subcategoria text,
  descripcion text not null default '',
  stock integer not null default 0 check (stock >= 0),
  unidad_precio text,
  es_a_granel boolean not null default false,
  es_factura boolean not null default false,
  es_empanada boolean not null default false,
  precios_multiples jsonb,
  sabores jsonb,
  presentaciones jsonb,
  activo boolean not null default true,
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'productos' and column_name = 'unidadPrecio'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'productos' and column_name = 'unidad_precio'
  ) then
    alter table public.productos rename column "unidadPrecio" to unidad_precio;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'productos' and column_name = 'esAGranel'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'productos' and column_name = 'es_a_granel'
  ) then
    alter table public.productos rename column "esAGranel" to es_a_granel;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'productos' and column_name = 'esFactura'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'productos' and column_name = 'es_factura'
  ) then
    alter table public.productos rename column "esFactura" to es_factura;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'productos' and column_name = 'esEmpanada'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'productos' and column_name = 'es_empanada'
  ) then
    alter table public.productos rename column "esEmpanada" to es_empanada;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'productos' and column_name = 'preciosMultiples'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'productos' and column_name = 'precios_multiples'
  ) then
    alter table public.productos rename column "preciosMultiples" to precios_multiples;
  end if;
end $$;

alter table public.productos
  add column if not exists unidad_precio text,
  add column if not exists es_a_granel boolean not null default false,
  add column if not exists es_factura boolean not null default false,
  add column if not exists es_empanada boolean not null default false,
  add column if not exists precios_multiples jsonb,
  add column if not exists sabores jsonb,
  add column if not exists presentaciones jsonb,
  add column if not exists activo boolean not null default true,
  add column if not exists orden integer not null default 0,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create sequence if not exists public.productos_id_seq;
alter sequence public.productos_id_seq owned by public.productos.id;
alter table public.productos alter column id set default nextval('public.productos_id_seq');
select setval(
  'public.productos_id_seq',
  greatest(coalesce((select max(id) from public.productos), 0), 1),
  true
);

create index if not exists productos_activos_orden_idx
  on public.productos (activo, orden, id);
create index if not exists productos_categoria_idx
  on public.productos (categoria, subcategoria);

alter table public.productos enable row level security;

drop policy if exists "Permitir lectura pública" on public.productos;
drop policy if exists "Permitir modificación a autenticados" on public.productos;
drop policy if exists "Catálogo público activo" on public.productos;
drop policy if exists "Administrador ve todos los productos" on public.productos;
drop policy if exists "Administrador crea productos" on public.productos;
drop policy if exists "Administrador actualiza productos" on public.productos;
drop policy if exists "Administrador elimina productos" on public.productos;

create policy "Catálogo público activo"
on public.productos
for select
to anon, authenticated
using (activo = true);

create policy "Administrador ve todos los productos"
on public.productos
for select
to authenticated
using (public.is_owner());

create policy "Administrador crea productos"
on public.productos
for insert
to authenticated
with check (public.is_owner());

create policy "Administrador actualiza productos"
on public.productos
for update
to authenticated
using (public.is_owner())
with check (public.is_owner());

create policy "Administrador elimina productos"
on public.productos
for delete
to authenticated
using (public.is_owner());

grant select on public.productos to anon, authenticated;
grant insert, update, delete on public.productos to authenticated;
grant usage, select on sequence public.productos_id_seq to authenticated;

-- ---------------------------------------------------------------------------
-- Ofertas administrables
-- ---------------------------------------------------------------------------

create table if not exists public.ofertas (
  id bigint generated by default as identity primary key,
  nombre text not null,
  precio_anterior numeric(12, 2) not null check (precio_anterior >= 0),
  precio_actual numeric(12, 2) not null check (precio_actual >= 0),
  descripcion text not null default '',
  imagen text not null,
  imagenes jsonb,
  stock integer not null default 0 check (stock >= 0),
  categoria text not null,
  activa boolean not null default true,
  fecha_inicio date,
  fecha_fin date,
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (fecha_fin is null or fecha_inicio is null or fecha_fin >= fecha_inicio)
);

create index if not exists ofertas_activas_orden_idx
  on public.ofertas (activa, orden, id);

alter table public.ofertas enable row level security;

drop policy if exists "Ofertas públicas vigentes" on public.ofertas;
drop policy if exists "Administrador ve todas las ofertas" on public.ofertas;
drop policy if exists "Administrador crea ofertas" on public.ofertas;
drop policy if exists "Administrador actualiza ofertas" on public.ofertas;
drop policy if exists "Administrador elimina ofertas" on public.ofertas;

create policy "Ofertas públicas vigentes"
on public.ofertas
for select
to anon, authenticated
using (
  activa = true
  and (fecha_inicio is null or fecha_inicio <= current_date)
  and (fecha_fin is null or fecha_fin >= current_date)
);

create policy "Administrador ve todas las ofertas"
on public.ofertas
for select
to authenticated
using (public.is_owner());

create policy "Administrador crea ofertas"
on public.ofertas
for insert
to authenticated
with check (public.is_owner());

create policy "Administrador actualiza ofertas"
on public.ofertas
for update
to authenticated
using (public.is_owner())
with check (public.is_owner());

create policy "Administrador elimina ofertas"
on public.ofertas
for delete
to authenticated
using (public.is_owner());

grant select on public.ofertas to anon, authenticated;
grant insert, update, delete on public.ofertas to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- ---------------------------------------------------------------------------
-- Pedidos y comprobantes privados mediante token
-- ---------------------------------------------------------------------------

create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  numero_pedido bigint generated always as identity (start with 100000) unique,
  token_publico uuid not null default gen_random_uuid() unique,
  fecha timestamptz not null default now(),
  cliente_nombre text not null,
  cliente_telefono text not null,
  productos jsonb not null check (jsonb_typeof(productos) = 'array'),
  subtotal numeric(12, 2) not null check (subtotal >= 0),
  costo_envio numeric(12, 2) not null default 0 check (costo_envio >= 0),
  total numeric(12, 2) not null check (total >= 0),
  calle text,
  piso_dpto text,
  barrio text,
  direccion_completa text,
  metodo_entrega text not null check (metodo_entrega in ('Delivery', 'Retiro en local')),
  metodo_pago text not null check (metodo_pago in ('Efectivo', 'Transferencia')),
  notas text,
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'confirmado', 'en preparación', 'en camino', 'entregado', 'cancelado')),
  updated_at timestamptz not null default now()
);

create index if not exists pedidos_fecha_idx on public.pedidos (fecha desc);
create index if not exists pedidos_estado_idx on public.pedidos (estado, fecha desc);

alter table public.pedidos enable row level security;

drop policy if exists "Administrador ve pedidos" on public.pedidos;
drop policy if exists "Administrador actualiza pedidos" on public.pedidos;
drop policy if exists "Administrador elimina pedidos" on public.pedidos;

create policy "Administrador ve pedidos"
on public.pedidos
for select
to authenticated
using (public.is_admin());

create policy "Administrador actualiza pedidos"
on public.pedidos
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Administrador elimina pedidos"
on public.pedidos
for delete
to authenticated
using (public.is_owner());

grant select, update, delete on public.pedidos to authenticated;

create or replace function public.restringir_actualizacion_pedido_empleado()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin()
     and not public.is_owner()
     and (
       to_jsonb(new) - array['estado', 'updated_at']
       is distinct from
       to_jsonb(old) - array['estado', 'updated_at']
     ) then
    raise exception 'El empleado sólo puede cambiar el estado del pedido';
  end if;

  return new;
end;
$$;

revoke all on function public.restringir_actualizacion_pedido_empleado() from public;

drop trigger if exists restringir_actualizacion_pedido_empleado on public.pedidos;
create trigger restringir_actualizacion_pedido_empleado
before update on public.pedidos
for each row execute function public.restringir_actualizacion_pedido_empleado();

create or replace function public.crear_pedido(
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
returns table (numero_pedido bigint, token_publico uuid, fecha timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pedido public.pedidos%rowtype;
  v_subtotal_calculado numeric;
begin
  if char_length(trim(coalesce(p_cliente_nombre, ''))) not between 2 and 120 then
    raise exception 'Nombre inválido';
  end if;

  if char_length(regexp_replace(coalesce(p_cliente_telefono, ''), '[^0-9]', '', 'g')) not between 10 and 15 then
    raise exception 'Teléfono inválido';
  end if;

  if jsonb_typeof(p_productos) <> 'array'
     or jsonb_array_length(p_productos) < 1
     or jsonb_array_length(p_productos) > 100
     or pg_column_size(p_productos) > 100000 then
    raise exception 'Productos inválidos';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_productos) as item
    where coalesce(item->>'nombre', '') = ''
       or coalesce(item->>'cantidad', '') !~ '^[1-9][0-9]*$'
       or coalesce(item->>'precio', '') !~ '^[0-9]+([.][0-9]+)?$'
       or (item->>'cantidad')::integer > 1000
       or (item->>'precio')::numeric > 100000000
  ) then
    raise exception 'Detalle de productos inválido';
  end if;

  select coalesce(sum(
    (item->>'cantidad')::integer * (item->>'precio')::numeric
  ), 0)
  into v_subtotal_calculado
  from jsonb_array_elements(p_productos) as item;

  if p_subtotal < 0
     or p_costo_envio < 0
     or abs(v_subtotal_calculado - p_subtotal) > 0.01
     or abs((p_subtotal + p_costo_envio) - p_total) > 0.01 then
    raise exception 'Totales inconsistentes';
  end if;

  if p_metodo_entrega not in ('Delivery', 'Retiro en local') then
    raise exception 'Método de entrega inválido';
  end if;

  if p_metodo_pago not in ('Efectivo', 'Transferencia') then
    raise exception 'Método de pago inválido';
  end if;

  if p_metodo_entrega = 'Delivery'
     and char_length(trim(coalesce(p_direccion_completa, ''))) < 4 then
    raise exception 'Dirección inválida';
  end if;

  insert into public.pedidos (
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
  ) values (
    trim(p_cliente_nombre),
    trim(p_cliente_telefono),
    p_productos,
    p_subtotal,
    p_costo_envio,
    p_total,
    nullif(trim(coalesce(p_calle, '')), ''),
    nullif(trim(coalesce(p_piso_dpto, '')), ''),
    null,
    nullif(trim(coalesce(p_direccion_completa, '')), ''),
    p_metodo_entrega,
    p_metodo_pago,
    nullif(trim(coalesce(p_notas, '')), '')
  )
  returning * into v_pedido;

  return query select v_pedido.numero_pedido, v_pedido.token_publico, v_pedido.fecha;
end;
$$;

revoke all on function public.crear_pedido(
  text, text, jsonb, numeric, numeric, numeric,
  text, text, text, text, text, text
) from public;
grant execute on function public.crear_pedido(
  text, text, jsonb, numeric, numeric, numeric,
  text, text, text, text, text, text
) to anon, authenticated;

create or replace function public.obtener_comprobante(
  p_numero_pedido bigint,
  p_token_publico uuid
)
returns table (
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
language sql
stable
security definer
set search_path = public
as $$
  select
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
  from public.pedidos p
  where p.numero_pedido = p_numero_pedido
    and p.token_publico = p_token_publico
  limit 1;
$$;

revoke all on function public.obtener_comprobante(bigint, uuid) from public;
grant execute on function public.obtener_comprobante(bigint, uuid) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Fechas de actualización
-- ---------------------------------------------------------------------------

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.productos;
drop trigger if exists set_productos_updated_at on public.productos;
create trigger set_productos_updated_at
before update on public.productos
for each row execute function public.handle_updated_at();

drop trigger if exists set_ofertas_updated_at on public.ofertas;
create trigger set_ofertas_updated_at
before update on public.ofertas
for each row execute function public.handle_updated_at();

drop trigger if exists set_pedidos_updated_at on public.pedidos;
create trigger set_pedidos_updated_at
before update on public.pedidos
for each row execute function public.handle_updated_at();

-- ---------------------------------------------------------------------------
-- Imágenes
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'productos-imagenes',
  'productos-imagenes',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Imágenes públicas" on storage.objects;
drop policy if exists "Administrador sube imágenes" on storage.objects;
drop policy if exists "Administrador actualiza imágenes" on storage.objects;
drop policy if exists "Administrador elimina imágenes" on storage.objects;

create policy "Imágenes públicas"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'productos-imagenes');

create policy "Administrador sube imágenes"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'productos-imagenes' and public.is_owner());

create policy "Administrador actualiza imágenes"
on storage.objects
for update
to authenticated
using (bucket_id = 'productos-imagenes' and public.is_owner())
with check (bucket_id = 'productos-imagenes' and public.is_owner());

create policy "Administrador elimina imágenes"
on storage.objects
for delete
to authenticated
using (bucket_id = 'productos-imagenes' and public.is_owner());
