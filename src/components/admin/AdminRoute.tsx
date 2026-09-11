import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { checkIsAdmin } from "@/services/admin";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<"loading" | "allowed" | "signed-out" | "denied">("loading");

  useEffect(() => {
    let active = true;

    const verify = async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      if (!data.session) {
        setStatus("signed-out");
        return;
      }

      try {
        setStatus(await checkIsAdmin() ? "allowed" : "denied");
      } catch {
        setStatus("denied");
      }
    };

    verify();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (!session) {
        setStatus("signed-out");
        return;
      }

      window.setTimeout(() => {
        if (active) void verify();
      }, 0);
    });
    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (status === "loading") {
    return <div className="min-h-screen grid place-items-center">Verificando acceso…</div>;
  }
  if (status === "signed-out") return <Navigate to="/admin/login" replace />;
  if (status === "denied") {
    return (
      <div className="min-h-screen grid place-items-center p-6 bg-gray-50">
        <div className="max-w-md bg-white border rounded-2xl p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-gray-900">Acceso no autorizado</h1>
          <p className="mt-3 text-gray-600">Esta cuenta no está registrada como administradora de Tonio MiniMarket.</p>
          <button
            onClick={async () => {
              const { error } = await supabase.auth.signOut({ scope: "local" });
              if (!error) setStatus("signed-out");
            }}
            className="mt-6 bg-primary text-white px-5 py-3 rounded-xl font-bold"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  return children;
}
