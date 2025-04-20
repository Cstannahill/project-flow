export function isCyclic(obj: any, seen = new WeakSet()): boolean {
  if (obj && typeof obj === "object") {
    if (seen.has(obj)) return true;
    seen.add(obj);
    return Object.values(obj).some((v) => isCyclic(v, seen));
  }
  return false;
}
