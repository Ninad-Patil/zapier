import express from "express";
import { PrismaClient } from "@prisma/client";
const app = express();
app.use(express.json());
const client = new PrismaClient();

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
  try {
    const { userId, zapId } = req.params;
    const metadata = req.body;

    await client.$transaction(async (trx) => {
      const run = await trx.zapRun.create({
        data: {
          zapId,
          metadata,
        },
      });

      await trx.zapRunOutbox.create({
        data: {
          zapRunId: run.id,
        },
      });
    });
    res.status(200).send("ok");
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
