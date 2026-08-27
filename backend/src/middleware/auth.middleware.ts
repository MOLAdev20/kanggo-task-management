import { type Request, type Response, type NextFunction } from "express";
import jwt from "../lib/jwt";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization)
      return res.status(401).json({
        message: "header-not-provided",
      });

    const token = authorization.split(" ")[1];

    const payload = await jwt.verify(token);

    if (!payload) throw new Error();

    req.user = payload as any;
    next();
  } catch (err: any) {
    return res.status(401).json({
      message: "unauthorized",
    });
  }
};
