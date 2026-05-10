import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app.js";
import { connectDatabase } from "../src/db/mongoose.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectDatabase();
  return app(req, res);
}
