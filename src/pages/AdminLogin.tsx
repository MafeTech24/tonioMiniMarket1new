import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { supabase } from "@/lib/supabase";

const formatAuthError = (authError: {
  message?: string;
  code?: string;
  status?: number;
}) => {
  if (!import.meta.env.DEV) {
    return "No pudimos iniciar sesión. Revisá el correo y la contraseña.";
  }

  return [
    `message: ${authError.message ?? "(sin mensaje)"}`,
    `code: ${authError.code ?? "(sin código)"}`,
    `status: ${authError.status ?? "(sin estado HTTP)"}`,
  ].join("\n");
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetStatus, setResetStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [resetError, setResetError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: authError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(formatAuthError(authError));
        return;
      }

      navigate("/admin", { replace: true });
    } catch (unexpectedError) {
      const error =
        unexpectedError instanceof Error
          ? unexpectedError
          : new Error("Error desconocido durante la autenticación.");

      setError(
        formatAuthError({
          message: error.message,
          code: "unexpected_or_network_error",
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setResetError("");

    if (!email.trim()) {
      setResetError("Ingresá tu correo electrónico arriba y volvé a tocar ¿olvidaste tu contraseña?");
      return;
    }

    setResetStatus("sending");

    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: `${window.location.origin}/admin/login` },
      );

      if (authError) {
        setResetError(formatAuthError(authError));
        setResetStatus("idle");
        return;
      }

      setResetStatus("sent");
    } catch (unexpectedError) {
      const error =
        unexpectedError instanceof Error
          ? unexpectedError
          : new Error("Error desconocido al solicitar la recuperación.");

      setResetError(
        formatAuthError({
          message: error.message,
          code: "unexpected_or_network_error",
        }),
      );
      setResetStatus("idle");
    }
  };

  return (
    <main className="min-h-screen grid place-items-center bg-gray-100 px-4">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-2xl shadow-xl border p-8">
        <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 text-primary grid place-items-center">
          <LockKeyhole size={28} />
        </div>
        <h1 className="mt-5 text-center text-3xl font-black text-gray-900">Administración</h1>
        <p className="mt-2 text-center text-gray-500">Acceso exclusivo de Tonio MiniMarket</p>

        <label className="block mt-8 text-sm font-bold text-gray-700">
          Correo electrónico
          <input
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-xl border px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
        <label className="block mt-4 text-sm font-bold text-gray-700">
          Contraseña
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-xl border px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>

        <div className="mt-3 text-right">
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={resetStatus === "sending"}
            className="text-sm font-bold text-gray-500 hover:text-primary disabled:opacity-60"
          >
            {resetStatus === "sending" ? "Enviando…" : "¿Olvidaste tu contraseña?"}
          </button>
        </div>

        {resetStatus === "sent" && (
          <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm font-semibold text-green-700">
            Si el correo está registrado, te enviamos un enlace para restablecer la contraseña. Revisá tu bandeja de entrada (y spam).
          </p>
        )}
        {resetError && <p className="mt-4 whitespace-pre-wrap rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{resetError}</p>}

        {error && <p className="mt-4 whitespace-pre-wrap rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-primary py-3.5 font-black text-white disabled:opacity-60"
        >
          {loading ? "Ingresando…" : "Ingresar"}
        </button>
        <Link to="/" className="mt-5 block text-center text-sm font-bold text-gray-500 hover:text-primary">
          Volver a la tienda
        </Link>
      </form>
    </main>
  );
}