import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { verifyFirebaseToken } from "../config/firebase.js";
import { User } from "../models/index.js";
import { AppError } from "./error.js";

function bearerToken(req: Request) {
  const header = req.header("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim();
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = bearerToken(req);

    if (!token && !env.demoAuth) {
      throw new AppError("Authentication required.", 401);
    }

    const decoded = token
      ? await verifyFirebaseToken(token)
      : {
          uid: "demo-user",
          email: "demo@execution-os.local",
          name: "Demo Leader",
          picture: ""
        };

    const user = await User.findOneAndUpdate(
      { uid: decoded.uid },
      {
        $set: {
          email: decoded.email ?? "unknown@execution-os.local",
          displayName: decoded.name ?? decoded.email ?? "Execution OS User",
          photoURL: decoded.picture
        }
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    if (!user) {
      throw new AppError("Unable to create authenticated user.", 500);
    }

    res.locals.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
