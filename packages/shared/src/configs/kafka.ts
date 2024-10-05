import { Kafka, KafkaConfig, Producer, Consumer } from "kafkajs";
import { BadRequest } from "../utils/customErrorHandler";

const brokers: string[] = process.env.KAFKA_BROKERS
  ? process.env.KAFKA_BROKERS.split(",")
  : ["localhost:9092"];

const kafkaConfig: KafkaConfig = {
  clientId: process.env.KAFKA_CLIENT_ID || "node-kafka-cluster",
  brokers,
};

const cluster = new Kafka(kafkaConfig);

export const createProducer = async (): Promise<Producer> => {
  const producer = cluster.producer();
  await producer.connect();
  console.log("Kafka Producer connected");
  return producer;
};

export const sendMessage = async (
  producer: Producer,
  topic: string,
  message: { key: string; data: string }
) => {
  try {
    await producer.send({
      topic,
      messages: [{ key: message.key, value: message.data }],
    });
    console.log(`Message sent to topic ${topic}`);
  } catch (err: any) {
    throw new BadRequest(err.message);
  }
};

export const createConsumer = async (groupId: string): Promise<Consumer> => {
  const consumer = cluster.consumer({ groupId });
  await consumer.connect();
  console.log("Kafka Consumer connected");
  return consumer;
};

export const consumeMessages = async (
  consumer: Consumer,
  topics: string[],
  onMessage: (message: any) => void
) => {
  await consumer.subscribe({ topics, fromBeginning: true });
  console.log(`Subscribed to topics: ${topics.join(", ")}`);

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
      onMessage({ topic, key, value });
    },
  });
};
