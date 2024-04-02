import jwt from "jsonwebtoken";
import { decrypt, encrypt } from "./crypto.js";
// import crypto from "./crypto.js";

export default class {
  static encodeJwt(
    object: Object,
    options?: jwt.SignOptions | undefined
  ): string {
    const privateKey = Buffer.from(
      process.env.PRIVATE_KEY,
      "base64"
    ).toString();

    let token = jwt.sign(object, privateKey, {
      ...(options && options),
      expiresIn: "24h",
      algorithm: "HS256",
    });
    token = encrypt(token);
    return token;
  }

  static decodeJwt<T>(token: string): T | null {
    token = decrypt(token);
    const publicKey = Buffer.from(process.env.PRIVATE_KEY, "base64").toString();
    const decoded = jwt.verify(token, publicKey) as T;

    return decoded;
  }
}
