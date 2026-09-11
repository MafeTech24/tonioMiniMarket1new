// Utilidades simples para exportar datos a CSV (se abre directamente en Excel).
// No usan ninguna librería externa: alcanza con esto para exportar pedidos y clientes.

function escapeCsvValue(value: string | number | null | undefined) {
  const str = String(value ?? "");
  if (/[",;\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export function toCsv(headers: string[], rows: Array<Array<string | number | null | undefined>>) {
  const lines = [headers, ...rows].map((row) => row.map(escapeCsvValue).join(","));
  // El ﻿ (BOM) al principio es necesario para que Excel muestre bien los
  // acentos y la "ñ" al abrir el archivo, en vez de mostrar caracteres raros.
  return "﻿" + lines.join("\r\n");
}

export function downloadCsv(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
