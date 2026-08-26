import { Router } from "express";
import authRoute from "./auth.route.ts";
import tasksRoute from "./tasks.route.ts";

const router = Router();

router.use("/auth", authRoute);
router.use("/tasks", tasksRoute);

export default router;
