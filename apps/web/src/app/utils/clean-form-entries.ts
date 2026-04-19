/**
 * converts all empty strings in an object to null
 */
export function cleanFormEntries<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      value.trim() === "" ? null : value,
    ]),
  ) as T;
}
