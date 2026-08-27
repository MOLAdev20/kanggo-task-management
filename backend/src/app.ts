import Express from "express";
import routes from "./routes/index.ts";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = Express();

const corsOptions: cors.CorsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};
app.use(cors(corsOptions));

app.use(Express.json({ limit: "10mb" }));
app.use("/api", routes);

export default app;
