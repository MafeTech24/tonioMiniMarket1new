import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export const PASSWORD_RECOVERY_MARKER = "tonio-admin-password-recovery";

function currentUrlIsPasswordRecovery() {
  return /(?:^|[?#&])type=recovery(?:&|$)/.test(
    `${window.location.search}${window.location.hash}`,
  );
}

export default function PasswordRecoveryRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let active = true;

    const openResetScreen = () => {
      if (!active) return;
      sessionStorage.setItem(PASSWORD_RECOVERY_MARKER, "true");
      if (location.pathname !== "/admin/reset-password") {
        navigate("/admin/reset-password", { replace: true });
      }
    };

    const recoveryUrl = currentUrlIsPasswordRecovery();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) openResetScreen();
    });

    if (recoveryUrl) {
      // getSession espera a que Supabase procese el enlace antes de retirar sus parámetros.
      void supabase.auth.getSession().then(({ data }) => {
        if (data.session) openResetScreen();
      });
    }

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, [location.pathname, navigate]);

  return null;
}
