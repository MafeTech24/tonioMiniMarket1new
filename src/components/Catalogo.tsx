import { useState, useEffect } from "react";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useProductos } from "@/hooks/useCatalog";
import type { Presentacion, Producto } from "@/types/store";

const CATEGORIAS = [
  "Todos",
  "Almacén",
  "Bebidas",
  "Congelados",
  "Kiosco",
  "Panificación",
  "Pollería",
  "Comidas listas",
  "Limpieza y Perfumería",
  // "Mascotas"
];

const SUBCATEGORIAS: Record<string, string[]> = {
  "Almacén": ["Aderezos", "Condimentos", "Conservas", "Desayuno", "Fiambres", "Lácteos", /*"Panadería",*/ "Pastas frescas y secas"],
  "Bebidas": ["Con alcohol", "Sin alcohol"]
};

interface CatalogoProps {
  searchTerm?: string;
}

const Catalogo = ({ searchTerm = "" }: CatalogoProps) => {
  const { data: productos = [], isLoading, error } = useProductos();
  const [selectedCat, setSelectedCat] = useState<string>("Todos");
  const [selectedSubcat, setSelectedSubcat] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [modalQuantity, setModalQuantity] = useState<number>(1);
  const [gramosSeleccionados, setGramosSeleccionados] = useState<number>(100);
  const [inputGramos, setInputGramos] = useState<string>("");
  const [facturaOpcion, setFacturaOpcion] = useState<"unidad" | "docena">("unidad");
  const [facturaCount, setFacturaCount] = useState<number>(1);
  const [empanadaOpcion, setEmpanadaOpcion] = useState<"unidad" | "media_docena" | "docena">("unidad");
  const [empanadaCount, setEmpanadaCount] = useState<number>(1);
  const [selectedSabor, setSelectedSabor] = useState<string>("");
  const [selectedPresentacion, setSelectedPresentacion] = useState<Presentacion | null>(null);
  const { addToCart } = useCart();
  const subcats = SUBCATEGORIAS[selectedCat] || [];
  const precios = selectedProduct?.preciosMultiples || {
    unidad: 1400,
    mediaDocena: 8000,
    docena: 15000
  };

  const handleCatChange = (cat: string) => {
    setSelectedCat(cat);
    if (cat === "Todos") {
      setSelectedSubcat(null);
      return;
    }
    const firstSub = SUBCATEGORIAS[cat]?.[0];
    setSelectedSubcat(firstSub || null);
  };

  const productosPorCategoria = productos.filter((p) => {
    if (selectedCat === "Todos") return true;
    if (selectedSubcat) {
      return p.categoria === selectedCat && p.subcategoria === selectedSubcat;
    }
    return p.categoria === selectedCat;
  });

  const productosFiltrados = (searchTerm.trim() === ''
    ? productosPorCategoria
    : productos.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )).sort((a, b) => {
        const nameA = a.nombre === "Tiritas de Pollo" ? "Nuggets de Pollo" : a.nombre;
        const nameB = b.nombre === "Tiritas de Pollo" ? "Nuggets de Pollo" : b.nombre;
        if (nameA === nameB) {
          return a.nombre === "Tiritas de Pollo" ? 1 : -1;
        }
        return nameA.localeCompare(nameB);
      });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProduct(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setModalQuantity(1);
      setGramosSeleccionados(100);
      setInputGramos("");
      setFacturaOpcion("unidad");
      setFacturaCount(1);
      setSelectedSabor(selectedProduct.sabores && selectedProduct.sabores.length > 0 ? selectedProduct.sabores[0] : "");
      setSelectedPresentacion(selectedProduct.presentaciones && selectedProduct.presentaciones.length > 0 ? selectedProduct.presentaciones[0] : null);
    }
  }, [selectedProduct]);

  const handleAddToCart = (
    e: React.MouseEvent,
    p: Producto,
    cant: number = 1,
    sabor: string = "",
    pres?: Presentacion | null
  ) => {
    e.stopPropagation();
    let nombreFinal = p.nombre;
    let precioFinal = p.precio;

    if (pres) {
      nombreFinal = `${p.nombre} - ${pres.nombre}`;
      precioFinal = pres.precio;
    }

    if (sabor) {
      nombreFinal = `${nombreFinal} - ${sabor}`;
    }

    addToCart({ id: p.id, tipo: "producto", nombre: nombreFinal, precio: precioFinal }, cant);
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString("es-AR")}`;
  };

  if (isLoading) {
    return (
      <section id="catalogo" className="bg-background py-16" aria-busy="true">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-8">
            NUESTROS PRODUCTOS
          </h2>
          <p className="font-body text-muted-foreground">Cargando productos…</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="catalogo" className="bg-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
            NUESTROS PRODUCTOS
          </h2>
          <div className="max-w-xl mx-auto rounded-xl border border-red-200 bg-red-50 p-5 text-red-800">
            No pudimos cargar el catálogo. Por favor, intentá nuevamente en unos minutos.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="catalogo" className="bg-background py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary text-center mb-8">
          NUESTROS PRODUCTOS
        </h2>

        {/* Filter System */}
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex flex-col gap-4">
          {/* Main Categories */}
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIAS.map((c) => (
              <button
                key={c}
                onClick={() => handleCatChange(c)}
                className={`min-h-[44px] px-6 py-2 rounded-full font-heading text-[16px] font-bold transition-all ${
                  selectedCat === c 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Subcategories (Conditional) */}
          {subcats.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 animate-in slide-in-from-top-2 duration-300">
              {subcats.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSubcat(s)}
                  className={`min-h-[38px] px-4 py-1 rounded-full font-body text-[14px] font-semibold border transition-all ${
                    selectedSubcat === s 
                      ? "bg-green-100 border-green-600 text-green-700" 
                      : "bg-card border-border text-muted-foreground hover:border-gray-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {productosFiltrados.length > 0 ? productosFiltrados.map((p) => {
            const isPromo = p.nombre.toUpperCase().includes("PROMO");
            return (
              <div 
                key={p.id} 
                className="bg-card rounded-[16px] overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all border border-border flex flex-col h-full relative sm:pt-[10px]"
                onClick={() => setSelectedProduct(p)}
              >
                {/* Product Image */}
                <div className={isPromo 
                  ? "w-full bg-card flex items-center justify-center h-48 sm:h-56 overflow-hidden rounded-t-xl"
                  : "w-full h-32 sm:h-56 bg-card flex items-center justify-center overflow-hidden rounded-t-xl relative"
                }>
                  <img 
                    src={p.imagen} 
                    alt={p.nombre} 
                    className={`${isPromo ? "w-full h-full object-contain" : "w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"}`} 
                    loading="lazy" 
                  />
                </div>

                {/* Product Info */}
                <div className="p-3 md:p-5 flex flex-col flex-1">
                  <div className="mb-2 flex flex-col items-center text-center">
                    <span className="inline-block w-fit text-[10px] md:text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-2 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border border-transparent dark:border-green-800/50">
                      {p.subcategoria || p.categoria}
                    </span>
                    <h3 className={`font-body font-bold text-card-foreground leading-tight min-h-[40px] text-center uppercase tracking-tight ${isPromo ? "text-sm sm:text-base" : "text-xs sm:text-[16px]"}`}>
                      {p.nombre}
                    </h3>
                  </div>

                  <div className="mt-auto pt-2 md:pt-4 flex flex-col gap-2 md:gap-3 text-center">
                    <span className="font-heading text-lg md:text-xl font-bold text-primary">
                      {p.presentaciones && p.presentaciones.length > 0 ? (
                        <>
                          <span className="text-xs font-normal text-muted-foreground mr-1 font-body">Desde</span>
                          {formatPrice(Math.min(...p.presentaciones.map(pr => pr.precio)))}
                        </>
                      ) : (
                        <>
                          {formatPrice(p.precio)} {p.unidadPrecio && <span className="text-[10px] md:text-sm font-body text-gray-400">/ {p.unidadPrecio}</span>}
                        </>
                      )}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (p.esAGranel || p.esFactura || p.esEmpanada || p.preciosMultiples || (p.sabores && p.sabores.length > 0) || (p.presentaciones && p.presentaciones.length > 0)) {
                          setSelectedProduct(p);
                        } else {
                          handleAddToCart(e, p);
                        }
                      }}
                      className="w-full bg-primary text-white h-[48px] px-4 rounded-xl font-bold text-[11px] sm:text-sm flex items-center justify-center gap-1 md:gap-2 hover:bg-primary-dark transition-colors shadow-sm"
                    >
                      <Plus size={16} className="md:size-[20px]" />
                      <span>AGREGAR</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          }) : (
            <p className="col-span-full text-center text-muted-foreground">No se encontraron productos</p>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
          <div className="relative bg-white w-full max-w-4xl rounded-[24px] overflow-y-auto shadow-2xl flex flex-col md:flex-row max-h-[90vh] [-webkit-overflow-scrolling:touch]">
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-primary hover:text-white transition-all border border-gray-200 shadow-sm text-gray-700"
            >
              <X size={24} />
            </button>
            
            {/* Image Section */}
            <div className="w-full md:w-1/2 bg-[#FAFAFA] dark:bg-[#161412] p-8 flex items-center justify-center border-r border-gray-100 dark:border-gray-800">
              <img 
                src={selectedProduct.imagen} 
                alt={selectedProduct.nombre} 
                className="w-full h-auto max-h-[400px] object-contain drop-shadow-md" 
              />
            </div>
            
            {/* Content Section */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-primary/10 text-primary text-[12px] font-bold px-3 py-1 rounded-full border border-primary/30">
                    {selectedProduct.categoria}
                  </span>
                  {selectedProduct.subcategoria && (
                    <span className="bg-green-100 text-green-700 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {selectedProduct.subcategoria}
                    </span>
                  )}
                </div>
                
                <h2 className="font-heading text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                  {selectedProduct.nombre}
                </h2>
                
                <p className="font-body text-gray-600 text-base leading-relaxed mb-6">
                  {selectedProduct.descripcion}
                </p>
                
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-gray-500 font-semibold text-base uppercase tracking-wide">
                    Stock: {selectedProduct.stock} unidades
                  </span>
                </div>
                
                <div className="mb-8 text-center">
                  <span className="font-heading text-4xl md:text-5xl font-black text-primary">
                    {formatPrice(selectedPresentacion ? selectedPresentacion.precio : selectedProduct.precio)} {selectedProduct.unidadPrecio && <span className="text-xl md:text-2xl font-body text-gray-400 font-bold">/ {selectedProduct.unidadPrecio}</span>}
                  </span>
                </div>
              </div>

              {/* Footer Modal */}
              <div className="mt-auto pt-6 border-t border-gray-100">

                {selectedProduct.esFactura ? (
                  /* ── SELECTOR FACTURAS ── */
                  <div className="flex flex-col gap-4">

                    {/* Selector unidad / docena */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => { setFacturaOpcion("unidad"); setFacturaCount(1); }}
                        className={`h-12 rounded-xl font-bold text-sm transition-all border ${
                          facturaOpcion === "unidad"
                            ? "bg-primary text-white border-primary shadow-md"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:border-primary hover:text-primary"
                        }`}
                      >
                        Unidad — $800
                      </button>
                      <button
                        onClick={() => { setFacturaOpcion("docena"); setFacturaCount(1); }}
                        className={`h-12 rounded-xl font-bold text-sm transition-all border ${
                          facturaOpcion === "docena"
                            ? "bg-primary text-white border-primary shadow-md"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:border-primary hover:text-primary"
                        }`}
                      >
                        Docena — $9.000
                      </button>
                    </div>

                    {/* Contador de cantidad */}
                    <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-1 border border-gray-200">
                      <button
                        onClick={() => setFacturaCount(Math.max(1, facturaCount - 1))}
                        className="h-11 w-11 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="font-body px-6 text-xl font-bold text-gray-900">
                        {facturaCount} {facturaOpcion === "unidad" ? "unidad(es)" : "docena(s)"}
                      </span>
                      <button
                        onClick={() => setFacturaCount(facturaCount + 1)}
                        className="h-11 w-11 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                      >
                        <Plus size={20} />
                      </button>
                    </div>

                    {/* Total */}
                    <div className="bg-primary/5 rounded-xl px-4 py-3 flex items-center justify-between border border-primary/20">
                      <span className="text-gray-500 text-sm font-semibold">Total:</span>
                      <span className="text-primary font-black text-2xl">
                        {formatPrice((facturaOpcion === "unidad" ? 800 : 9000) * facturaCount)}
                      </span>
                    </div>

                    {/* Botón agregar */}
                    <button
                      onClick={() => {
                        const precioUnit = facturaOpcion === "unidad" ? 800 : 9000;
                        const label = facturaOpcion === "unidad" ? "unidad" : "docena";
                        addToCart(
                          {
                            id: selectedProduct.id,
                            tipo: "producto",
                            nombre: `Facturas x${facturaCount} ${label}${facturaCount > 1 ? "s" : ""}`,
                            precio: precioUnit * facturaCount,
                          },
                          1
                        );
                        setSelectedProduct(null);
                      }}
                      className="bg-primary text-white w-full h-14 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <ShoppingCart size={22} />
                      Agregar al Carrito
                    </button>
                  </div>

                ) : (selectedProduct.esEmpanada || selectedProduct.preciosMultiples) ? (
                  /* ── SELECTOR EMPANADAS Y COMBOS MÚLTIPLES ── */
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => { setEmpanadaOpcion("unidad"); setEmpanadaCount(1); }}
                        className={`h-12 rounded-xl font-bold text-[11px] sm:text-xs transition-all border ${
                          empanadaOpcion === "unidad"
                            ? "bg-primary text-white border-primary shadow-md"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:border-primary hover:text-primary"
                        }`}
                      >
                        Unidad — {formatPrice(precios.unidad)}
                      </button>
                      <button
                        onClick={() => { setEmpanadaOpcion("media_docena"); setEmpanadaCount(1); }}
                        className={`h-12 rounded-xl font-bold text-[11px] sm:text-xs transition-all border ${
                          empanadaOpcion === "media_docena"
                            ? "bg-primary text-white border-primary shadow-md"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:border-primary hover:text-primary"
                        }`}
                      >
                        x6 — {formatPrice(precios.mediaDocena)}
                      </button>
                      <button
                        onClick={() => { setEmpanadaOpcion("docena"); setEmpanadaCount(1); }}
                        className={`h-12 rounded-xl font-bold text-[11px] sm:text-xs transition-all border ${
                          empanadaOpcion === "docena"
                            ? "bg-primary text-white border-primary shadow-md"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:border-primary hover:text-primary"
                        }`}
                      >
                        x12 — {formatPrice(precios.docena)}
                      </button>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-1 border border-gray-200">
                      <button
                        onClick={() => setEmpanadaCount(Math.max(1, empanadaCount - 1))}
                        className="h-11 w-11 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="font-body px-6 text-xl font-bold text-gray-900">
                        {empanadaCount} {empanadaOpcion === "unidad" ? "unidad(es)" : empanadaOpcion === "media_docena" ? "media docena(s)" : "docena(s)"}
                      </span>
                      <button
                        onClick={() => setEmpanadaCount(empanadaCount + 1)}
                        className="h-11 w-11 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                      >
                        <Plus size={20} />
                      </button>
                    </div>

                    <div className="bg-primary/5 rounded-xl px-4 py-3 flex items-center justify-between border border-primary/20">
                      <span className="text-gray-500 text-sm font-semibold">Total:</span>
                      <span className="text-primary font-black text-2xl">
                        {formatPrice((empanadaOpcion === "unidad" ? precios.unidad : empanadaOpcion === "media_docena" ? precios.mediaDocena : precios.docena) * empanadaCount)}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        const precioUnit = empanadaOpcion === "unidad" ? precios.unidad : empanadaOpcion === "media_docena" ? precios.mediaDocena : precios.docena;
                        const label = empanadaOpcion === "unidad" ? "unidad" : empanadaOpcion === "media_docena" ? "media docena" : "docena";
                        addToCart(
                          {
                            id: selectedProduct.id,
                            tipo: "producto",
                            nombre: `${selectedProduct.nombre} x${empanadaCount} ${label}${empanadaCount > 1 ? "s" : ""}`,
                            precio: precioUnit * empanadaCount,
                          },
                          1
                        );
                        setSelectedProduct(null);
                      }}
                      className="bg-primary text-white w-full h-14 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <ShoppingCart size={22} />
                      Agregar al Carrito
                    </button>
                  </div>

                ) : selectedProduct.esAGranel ? (
                  /* ── SELECTOR GRANEL ── */
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-4 gap-2">
                      {[100, 200, 500, 1000].map((g) => (
                        <button
                          key={g}
                          onClick={() => { setGramosSeleccionados(g); setInputGramos(""); }}
                          className={`h-11 rounded-xl font-bold text-sm transition-all border ${
                            gramosSeleccionados === g && inputGramos === ""
                              ? "bg-primary text-white border-primary shadow-md"
                              : "bg-gray-50 text-gray-700 border-gray-200 hover:border-primary hover:text-primary"
                          }`}
                        >
                          {g === 1000 ? "1kg" : `${g}g`}
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        inputMode="numeric"
                        min={50}
                        step={50}
                        placeholder="Ingresá los gramos que necesitas"
                        value={inputGramos}
                        onChange={(e) => {
                          setInputGramos(e.target.value);
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val > 0) setGramosSeleccionados(val);
                        }}
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-bold text-base outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-gray-400 placeholder:font-normal"
                      />
                      {inputGramos && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">g</span>
                      )}
                    </div>

                    <div className="bg-primary/5 rounded-xl px-4 py-3 flex items-center justify-between border border-primary/20">
                      <span className="text-gray-500 text-sm font-semibold">Total estimado:</span>
                      <span className="text-primary font-black text-2xl">
                        {formatPrice(Math.round((selectedProduct.unidadPrecio?.toLowerCase().includes('kg') ? selectedProduct.precio / 10 : selectedProduct.precio) * gramosSeleccionados / 100))}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        const gramos = gramosSeleccionados;
                        const precioBase100g = selectedProduct.unidadPrecio?.toLowerCase().includes('kg') ? selectedProduct.precio / 10 : selectedProduct.precio;
                        const precioTotal = Math.round(precioBase100g * gramos / 100);
                        addToCart(
                          {
                            id: selectedProduct.id,
                            tipo: "producto",
                            nombre: `${selectedProduct.nombre} (${gramos >= 1000 ? `${gramos / 1000}kg` : `${gramos}g`})`,
                            precio: precioTotal,
                          },
                          1
                        );
                        setSelectedProduct(null);
                      }}
                      disabled={gramosSeleccionados <= 0}
                      className="bg-primary text-white w-full h-14 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40"
                    >
                      <ShoppingCart size={22} />
                      Agregar {gramosSeleccionados >= 1000 ? `${gramosSeleccionados / 1000}kg` : `${gramosSeleccionados}g`} al Carrito
                    </button>
                  </div>

                ) : (
                  /* ── SELECTOR NORMAL ── */
                  <div className="flex flex-col gap-6 w-full">
                    {selectedProduct.presentaciones && selectedProduct.presentaciones.length > 0 && (
                      <div>
                        <span className="text-gray-500 font-semibold text-sm block mb-2">Seleccioná una presentación:</span>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedProduct.presentaciones.map((pr) => (
                            <button
                              key={pr.nombre}
                              onClick={() => setSelectedPresentacion(pr)}
                              className={`p-3 rounded-xl font-bold text-sm transition-all border flex flex-col items-center justify-center gap-1 ${
                                selectedPresentacion?.nombre === pr.nombre
                                  ? "bg-primary text-white border-primary shadow-md"
                                  : "bg-gray-50 text-gray-700 border-gray-200 hover:border-primary hover:text-primary"
                              }`}
                            >
                              <span className="text-base font-extrabold">{pr.nombre}</span>
                              <span className={`text-xs ${selectedPresentacion?.nombre === pr.nombre ? "text-white/80" : "text-primary font-body"}`}>
                                {formatPrice(pr.precio)}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProduct.sabores && selectedProduct.sabores.length > 0 && (
                      <div>
                        <span className="text-gray-500 font-semibold text-sm block mb-2">Seleccioná un sabor:</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.sabores.map((s) => (
                            <button
                              key={s}
                              onClick={() => setSelectedSabor(s)}
                              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border ${
                                selectedSabor === s
                                  ? "bg-primary text-white border-primary shadow-md"
                                  : "bg-gray-50 text-gray-700 border-gray-200 hover:border-primary hover:text-primary"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-1 w-full sm:w-auto border border-gray-200">
                      <button
                        onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                        className="h-11 w-11 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="font-body px-6 text-xl font-bold text-gray-900">
                        {modalQuantity}
                      </span>
                      <button
                        onClick={() => setModalQuantity(Math.min(selectedProduct.stock, modalQuantity + 1))}
                        disabled={modalQuantity >= selectedProduct.stock}
                        className="h-11 w-11 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-xl transition-all disabled:opacity-30"
                      >
                        <Plus size={20} />
                      </button>
                    </div>

                    <button
                      onClick={(e) => {
                        handleAddToCart(e, selectedProduct, modalQuantity, selectedSabor, selectedPresentacion);
                        setSelectedProduct(null);
                      }}
                      className="bg-primary text-white flex-1 w-full h-14 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <ShoppingCart size={22} />
                      Agregar al Carrito
                    </button>
                  </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Catalogo;
