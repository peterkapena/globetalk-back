import { Request, Response } from "express";
import UserClass from "./user";

interface Context {
  req: Request;
  res: Response;
  user: UserClass | null;
}

export default Context;