import express from "express";
import { userRouter } from "./routes/userRoutes";
import { zapRouter } from "./routes/zapRoutes";

const app = express();
app.use(express.json());

app.use("/api/v1/user", userRouter);

app.use("/api/v1/zap", zapRouter);

app.listen(8000, () => {
  console.log("listening on port 8000");
});
