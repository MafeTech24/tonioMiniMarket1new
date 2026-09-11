const ORDER_NUMBER_PATTERN = /^[1-9]\d*$/;

export const normalizeOrderNumber = (value?: string | null) =>
  value?.trim() ?? "";

export const isValidOrderNumber = (value?: string | null) =>
  ORDER_NUMBER_PATTERN.test(normalizeOrderNumber(value));
