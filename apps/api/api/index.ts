import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app.js";
import { connectDatabase } from "../src/db/mongoose.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = req.url ?? "";
  const method = (req.method ?? "GET").toUpperCase();

  // Health and CORS preflight should respond even when database is down.
  if (method !== "OPTIONS" && !path.startsWith("/health")) {
    await connectDatabase();
  }

  return app(req, res);
}
