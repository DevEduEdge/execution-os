import "dotenv/config";

const toBool = (value: string | undefined, fallback = false) => {
  if (value === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  mongodbUri: process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/execution-os",
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:3000",
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  demoAuth: toBool(process.env.DEMO_AUTH, false),
  allowSeed: toBool(process.env.ALLOW_SEED, false)
};

export function assertProductionSafety() {
  if (env.nodeEnv === "production" && env.demoAuth) {
    throw new Error("DEMO_AUTH must be false in production.");
  }
}
