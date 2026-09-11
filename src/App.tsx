import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "./context/CartContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Mantenimiento from "./components/Mantenimiento.tsx";
import PasswordRecoveryRedirect from "./components/admin/PasswordRecoveryRedirect.tsx";

const Comprobante = lazy(() => import("./pages/Comprobante.tsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.tsx"));
const AdminResetPassword = lazy(() => import("./pages/AdminResetPassword.tsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.tsx"));
const AdminRoute = lazy(() => import("./components/admin/AdminRoute.tsx"));

const queryClient = new QueryClient();

// Para activar el modo mantenimiento: ir a Vercel > Settings > Environment Variables,
// agregar VITE_MAINTENANCE_MODE=true, y hacer Redeploy desde el dashboard.
// Para desactivarlo: cambiar el valor a false (o eliminar la variable) y volver a hacer Redeploy.
const App = () => {
  const maintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === "true";

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <PasswordRecoveryRedirect />
              <Suspense fallback={<div className="min-h-screen grid place-items-center">Cargando…</div>}>
                <Routes>
                  <Route path="/" element={maintenanceMode ? <Mantenimiento /> : <Index />} />
                  <Route path="/comprobante/:numeroPedido" element={<Comprobante />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/reset-password" element={<AdminResetPassword />} />
                  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
