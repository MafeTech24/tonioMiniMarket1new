import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CartProvider, useCart } from "@/context/CartContext";

function CartHarness() {
  const { addToCart, cart, itemCount, total } = useCart();
  return (
    <div>
      <button onClick={() => addToCart({ id: 1, tipo: "producto", nombre: "Azúcar", precio: 2000 }, 2)}>Agregar</button>
      <button onClick={() => addToCart({ id: 1, tipo: "producto", nombre: "Azúcar", precio: 2000 }, 1)}>Sumar</button>
      <span data-testid="lines">{cart.length}</span>
      <span data-testid="items">{itemCount}</span>
      <span data-testid="total">{total}</span>
    </div>
  );
}

describe("carrito", () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);

  it("agrupa el mismo producto y calcula cantidad y total", () => {
    render(<CartProvider><CartHarness /></CartProvider>);
    fireEvent.click(screen.getByText("Agregar"));
    fireEvent.click(screen.getByText("Sumar"));

    expect(screen.getByTestId("lines")).toHaveTextContent("1");
    expect(screen.getByTestId("items")).toHaveTextContent("3");
    expect(screen.getByTestId("total")).toHaveTextContent("6000");
    expect(localStorage.getItem("tonio-cart")).toContain('"cantidad":3');
  });
});
