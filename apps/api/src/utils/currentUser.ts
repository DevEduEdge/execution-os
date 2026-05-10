import type { Response } from "express";
import type { UserDocument } from "../models/index.js";

export function currentUser(res: Response) {
  return res.locals.user as UserDocument;
}
