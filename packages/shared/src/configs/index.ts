import connectDB from "./mongo";
import {
  createProducer,
  createConsumer,
  sendMessage,
  consumeMessages,
} from "./kafka";

const configs = {
  connectDB,
  createProducer,
  createConsumer,
  sendMessage,
  consumeMessages,
};

export default configs;
