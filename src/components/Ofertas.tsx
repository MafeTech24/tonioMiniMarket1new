import { ShoppingCart, Plus, Minus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const ofertas = [
  /*{ 
    nombre: "Promo Mermelada Orieta Durazno", 
    antes: "$2.200", 
    ahora: "$1.600", 
    desc: "Mermelada de durazno Orieta en pote. Elaborada con frutas seleccionadas para disfrutar en tus desayunos y meriendas con el sabor más dulce y natural.", 
    img: "/products/promoMermelada.png",
    stock: 20,
    categoria: "Almacén"
  },*/
  { 
    nombre: "Promo Hamburguesas Paty", 
    antes: "$10.500", 
    ahora: "$8.500", 
    desc: "¡La hamburguesada perfecta en casa! Incluye: 4 Hamburguesas Paty Express + 4 Panes de hamburguesa + 1 Mayonesa Hellmann's 125g + 1 Mostaza o Ketchup Danica 60g. Todo listo para armar las mejores hamburguesas caseras. Ideal para el fin de semana con toda la familia.", 
    img: "/products/promoHamburguesa5.png",
    /*images: ["/products/promoHamburguesa1.png", "/products/promoHamburguesa2.png", "/products/promoHamburguesa3.png", "/products/promoHamburguesa4.png"],*/
    stock: 12,
    categoria: "Almacén"
  },
  { 
    nombre: "Promo Tarta", 
    antes: "$8.500", 
    ahora: "$6500", 
    desc: "¡Todo para una tarta en familia! Incluye: 1 Pascualina San Vicente + 200g Jamón Cocido Tirolesa + 200g Queso Cremoso + 2 Huevos frescos. Una promo completa para preparar una tarta casera deliciosa. Ideal para el almuerzo o cena familiar.", 
    img: "/products/ofertaTarta.png",
    /*images: ["/products/promoTarta1.png", "/products/promoTarta2.png", "/products/promoTarta3.png"],*/
    stock: 10,
    categoria: "Almacén"
  },
  { 
    nombre: "Oferta Pizza", 
    antes: "$11.000", 
    ahora: "$8.000", 
    desc: "¡Combo ideal para tu noche de pizza! Incluye: 2 Pre pizzas + 400g Muzzarella de primera calidad + 150g Jamón Cocido Tirolesa + 100g Aceitunas seleccionadas. Todo lo que necesitás para armar dos pizzas increíbles en minutos.", 
    img: "/products/oferta_pizza2.png",
    stock: 15,
    categoria: "Fiambrería"
  },
  { 
    nombre: "Oferta Picada Premium", 
    antes: "$16.000", 
    ahora: "$13.000", 
    desc: "La mejor selección para una picada inolvidable. Incluye: 2 Tiras de pan de Panificación Modelo + 100g Jamón Cocido Colonial + 100g Salame + 100g Mortadela Paladini + 100g Bondiola Colonial + 100g Queso La Paulina + 150g Papas Danal + 100g Maní (común o saborizado). Calidad premium para compartir.", 
    img: "/products/ofertaPicadaPremium3.png",
    stock: 8,
    categoria: "Fiambrería"
  },
  { 
    nombre: "Oferta Picada Económica", 
    antes: "$11.000", 
    ahora: "$9.300", 
    desc: "Picada completa al mejor precio. Incluye: 2 Tiras de pan + 100g Jamón Tirolesa + 100g Mortadela Tirolesa + 100g Patita de cerdo Tirolesa + 100g Bondiola + 100g Queso Makis + 100g Papas Danal + 100g Maní. ¡No te quedes sin la tuya!", 
    img: "/products/ofertaPicadaEconomica2.png",
    stock: 10,
    categoria: "Fiambrería"
  },
  /*{ 
    nombre: "Pollo Entero", 
    antes: "$4.500", 
    ahora: "$3.800", 
    desc: "Fresco del día, aprox 2.5kg", 
    img: "/products/polleria/polloEntero.png",
    stock: 12,
    categoria: "Pollería"
  },
  { 
    nombre: "Pack Almacén", 
    antes: "$12.000", 
    ahora: "$9.900", 
    desc: "Arroz, aceite, fideos, harina y más", 
    img: "/products/pack_almacen_1775092426601.png",
    stock: 15,
    categoria: "Almacén"
  },*/
  { 
    nombre: "Pata Muslo 2kg", 
    antes: "$11.200", 
    ahora: "$10.400", 
    desc: "2kg de pata muslo de pollo fresco. Ideal para el horno, la parrilla o guisos. Precio especial por llevar 2kg.", 
    img: "/products/polleria/pataMuslo.png",
    stock: 20,
    categoria: "Pollería"
  },
  { 
    nombre: "Pata Muslo 3kg", 
    antes: "$16.800", 
    ahora: "$14.700", 
    desc: "3kg de pata muslo de pollo fresco. El formato más rendidor para toda la semana. Precio especial por llevar 3kg.", 
    img: "/products/polleria/pataMuslo.png",
    stock: 20,
    categoria: "Pollería"
  },
  { 
    nombre: "Pata Muslo 4kg", 
    antes: "$22.400", 
    ahora: "$19.000", 
    desc: "4kg de pata muslo de pollo fresco. El mejor precio por mayor cantidad. Ideal para familias grandes o congelar.", 
    img: "/products/polleria/pataMuslo.png",
    stock: 20,
    categoria: "Pollería"
  },
  { 
    nombre: "Alitas de Pollo con Rancho 2kg", 
    antes: "$6.400", 
    ahora: "$5.800", 
    desc: "2kg de alitas de pollo con Rancho frescas. Perfectas para la parrilla o el horno. Precio especial por llevar 2kg.", 
    img: "/products/polleria/alitasPolloConRancho.png",
    stock: 20,
    categoria: "Pollería"
  },
  { 
    nombre: "Alitas de Pollo con Rancho 3kg", 
    antes: "$9.600", 
    ahora: "$7.500", 
    desc: "3kg de alitas de pollo con Rancho frescas. El formato más conveniente para compartir en familia. Precio especial por llevar 3kg.", 
    img: "/products/polleria/alitasPolloConRancho.png",
    stock: 20,
    categoria: "Pollería"
  },
  { 
    nombre: "Alitas de Pollo Sin Rancho 2kg", 
    antes: "$13.000", 
    ahora: "$12.000", 
    desc: "2kg de alitas de pollo sin rancho, limpias y listas para cocinar. Precio especial por llevar 2kg.", 
    img: "/products/polleria/alitasPolloSinRancho.png",
    stock: 20,
    categoria: "Pollería"
  },
  { 
    nombre: "Pata Muslo Deshuesada 2kg", 
    antes: "$25.600", 
    ahora: "$24.800", 
    desc: "2kg de pata muslo deshuesada, sin hueso y lista para cocinar. Práctica y rendidora. Precio especial por llevar 2kg.", 
    img: "/products/polleria/pataMusloDeshuesada.png",
    stock: 20,
    categoria: "Pollería"
  },
  { 
    nombre: "Pechugas 3kg", 
    antes: "$39.600", 
    ahora: "$37.500", 
    desc: "3kg de pechugas de pollo frescas, deshuesadas y sin piel. Precio especial por llevar 3kg. Ideal para congelar.", 
    img: "/products/polleria/pechugasdePollo.png",
    stock: 20,
    categoria: "Pollería"
  },
  { 
    nombre: "Milanesas de Pollo con Provenzal 2kg", 
    antes: "$22.800", 
    ahora: "$21.000", 
    desc: "2kg de milanesas de pollo con provenzal, elaboradas con pechuga de primera calidad. Precio especial por llevar 2kg.", 
    img: "/products/polleria/milaPolloConProvenzal.png",
    stock: 20,
    categoria: "Pollería"
  },
  { 
    nombre: "Milanesas de Pollo Sin Provenzal 2kg", 
    antes: "$22.800", 
    ahora: "$21.000", 
    desc: "2kg de milanesas de pollo sin provenzal, elaboradas con pechuga de primera calidad. Precio especial por llevar 2kg.", 
    img: "/products/polleria/milaPolloSinProvenzal.png",
    stock: 20,
    categoria: "Pollería"
  },
  {
    nombre: "Hamburguesas de Carne 2kg",
    antes: "$26.800",
    ahora: "$26.000",
    desc: "2kg de hamburguesas de carne congeladas de primera calidad. Ideal para tener stock en casa o para tus parrilladas. Precio especial por llevar 2kg.",
    img: "/products/congelados/hamburguesasCarne.png",
    stock: 20,
    categoria: "Congelados"
  },
  {
    nombre: "Milanesas de Carne 2kg",
    antes: "$35.000",
    ahora: "$32.600",
    desc: "2kg de milanesas de carne, listas para cocinar. La opción más rendidora para toda la familia. Precio especial por llevar 2kg.",
    img: "/products/polleria/milasCarne.png",
    stock: 20,
    categoria: "Pollería"
  }
];

interface OfertasProps {
  searchTerm?: string;
}

const Ofertas = ({ searchTerm = "" }: OfertasProps) => {
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(ofertas.map(o => [o.nombre, 1]))
  );
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
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
      setModalQuantity(quantities[selectedOffer.nombre] || 1);
    }
  }, [selectedOffer]);

  const updateQuantity = (nombre: string, delta: number, max: number) => {
    setQuantities(prev => ({
      ...prev,
      [nombre]: Math.min(max, Math.max(1, prev[nombre] + delta))
    }));
  };

  const handleAddToCartFromModal = (o: any) => {
    addToCart({ nombre: `Oferta: ${o.nombre}`, precio: o.ahora }, modalQuantity);
    setSelectedOffer(null);
  };
  
  const ofertasFiltradas = searchTerm.trim() === ''
    ? ofertas
    : ofertas.filter(o => 
        o.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.desc.toLowerCase().includes(searchTerm.toLowerCase())
      );

  if (ofertasFiltradas.length === 0) {
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
              <img src={(o as any).img} alt={o.nombre} className="w-full h-full object-contain" loading="lazy" />
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
                    addToCart({ nombre: `Oferta: ${o.nombre}`, precio: o.ahora }, 1);
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
              {'images' in selectedOffer ? (
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
                <img src={(selectedOffer as any).img} alt={selectedOffer.nombre} className="w-full h-full object-contain max-h-[36vh] md:max-h-none" />
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
