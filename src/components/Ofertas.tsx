import { ShoppingCart, Plus, Minus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useOfertas } from "@/hooks/useCatalog";
import type { Oferta } from "@/types/store";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface OfertasProps {
  searchTerm?: string;
}

const Ofertas = ({ searchTerm = "" }: OfertasProps) => {
  const { data: ofertas = [], isLoading, error } = useOfertas();
  const { addToCart } = useCart();
  const [selectedOffer, setSelectedOffer] = useState<Oferta | null>(null);
  const [modalQuantity, setModalQuantity] = useState<number>(1);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedOffer(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    if (selectedOffer) {
      setModalQuantity(1);
    }
  }, [selectedOffer]);

  const handleAddToCartFromModal = (offer: Oferta) => {
    addToCart({
      id: offer.id,
      tipo: "oferta",
      nombre: `Oferta: ${offer.nombre}`,
      precio: offer.precioActual,
    }, modalQuantity);
    setSelectedOffer(null);
  };
  
  const ofertasFiltradas = searchTerm.trim() === ''
    ? ofertas
    : ofertas.filter(o => 
        o.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.desc.toLowerCase().includes(searchTerm.toLowerCase())
      );

  if (isLoading || error || ofertasFiltradas.length === 0) {
    return null;
  }

  return (
  <section id="ofertas" className="bg-background py-16">
    <div className="container mx-auto px-4">
      <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary text-center mb-10">
        OFERTAS DE LA SEMANA
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {ofertasFiltradas.map((o) => (
          <div key={o.nombre} className="card-market p-6 relative flex flex-col h-full overflow-hidden cursor-pointer group" onClick={() => setSelectedOffer(o)}>
            <span className="badge-offer absolute top-4 right-4 z-10">OFERTA</span>
            
            <div className="w-full h-48 sm:h-56 mb-4 rounded-md overflow-hidden relative bg-[#000000] flex items-center justify-center p-1">
              <img src={o.img} alt={o.nombre} className="w-full h-full object-contain" loading="lazy" />
            </div>
            
            <div className="flex-1 flex flex-col pt-2 text-center">
              <h3 className="font-body text-lg md:text-xl font-bold text-[#222222] uppercase tracking-wide mb-1">{o.nombre}</h3>
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="font-heading text-xl font-bold text-[#CC0000]">{o.ahora}</span>
                <span className="font-body text-sm text-[#999999] line-through">{o.antes}</span>
              </div>
              <div className="mt-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart({
                      id: o.id,
                      tipo: "oferta",
                      nombre: `Oferta: ${o.nombre}`,
                      precio: o.precioActual,
                    }, 1);
                  }}
                  className="w-full bg-[#CC0000] text-white h-[40px] rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#b30000] transition-colors shadow-sm"
                >
                  <Plus size={18} />
                  Agregar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Ofertas */}
      {selectedOffer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={() => setSelectedOffer(null)} />
          <div className="relative bg-white w-[95%] sm:max-w-[90%] md:max-w-4xl rounded-[12px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[92vh] md:max-h-[85vh]">
            <button 
              onClick={() => setSelectedOffer(null)} 
              className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white transition-colors border shadow-sm text-gray-700"
              aria-label="Cerrar modal"
            >
              <X size={24} />
            </button>
            
            <div className="w-full md:w-1/2 bg-[#FAFAFA] p-[12px] flex items-center justify-center min-h-[250px] sm:min-h-[300px] md:min-h-0 border-b md:border-b-0 md:border-r border-[#e0e0e0] max-h-[40vh] md:max-h-none relative">
              {selectedOffer.images && selectedOffer.images.length > 0 ? (
                <div className="w-full h-full flex flex-col">
                  <Carousel setApi={setApi} className="w-full flex-1">
                    <CarouselContent className="h-full">
                      {selectedOffer.images.map((img: string, idx: number) => (
                        <CarouselItem key={idx} className="flex items-center justify-center">
                          <img src={img} alt={selectedOffer.nombre} className="w-full h-full object-contain max-h-[30vh] md:max-h-[50vh]" />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                      <div className="pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                        <CarouselPrevious className="static translate-y-0 bg-white/80 hover:bg-white z-40 h-10 w-10 shadow-md border-none" />
                      </div>
                      <div className="pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                        <CarouselNext className="static translate-y-0 bg-white/80 hover:bg-white z-40 h-10 w-10 shadow-md border-none" />
                      </div>
                    </div>
                  </Carousel>
                  
                  {/* Dots */}
                  {count > 1 && (
                    <div className="flex justify-center gap-2 mt-4 pb-2">
                      {Array.from({ length: count }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => api?.scrollTo(i)}
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                            current === i ? "bg-[#CC0000] w-6" : "bg-gray-300 hover:bg-gray-400"
                          }`}
                          aria-label={`Ir a imagen ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <img src={selectedOffer.img} alt={selectedOffer.nombre} className="w-full h-full object-contain max-h-[36vh] md:max-h-none" />
              )}
            </div>
            
            <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-10 flex flex-col overflow-y-auto">
              <div className="flex-1">
                <span className="badge-offer mb-4 inline-block">OFERTA</span>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#222222] leading-tight mb-4 uppercase">
                  {selectedOffer.nombre}
                </h2>
                <p className="font-body text-[#555555] text-base leading-relaxed mb-6">
                  {selectedOffer.desc}
                </p>
                
                <div className="h-[1px] bg-[#e0e0e0] w-full mb-6" />
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[#2E7D32] font-bold">
                    Disponible · {selectedOffer.stock} unidades
                  </span>
                </div>
                
                <div className="mb-8 flex items-baseline justify-center gap-4">
                  <span className="font-heading text-3xl md:text-4xl font-bold text-[#CC0000]">
                    {selectedOffer.ahora}
                  </span>
                  <span className="font-body text-xl text-gray-400 line-through">
                    {selectedOffer.antes}
                  </span>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-4">
                <div className="flex items-center justify-center gap-4 bg-white border border-[#e0e0e0] rounded-xl p-1 w-full max-w-[240px] mx-auto shadow-sm">
                  <button
                    onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                    disabled={modalQuantity <= 1}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#555555] hover:bg-[#F5F5F5] rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="font-body flex-1 text-center text-[18px] font-bold text-[#222222]">
                    {modalQuantity}
                  </span>
                  <button
                    onClick={() => setModalQuantity(Math.min(selectedOffer.stock, modalQuantity + 1))}
                    disabled={modalQuantity >= selectedOffer.stock}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#555555] hover:bg-[#F5F5F5] rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <button
                  onClick={() => handleAddToCartFromModal(selectedOffer)}
                  className="bg-[#CC0000] text-[#FFFFFF] w-full min-h-[48px] rounded-[8px] font-bold text-lg hover:bg-[#b30000] transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={22} />
                  Agregar al Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </section>
  );
};

export default Ofertas;
