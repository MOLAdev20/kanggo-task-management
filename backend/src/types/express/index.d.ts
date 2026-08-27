// src/types/express/index.d.ts
import { type JwtPayload } from "jsonwebtoken";

interface UserPayload extends JwtPayload {
  user_id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
