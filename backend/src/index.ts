import { type Request, type Response } from "express";
import app from "./app.ts";

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "hello-world!",
  });
});

const port = process.env.PORT || 8080;
app.listen(port, (err) => {
  if (err) console.error(err);

  console.log(`✅ Server is running on port ${port}`);
});
