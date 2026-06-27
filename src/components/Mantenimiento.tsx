import logo from "../assets/logo.png";
import { Wrench } from "lucide-react";

export default function Mantenimiento() {
  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#CC0000] to-[#990000] text-white p-4 font-body relative overflow-hidden">
      {/* Decorative background elements for premium feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-white/5 blur-3xl pointer-events-none animate-pulse duration-5000" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-black/15 blur-3xl pointer-events-none" />

      {/* Main card */}
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center space-y-6 transform transition-all duration-300 hover:scale-[1.01]">
        
        {/* Brand Logo Container */}
        <div className="bg-white p-4 rounded-xl shadow-lg inline-block transform -rotate-2 hover:rotate-0 transition-transform duration-300">
          <img 
            src={logo} 
            alt="Tonio MiniMarket" 
            className="h-16 md:h-20 w-auto object-contain"
          />
        </div>

        {/* Maintenance Icon */}
        <div className="bg-white/15 p-3.5 rounded-full animate-bounce mt-4">
          <Wrench className="h-8 w-8 text-white" />
        </div>

        {/* Heading */}
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold tracking-wide text-white drop-shadow-md">
          ¡Ya volvemos!
        </h1>

        {/* Divider */}
        <div className="w-16 h-1 bg-white/40 rounded-full" />

        {/* Description Text */}
        <p className="text-white/95 text-base md:text-lg leading-relaxed font-semibold">
          Estamos haciendo mejoras en el sitio. Volveremos a estar disponibles muy pronto. Gracias por tu paciencia.
        </p>

        {/* Accent status indicator */}
        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-white text-[#CC0000] uppercase tracking-wider animate-pulse shadow-sm">
          Modo Mantenimiento
        </span>
      </div>

      {/* Copyright Footer */}
      <div className="absolute bottom-4 text-xs text-white/50 font-medium tracking-wider">
        © {new Date().getFullYear()} Tonio MiniMarket. Todos los derechos reservados.
      </div>
    </div>
  );
}
