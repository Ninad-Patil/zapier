import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization as unknown as string;
    const secret = process.env.JWT_SEC as unknown as string;
    const userId = jwt.verify(token, secret);

    if (!userId) return res.status(404).send("unverified token");
    console.log("this is payload", userId);
    //@ts-ignore
    req.id = userId;

    next();
  } catch (error) {
    res.send(error);
    console.log(error);
  }
}
