import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClipboardList, LayoutDashboard, LogOut, Package, Percent, Store, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { fetchCurrentAdminProfile, type AdminProfile } from "@/services/admin";
import ResumenPanel from "@/components/admin/ResumenPanel";
import ProductsPanel from "@/components/admin/ProductsPanel";
import OffersPanel from "@/components/admin/OffersPanel";
import OrdersPanel from "@/components/admin/OrdersPanel";
import ClientsPanel from "@/components/admin/ClientsPanel";

type Section = "resumen" | "productos" | "ofertas" | "pedidos" | "clientes";

const sections: Array<{ id: Section; label: string; icon: typeof Package }> = [
  { id: "productos", label: "Productos", icon: Package },
  { id: "ofertas", label: "Ofertas", icon: Percent },
  { id: "pedidos", label: "Pedidos", icon: ClipboardList },
  { id: "clientes", label: "Clientes", icon: Users },
  { id: "resumen", label: "Resumen", icon: LayoutDashboard },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("pedidos");
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [profileError, setProfileError] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const isOwner = profile?.rol === "propietario";
  const allowedSections = useMemo(
    () => isOwner ? sections : sections.filter(({ id }) => id === "pedidos"),
    [isOwner],
  );

  useEffect(() => {
    let active = true;
    fetchCurrentAdminProfile()
      .then((data) => {
        if (!active) return;
        setProfile(data);
        if (data.rol === "propietario") setSection("resumen");
      })
      .catch(() => {
        if (active) setProfileError(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);

    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) {
      setIsSigningOut(false);
      toast.error("No pudimos cerrar la sesión. Intentá nuevamente.");
      return;
    }

    navigate("/admin/login", { replace: true });
  };

  if (!profile && !profileError) {
    return <div className="min-h-screen grid place-items-center bg-gray-100">Cargando panel…</div>;
  }

  if (profileError || !profile) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-100 p-6">
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-black">No pudimos cargar tus permisos</h1>
          <button onClick={handleSignOut} disabled={isSigningOut} className="mt-5 rounded-xl bg-gray-900 px-4 py-2.5 font-bold text-white disabled:opacity-60">{isSigningOut ? "Cerrando…" : "Cerrar sesión"}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-40 border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-white"><Store /></div><div><h1 className="text-xl font-black text-gray-900">Tonio MiniMarket</h1><p className="text-xs font-bold uppercase tracking-wide text-gray-400">{isOwner ? (profile.nombre || profile.email) : "Usuario Autorizado"} · {isOwner ? "Propietario" : "Empleado"}</p></div></div>
          <div className="flex items-center gap-2"><Link to="/" className="rounded-xl border px-4 py-2.5 text-sm font-bold text-gray-600">Ver tienda</Link><button onClick={handleSignOut} disabled={isSigningOut} className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"><LogOut size={17} /> {isSigningOut ? "Saliendo…" : "Salir"}</button></div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-7">
        <nav className="mb-7 flex gap-2 overflow-x-auto rounded-2xl border bg-white p-2">
          {allowedSections.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setSection(id)} className={`flex min-w-fit flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold ${section === id ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"}`}><Icon size={19} /> {label}</button>)}
        </nav>

        {isOwner && section === "resumen" && <ResumenPanel onVerPedidos={() => setSection("pedidos")} />}
        {isOwner && section === "productos" && <ProductsPanel />}
        {isOwner && section === "ofertas" && <OffersPanel />}
        {section === "pedidos" && <OrdersPanel isOwner={isOwner} />}
        {isOwner && section === "clientes" && <ClientsPanel />}
      </div>
    </div>
  );
}
