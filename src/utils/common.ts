import bcrypt from "bcrypt";

export const SALT = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT));
