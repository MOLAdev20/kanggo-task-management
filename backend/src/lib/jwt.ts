import jwt, { type SignOptions } from "jsonwebtoken";

interface Payload {
  user_id: number;
  email: string;
}

const secret = process.env.JWT_SECRET_KEY;

const sign = async (payload: Payload) => {
  if (secret === undefined) throw new Error();
  return jwt.sign(payload, secret as string, {
    expiresIn: process.env.JWT_EXPIRED_DURATION as SignOptions["expiresIn"],
  });
};

const verify = async (token: string) => {
  if (secret === undefined) throw new Error();
  return jwt.verify(token, secret);
};

export default { sign, verify };
