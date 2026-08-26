import { type Request, type Response, type NextFunction } from "express";
import jwt from "../lib/jwt";

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization)
      return res.status(400).json({
        message: "unauthorized",
      });

    const token = authorization.split(" ");

    if (!process.env.SECRET_KEY) throw new Error();

    const verify = await jwt.verify(token[1]);

    if (!verify)
      return res.status(400).json({
        message: "unauthorized",
      });

    req.user = verify as AuthenticatedRequest["user"];
    next();
  } catch (err: any) {
    return res.status(500).json({
      message: "internal-server-error",
    });
  }
};
