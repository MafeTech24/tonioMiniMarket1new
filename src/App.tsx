import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "./context/CartContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Comprobante from "./pages/Comprobante.tsx";
import Mantenimiento from "./components/Mantenimiento.tsx";

const queryClient = new QueryClient();

// Para activar el modo mantenimiento: ir a Vercel > Settings > Environment Variables,
// agregar VITE_MAINTENANCE_MODE=true, y hacer Redeploy desde el dashboard.
// Para desactivarlo: cambiar el valor a false (o eliminar la variable) y volver a hacer Redeploy.
const App = () => {
  if (import.meta.env.VITE_MAINTENANCE_MODE === "true") {
    return <Mantenimiento />;
  }

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
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/comprobante/:numeroPedido" element={<Comprobante />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
