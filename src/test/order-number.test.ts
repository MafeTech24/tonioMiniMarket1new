import { describe, expect, it } from "vitest";
import { isValidOrderNumber, normalizeOrderNumber } from "@/lib/orderNumber";

describe("números de pedido", () => {
  it("acepta números enteros positivos históricos y nuevos", () => {
    expect(isValidOrderNumber("1035")).toBe(true);
    expect(isValidOrderNumber("2091")).toBe(true);
    expect(isValidOrderNumber("3801")).toBe(true);
    expect(isValidOrderNumber("100000")).toBe(true);
  });

  it("elimina espacios exteriores", () => {
    expect(normalizeOrderNumber("  3801 ")).toBe("3801");
    expect(isValidOrderNumber("  3801 ")).toBe(true);
  });

  it("rechaza valores que no son enteros positivos y formatos antiguos", () => {
    expect(isValidOrderNumber("")).toBe(false);
    expect(isValidOrderNumber("   ")).toBe(false);
    expect(isValidOrderNumber("0")).toBe(false);
    expect(isValidOrderNumber("-1")).toBe(false);
    expect(isValidOrderNumber("10.5")).toBe(false);
    expect(isValidOrderNumber("pedido")).toBe(false);
    expect(isValidOrderNumber("TMM0001")).toBe(false);
    expect(isValidOrderNumber("ANT1035")).toBe(false);
  });
});
