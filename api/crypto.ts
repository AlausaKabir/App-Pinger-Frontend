import { default as CryptoJs } from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY || "secret";

export const encryptToken = (token: string): string => {
  return CryptoJs.AES.encrypt(token, SECRET_KEY).toString();
};

const decryptToken = (cipherText: string): string => {
  const bytes = CryptoJs.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJs.enc.Utf8);
};

export const storeToken = (token: string) => {
  const encryptedToken = encryptToken(token);
  localStorage.setItem("token", encryptedToken);
};

export const clearToken = () => {
  localStorage.removeItem("token");
};

export const getToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const decrypted = decryptToken(token);
    return decrypted || null;
  } catch (error) {
    console.warn("Token decryption failed, clearing stored token:", error);
    localStorage.removeItem("token");
    return null;
  }
};
