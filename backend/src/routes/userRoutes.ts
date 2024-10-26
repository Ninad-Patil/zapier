import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { client } from "../db";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middlewares/authMiddleware";
export const userRouter = express.Router();

interface User {
  email: string;
  password: string;
  id: string;
}

userRouter.post("/signin", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).send("missing emaill and password");

    const user: User | null = await client.user.findFirst({
      where: { email },
    });
    if (!user) return res.status(400).send("no user found");
    const comparePass = await bcrypt.compare(password, user?.password);
    if (!comparePass) return res.status(400).send("password doesnt match");
    const secret = process.env.JWT_SEC as unknown as string;
    const token = jwt.sign(user.id, secret);
    return res.status(200).send({ token });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

userRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).send("missing emaill and password");

    const user: User | null = await client.user.findFirst({
      where: { email },
    });

    if (user) return res.status(200).send("user already exists");

    const encryptedPassword = await bcrypt.hash(password, 8);

    await client.user.create({
      data: {
        password: encryptedPassword,
        email,
      },
    });

    res.status(200).send("user created successfully");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

userRouter.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const id = req.id;
    console.log(id, "from user");
    const user = await client.user.findFirst({
      where: { id },
      select: { email: true },
    });
    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
