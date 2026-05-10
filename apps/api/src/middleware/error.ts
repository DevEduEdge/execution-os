import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 400
  ) {
    super(message);
  }
}

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new AppError(`Route not found: ${req.method} ${req.path}`, 404));
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    return res.status(422).json({
      error: "Validation failed",
      details: error.flatten()
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  const message = error instanceof Error ? error.message : "Unexpected server error";
  const statusCode = message.includes("auth") || message.includes("token") ? 401 : 500;

  return res.status(statusCode).json({
    error: statusCode === 500 ? "Internal server error" : message
  });
}
