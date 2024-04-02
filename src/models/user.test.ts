// tests/auth.test.ts
import { describe, expect, it, beforeAll, afterAll } from "@jest/globals";
import mongoose from "mongoose";
import UserClass from "../models/user";
import UserService, { DuplicateCheck } from "../services/user.service";

describe("Authentication", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost/auth_test_auth", {});
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  const user: UserClass = {
    email: "process.env.PETER_KAPENA_EMAIL",
    password: "process.env.PETER_KAPENA_PASSWORD",
    roles: [],
    username: "process.env.PETER_KAPENA_EMAIL",
  };

  it("allows a user to sign up", async () => {
    const result = await new UserService().signUp(
      user.email,
      user.password,
      user.username,
      DuplicateCheck.EMAIL
    );
    expect(result).toBe(true);
  });

  it("should not allow a user to sign up with an existing username", async () => {
    const result = await new UserService().signUp(
      user.email,
      user.password,
      user.username,
      DuplicateCheck.USERNAME
    );
    expect(result).toBe(false);
  });

  it("should not allow a user to sign up with an existing email", async () => {
    const result = await new UserService().signUp(
      user.email,
      user.password,
      user.username,
      DuplicateCheck.EMAIL
    );
    expect(result).toBe(false);
  });

  it("should allow a user to sign in with correct credentials and verify its token", async () => {
    const result = await new UserService().signin({
      email: user.email,
      password: user.password,
    });

    expect(result.token).not.toBeNull();

    if (result.token) {
      const result2 = await new UserService().verifyToken(result.token);
      expect(result2.isValid).toBe(true);
    }
  });

  it("should return invalid for invalid token", async () => {
    const result2 = await new UserService().verifyToken("result.token");
    expect(result2.isValid).toBe(false);
  });

  it("should not allow a user to sign in with incorrect credentials", async () => {
    const result = await new UserService().signin({
      email: user.email,
      password: "user.password",
    });
    expect(result?.messages?.length).toBeGreaterThan(0);
  });
});
