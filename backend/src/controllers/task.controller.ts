import { type Request, type Response } from "express";
import { prisma } from "../lib/prisma";

export default {
  delete: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id) as number;

      await prisma.task.delete({
        where: { id },
      });

      res.json({
        message: "task-deleted",
      });
    } catch (err: any) {
      res.status(500).json({
        message: "internal-server-error",
      });
    }
  },
  getByUser: async (req: Request, res: Response) => {
    try {
      const user_id = Number(req.query.user_id);

      const tasks = await prisma.task.findMany({
        where: { user_id },
      });

      res.json(tasks);
    } catch (err: any) {
      res.status(500).json({
        message: "internal-server-error",
        err: err.message,
      });
    }
  },
  create: async (req: Request, res: Response) => {
    try {
      const { title, description, deadline } = req.body;
      const user_id = Number(req.body.user_id);

      if (!title)
        return res.status(400).json({ message: "missing-required-field" });

      const newTask = await prisma.task.create({
        data: {
          user_id,
          title: title,
          description: description && description,
          deadline: deadline && new Date(deadline),
        },
      });

      res.json({
        message: "task-created",
        task: newTask,
      });
    } catch (err: any) {
      res.status(500).json({
        message: "internal-server-error",
        err: err.message,
      });
    }
  },
  update: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id) as number;
      const { title, description, deadline, status } = req.body;

      const updatedTask = await prisma.task.update({
        where: { id },
        data: {
          title,
          description,
          deadline: deadline && new Date(deadline),
          status: status,
        },
      });

      res.json({
        message: "task-updated",
        data: updatedTask,
      });
    } catch (err: any) {
      res.status(500).json({
        message: "internal-server-error",
      });
    }
  },
};
