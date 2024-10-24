import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";
const TOPIC = "zap-events";
const client = new PrismaClient();
const kafka = new Kafka({
  clientId: "outbox-processor",
  brokers: ["localhost:9092"],
});
async function main() {
  while (1) {
    const producer = kafka.producer();
    const rows = await client.zapRunOutbox.findMany({
      take: 20,
    });
    await producer.connect();
    await producer.send({
      topic: TOPIC,
      messages: rows.map((ele) => {
        return {
          value: ele.zapRunId,
        };
      }),
    });
    await client.zapRunOutbox.deleteMany({
      where: {
        id: {
          in: rows.map((ele) => ele.id),
        },
      },
    });
  }
}

main();
