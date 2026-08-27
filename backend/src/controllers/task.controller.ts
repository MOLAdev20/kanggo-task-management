import { type Request, type Response } from "express";
import { Prisma, TaskStatus } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

export default {
  getByUser: async (req: Request, res: Response) => {
    const user_id = Number(req.user?.user_id);
    try {
      const statusParam =
        typeof req.query.status === "string"
          ? req.query.status.toLowerCase()
          : "all";
      const title =
        typeof req.query.title === "string" ? req.query.title.trim() : "";

      const statusMap = {
        pending: TaskStatus.PENDING,
        "in-progress": TaskStatus.IN_PROGRESS,
        done: TaskStatus.DONE,
      } as const;

      const status = statusMap[statusParam as keyof typeof statusMap];

      const requestedLimit = Number(req.query.limit);
      const limit = Number.isInteger(requestedLimit)
        ? Math.min(Math.max(requestedLimit, 1), 100)
        : 10;
      const requestedCursor = Number(req.query.cursor);
      const cursor =
        Number.isInteger(requestedCursor) && requestedCursor > 0
          ? requestedCursor
          : undefined;

      const where: Prisma.TaskWhereInput = {
        user_id,
        ...(status && { status }),
        ...(title && { title: { contains: title } }),
      };
      const taskPage = await prisma.task.findMany({
        where,
        orderBy: { id: "desc" },
        take: limit + 1,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      });
      const hasMore = taskPage.length > limit;
      const tasks = hasMore ? taskPage.slice(0, limit) : taskPage;

      res.json({
        message: "tasks-found",
        tasks,
        nextCursor: hasMore ? tasks.at(-1)?.id : null,
        hasMore,
      });
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
      const user_id = Number(req.user?.user_id);

      if (!title)
        return res.status(400).json({ message: "missing-required-field" });

      const newTask = await prisma.task.create({
        data: {
          user_id,
          title: title,
          description: description && description,
          deadline: deadline ? new Date(deadline) : null,
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
        task: updatedTask,
      });
    } catch (err: any) {
      res.status(500).json({
        message: "internal-server-error",
      });
    }
  },
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
};
