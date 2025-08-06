import AES from "crypto-js/aes.js";
import Utf8 from "crypto-js/enc-utf8.js";

const secretKey = "aptis-academy-ADU-2025";

/**
 * Mã hoá một chuỗi văn bản bằng AES
 * @param plaintext - Văn bản cần mã hoá
 * @returns Chuỗi đã mã hoá (base64)
 */
export function encryptAES(plaintext) {
  return AES.encrypt(plaintext, secretKey).toString();
}

/**
 * Giải mã chuỗi đã mã hoá AES
 * @param ciphertext - Chuỗi mã hoá (base64)
 * @returns Văn bản đã giải mã
 */
export function decryptAES(ciphertext) {
  const bytes = AES.decrypt(ciphertext, secretKey);
  return bytes.toString(Utf8); // Trả về chuỗi gốc
}
