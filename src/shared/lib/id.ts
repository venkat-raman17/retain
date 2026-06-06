/**
 * Generate a v4-style UUID for local primary keys.
 *
 * These ids never leave the device, so cryptographic strength is unnecessary;
 * `Math.random` is sufficient and dependency-free. Swap in `expo-crypto` here if
 * stronger guarantees are ever needed.
 */
export function createId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}
