import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { PASSWORD_RECOVERY_MARKER } from "@/components/admin/PasswordRecoveryRedirect";
import { supabase } from "@/lib/supabase";

const MIN_PASSWORD_LENGTH = 8;

type RecoveryStatus = "checking" | "ready" | "invalid" | "saving" | "saved";

export default function AdminResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [status, setStatus] = useState<RecoveryStatus>("checking");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const hasRecoveryMarker = () =>
      sessionStorage.getItem(PASSWORD_RECOVERY_MARKER) === "true";

    const acceptRecoverySession = () => {
      if (active) setStatus("ready");
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        sessionStorage.setItem(PASSWORD_RECOVERY_MARKER, "true");
        acceptRecoverySession();
      }
    });

    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;
      if (!sessionError && data.session && hasRecoveryMarker()) {
        acceptRecoverySession();
      } else {
        setStatus("invalid");
      }
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    if (password !== confirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setStatus("saving");
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setStatus("ready");
      setError("No pudimos actualizar la contraseña. Solicitá un enlace nuevo e intentá nuevamente.");
      return;
    }

    setPassword("");
    setConfirmation("");
    setStatus("saved");
    sessionStorage.removeItem(PASSWORD_RECOVERY_MARKER);

    const { error: signOutError } = await supabase.auth.signOut({ scope: "local" });
    if (signOutError) {
      setError("La contraseña se guardó, pero no pudimos cerrar la sesión. Cerrala antes de continuar.");
      return;
    }

    window.setTimeout(() => navigate("/admin/login", { replace: true }), 1200);
  };

  if (status === "checking") {
    return <main className="min-h-screen grid place-items-center bg-gray-100">Validando enlace…</main>;
  }

  if (status === "invalid") {
    return (
      <main className="min-h-screen grid place-items-center bg-gray-100 px-4">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-black text-gray-900">Enlace inválido o vencido</h1>
          <p className="mt-3 text-gray-600">Solicitá un nuevo enlace de recuperación para continuar.</p>
          <button onClick={() => navigate("/admin/login", { replace: true })} className="mt-6 rounded-xl bg-primary px-5 py-3 font-bold text-white">
            Volver al acceso
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen grid place-items-center bg-gray-100 px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-xl">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
          <KeyRound size={28} />
        </div>
        <h1 className="mt-5 text-center text-3xl font-black text-gray-900">Nueva contraseña</h1>
        <p className="mt-2 text-center text-gray-500">Definí una contraseña de al menos {MIN_PASSWORD_LENGTH} caracteres.</p>

        {status === "saved" ? (
          error ? (
            <p className="mt-8 rounded-xl bg-red-50 p-4 text-center font-semibold text-red-700">{error}</p>
          ) : (
            <p className="mt-8 rounded-xl bg-green-50 p-4 text-center font-semibold text-green-700">
              Contraseña actualizada. Cerramos la sesión y te llevamos al acceso…
            </p>
          )
        ) : (
          <>
            <label className="mt-8 block text-sm font-bold text-gray-700">
              Nueva contraseña
              <input
                type="password"
                autoComplete="new-password"
                minLength={MIN_PASSWORD_LENGTH}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>
            <label className="mt-4 block text-sm font-bold text-gray-700">
              Confirmar nueva contraseña
              <input
                type="password"
                autoComplete="new-password"
                minLength={MIN_PASSWORD_LENGTH}
                required
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                className="mt-2 w-full rounded-xl border px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>

            {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={status === "saving"}
              className="mt-6 w-full rounded-xl bg-primary py-3.5 font-black text-white disabled:opacity-60"
            >
              {status === "saving" ? "Guardando…" : "Guardar contraseña"}
            </button>
          </>
        )}
      </form>
    </main>
  );
}
