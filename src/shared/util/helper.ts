export const ensureArray = (value: any): any[] =>
  Array.isArray(value) ? value : [value];
