import { Router } from "express";
import taskController from "../controllers/task.controller.ts";
// import authMiddleware from "../middleware/auth.middleware.ts";

const route = Router();

route.get("/", taskController.getByUser);
route.post("/", taskController.create);
route.delete("/:id", taskController.delete);
route.put("/:id", taskController.update);

export default route;
