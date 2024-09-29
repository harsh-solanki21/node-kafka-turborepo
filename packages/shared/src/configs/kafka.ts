import { Kafka, KafkaConfig, Producer, Consumer } from "kafkajs";
import { BadRequest } from "../utils/customErrorHandler";

const brokers = process.env.KAFKA_BROKER
  ? [process.env.KAFKA_BROKER]
  : ["localhost:9092"];

const kafkaConfig: KafkaConfig = {
  clientId: "node-kafka",
  brokers,
};

const kafka = new Kafka(kafkaConfig);

export const createProducer = async (): Promise<Producer> => {
  const producer = kafka.producer();
  await producer.connect();
  console.log("Kafka Producer connected");
  return producer;
};

export const sendMessage = async (
  producer: Producer,
  topic: string,
  messages: { key: string; value: string }[]
) => {
  try {
    await producer.send({
      topic,
      messages: messages.map((msg) => ({
        key: msg.key,
        value: msg.value,
      })),
    });
    console.log(`Message sent to topic ${topic}`);
  } catch (err: any) {
    throw new BadRequest(err.message);
  }
};

export const createConsumer = async (groupId: string): Promise<Consumer> => {
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  console.log("Kafka Consumer connected");
  return consumer;
};

export const consumeMessages = async (
  consumer: Consumer,
  topic: string,
  onMessage: (message: any) => void
) => {
  await consumer.subscribe({ topic, fromBeginning: true });
  console.log(`Subscribed to topic ${topic}`);

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const key = message.key?.toString();
      const value = message.value?.toString();
      console.log({
        topic,
        partition,
        key,
        value,
      });
      onMessage({ key, value });
    },
  });
};
