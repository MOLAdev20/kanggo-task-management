import Express from "express";
import routes from "./routes/index.ts";
const app = Express();

app.use(Express.json({ limit: "10mb" }));
app.use("/api", routes);

export default app;
