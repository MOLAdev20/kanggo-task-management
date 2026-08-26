import jwt from "jsonwebtoken";

const verify = async (token: string) => {
  if (!process.env.SECRET_KEY) return;
  return await jwt.verify(token, process.env.SECRET_KEY);
};

export default { verify };
