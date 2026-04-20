import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

export interface CartItem {
  nombre: string;
  precio: number;
  precioFormateado: string;
  cantidad: number;
}

interface CartContextProps {
  cart: CartItem[];
  addToCart: (producto: { nombre: string; precio: number | string }, cantidad?: number) => void;
  removeFromCart: (nombre: string) => void;
  updateQuantity: (nombre: string, cantidad: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

const parsePrice = (price: string | number) => {
  if (typeof price === "number") return price;
  return parseInt(price.replace(/[^0-9]/g, ""));
};

const formatPrice = (price: number) => {
  return `$${price.toLocaleString("es-AR")}`;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (producto: { nombre: string; precio: number | string }, cantidad: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.nombre === producto.nombre);
      const priceValue = parsePrice(producto.precio);
      const formattedPrice = typeof producto.precio === "string" ? producto.precio : formatPrice(producto.precio);

      if (existing) {
        toast.success(`Se agregaron ${cantidad} unidades de ${producto.nombre}`);
        return prev.map((item) =>
          item.nombre === producto.nombre
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      toast.success(`${producto.nombre} agregado al carrito`);
      return [
        ...prev,
        {
          nombre: producto.nombre,
          precio: priceValue,
          precioFormateado: formattedPrice,
          cantidad: cantidad,
        },
      ];
    });
  };

  const removeFromCart = (nombre: string) => {
    setCart((prev) => prev.filter((item) => item.nombre !== nombre));
    toast.info("Producto eliminado del carrito");
  };

  const updateQuantity = (nombre: string, cantidad: number) => {
    if (cantidad <= 0) return;
    setCart((prev) =>
      prev.map((item) => (item.nombre === nombre ? { ...item, cantidad } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const itemCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};
