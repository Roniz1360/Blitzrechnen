import * as Crypto from 'expo-crypto';

/** SHA-256-Hash der PIN (Hex) – die PIN wird nie im Klartext gespeichert. */
export async function pinHash(pin: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, pin.trim());
}

export async function checkPin(pin: string, storedHash: string | null): Promise<boolean> {
  if (!storedHash) return false;
  const h = await pinHash(pin);
  return h === storedHash;
}
