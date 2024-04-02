import UserClass, { UserModel } from "../models/user.js";
import { SigninInput, SigninOutput } from "../schema/user/signin.user.js";
import bcrypt from "bcrypt";
import { VerifyTokenOutput } from "../schema/user/token.verify.js";
import jwt from "../utils/jwt.js";
import crypto from "crypto";

export enum DuplicateCheck {
  EMAIL = 1,
  USERNAME = 2,
  BOTH_USERNAME_EMAIL = 3,
}

class UserService {
  async signUp(
    email: String,
    password: String,
    username: String,
    duplicateCheck: DuplicateCheck = DuplicateCheck.EMAIL
  ): Promise<boolean> {
    const isDuplicate = await this.isDuplicate(email, username, duplicateCheck);

    if (isDuplicate) {
      return false;
    }

    const user: UserClass = {
      email,
      password,
      roles: [],
      username: username || email,
    };
    await UserModel.create(user);

    return true;
  }

  private async isDuplicate(
    email: String,
    username: String,
    duplicateCheck: DuplicateCheck
  ): Promise<boolean> {
    let u: UserClass;
    switch (duplicateCheck) {
      case DuplicateCheck.EMAIL:
        u = await UserModel.find().find_by_email(email);
        return !!u?._id;

      case DuplicateCheck.USERNAME:
        u = await UserModel.find().find_by_username(username.toString());
        return !!u?._id;

      case DuplicateCheck.BOTH_USERNAME_EMAIL:
        u = await UserModel.findOne({ $or: [{ email }, { username }] });
        return !!(u?._id || u?._id);

      default:
        return false;
    }
  }

  async signin(input: SigninInput): Promise<SigninOutput> {
    let message: String[] = [];
    const SIGNIN_RESULT_MESSAGE = {
      INVALID_USERNAME_PASSOWRD: "Invalid email or password",
    };

    const user = await UserModel.find().find_by_email(input.email).lean();

    if (!user) {
      message.push(SIGNIN_RESULT_MESSAGE.INVALID_USERNAME_PASSOWRD);
      return { messages: message };
    }

    //validate password
    const passwordIsValid =
      input.password.length > 0 &&
      (await bcrypt.compare(
        input.password.toString(),
        user.password.toString()
      ));

    if (!passwordIsValid || message.length > 0) {
      message.push(SIGNIN_RESULT_MESSAGE.INVALID_USERNAME_PASSOWRD);
      return { messages: message };
    }
    const token = jwt.encodeJwt(user);
    const out: SigninOutput = { token, email: user.email, messages: message };

    return out;
  }

  async verifyToken(inputToken: String) {
    if (inputToken)
      try {
        const decoded = jwt.decodeJwt<UserClass>(inputToken.toString());

        const user = await UserModel.findOne({ _id: decoded._id }).lean();

        if (user._id)
          return {
            isValid: true,
            token: inputToken,
            email: user.email,
          } as VerifyTokenOutput;
      } catch (err) {
        if (process.env.NODE_ENV !== "test") console.log(err);
      }

    return {
      isValid: false,
      token: inputToken,
      email: "",
    };
  }

  async forgotPassword(email: String): Promise<boolean> {
    //Verify that the email is in database
    const user = await UserModel.find().find_by_email(email);
    if (!user) {
      throw new Error("User not found");
    }
    if (!process.env.DOMAIN_NAME) {
      throw new Error("DOMAIN_NAME is not set");
    }

    const token = crypto.randomBytes(20).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour from now
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;

    await user.save();

    // const resetLink = `http://${process.env.DOMAIN_NAME}/reset-password/${token}`;
    // const transporter = nodemailer.createTransport({
    //   // ... configure with your SMTP server details
    // });

    // await transporter.sendMail({
    //   from: "reset-password@" + process.env.DOMAIN_NAME,
    //   to: email,
    //   subject: "Password Reset",
    //   html: `<p>Please click on the following link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    // });

    return true;
  }

  async resetPassword(token: String, newPassword: String): Promise<boolean> {
    // Find user by token and check if token has expired
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Password reset token is invalid or has expired");
    }

    // Update user's password and clear the reset token fields
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    return true;
  }
}

export default UserService;
