import { Router } from "express";
import authRoute from "./auth.route.ts";
import tasksRoute from "./tasks.route.ts";
import authMiddleware from "../middleware/auth.middleware.ts";

const router = Router();

router.use("/auth", authRoute);
router.use("/tasks", authMiddleware, tasksRoute);

export default router;
