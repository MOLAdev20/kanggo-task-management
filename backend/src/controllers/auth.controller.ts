import { type Request, type Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const endpoint = {
  register: async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message: "missing-required-fields",
        });
      }

      // Cek is requested email has been registered?
      const registeredEmail = await prisma.user.count({
        where: { email },
      });

      if (registeredEmail) {
        return res.status(409).json({
          message: "email-already-registered",
        });
      }

      // store to db, @User
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashPassword,
        },
      });

      res.json({
        message: "user-created",
        newUser,
      });
    } catch (err: any) {
      res.status(500).json({
        message: "internal-server-error",
        detail: err,
      });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: "missing-required-fields",
        });
      }

      const registeredUser = await prisma.user.findFirst({
        where: { email },
      });

      if (!registeredUser)
        return res.status(404).json({ message: "user-not-found" });

      const verifyPassword = await bcrypt.compare(
        password,
        registeredUser.password,
      );

      if (!verifyPassword) {
        return res.status(404).json({
          message: "authentication-failed",
        });
      }

      const secrectKey = process.env.SECRET_KEY;
      if (!secrectKey) throw new Error();

      jwt.sign(
        {
          id: registeredUser.id,
          email: registeredUser.email,
        },
        secrectKey,
        {
          expiresIn: "15m",
        },

        (err, token) => {
          if (err) throw new Error();
          res.json({
            user: {
              message: "user-authenticated",
              token: token,
            },
          });
        },
      );
    } catch (err: any) {
      res.status(500).json({
        message: "internal-server-error",
      });
    }
  },
};

export default endpoint;
