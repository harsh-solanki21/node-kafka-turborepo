import {
  Express,
  express,
  cors,
  dotenv,
  middlewares,
  configs,
} from "@repo/shared";
import orderRoutes from "./routes/orderRoutes";
import OrderService from "./configs/kafka";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 5001;

const corsOptions: cors.CorsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(express.json());
const orderService = new OrderService();

// kafka
let producer: any;
let consumer: any;
(async () => {
  try {
    producer = await configs.createProducer();
    consumer = await configs.createConsumer("order-group");

    await configs.consumeMessages(
      consumer,
      ["product-created", "product-updated", "product-deleted"],
      (message) => {
        orderService.handleProductMessage(message);
      }
    );
  } catch (error) {
    console.error("Kafka connection failed", error);
  }
})();

// routes
app.use("/api/v1/orders", orderRoutes);

app.use(middlewares.notFoundHandler);
app.use(middlewares.errorHandler);

configs
  .connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err: Error) => {
    console.log("MongoDB Connection error: ", err);
  });

export { producer, consumer };
