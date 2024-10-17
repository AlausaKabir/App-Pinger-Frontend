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

export const getToken = () => {
  const token = localStorage.getItem("token");
  return token ? decryptToken(token) : null;
};
