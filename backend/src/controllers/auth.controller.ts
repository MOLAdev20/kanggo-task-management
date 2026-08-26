import { type Request, type Response } from "express";

const endpoint = {
  register: (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    res.json({
      message: "Selamat datang",
      body: {
        name,
        email,
        password,
      },
    });
  },
};

export default endpoint;
