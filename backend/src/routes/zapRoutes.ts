import express, { Request, Response } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { client } from "../db";
export const zapRouter = express.Router();

zapRouter.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { triggerType, actions } = req.body;

    const zapId = await client.$transaction(async (tx) => {
      const zap = await tx.zap.create({
        data: {
          //@ts-ignore
          userId: req.id,
        },
      });
      const trigger = await tx.trigger.create({
        data: {
          type: triggerType,
          zapId: zap.id,
        },
      });
      // Map over actions to add sortingOrder based on index
      const formattedActions = actions.map((action: any, index: number) => ({
        ...action,
        zapId: zap.id,
        triggerId: trigger.id,
        sortingOrder: index,
      }));
      await tx.action.createMany({
        data: formattedActions,
      });
    });

    res.status(200).send(zapId);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

zapRouter.get(
  "/:zapId",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { zapId } = req.params;
      //@ts-ignore
      const userId = req.id;

      const zap = await client.zap.findFirst({
        where: {
          id: zapId,
          userId: userId,
        },
        include: {
          Trigger: {
            select: {
              type: true, // Only select the `type` field in Trigger
              action: {
                select: {
                  type: true, // Only select the `type` field in Action within Trigger
                },
              },
            },
          },
        },
      });
      if (!zap) return res.status(404).send("zap not found");
      res.status(200).send(zap);
    } catch (error) {
      res.send(error);
      console.log(error);
    }
  }
);

zapRouter.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const id = req.id;
    const zaps = await client.zap.findMany({
      where: {
        userId: id,
      },
      include: {
        Trigger: {
          select: {
            type: true, // Only select the `type` field in Trigger
            action: {
              select: {
                type: true, // Only select the `type` field in Action within Trigger
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      zaps,
    });
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});
