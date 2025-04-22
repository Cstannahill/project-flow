// A helper to validate a key exists in an object
export function isValidKey<T extends object>(
  obj: T,
  key: string | number | symbol,
): key is keyof T {
  return key in obj;
}

// A helper to safely access a property if you already know key is valid
export function safeAccess<T extends object, K extends keyof T>(
  obj: T,
  key: K,
): T[K] {
  return obj[key];
}
