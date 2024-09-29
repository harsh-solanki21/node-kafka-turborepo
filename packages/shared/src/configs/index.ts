import connectDB from "./mongo";
import {
  createProducer,
  createConsumer,
  sendMessage,
  consumeMessages,
} from "./kafka";

export default {
  connectDB,
  createProducer,
  createConsumer,
  sendMessage,
  consumeMessages,
};
