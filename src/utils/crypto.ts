import crypto from "crypto";

const IV = Buffer.from(process.env.IV_HEX, "hex"); // Replace with your IV (32 hex characters)
const KEY = Buffer.from(process.env.KEY_HEX, "hex"); // Replace with your key (64 hex characters)

// Function to encrypt a message
export function encrypt(text: string) {
  let cipher = crypto.createCipheriv("aes-256-cbc", KEY, IV);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
}

// Function to decrypt the message
export function decrypt(encryptedText: string) {
  let encryptedBuffer = Buffer.from(encryptedText, "hex");
  let decipher = crypto.createDecipheriv("aes-256-cbc", KEY, IV);
  let decrypted = decipher.update(encryptedBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
