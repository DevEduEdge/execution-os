import app from "./app.js";
import { assertProductionSafety, env } from "./config/env.js";
import { connectDatabase } from "./db/mongoose.js";

assertProductionSafety();
await connectDatabase();

app.listen(env.port, () => {
  console.log(`Execution OS API running on http://localhost:${env.port}`);
});
