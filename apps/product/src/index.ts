import {
  Express,
  express,
  cors,
  dotenv,
  middlewares,
  configs,
} from "@repo/shared";
import productRoutes from "./routes/productRoutes";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 5000;

const corsOptions: cors.CorsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(express.json());

// kafka
let producer: any;
(async () => {
  try {
    producer = await configs.createProducer();
    const consumer = await configs.createConsumer("product-group");

    await configs.consumeMessages(
      consumer,
      ["order-created", "order-updated", "order-deleted"],
      (message) => {
        console.log("Received message:", message);
      }
    );
  } catch (error) {
    console.error("Kafka connection failed", error);
  }
})();

// routes
app.use("/api/v1/products", productRoutes);

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

export { producer };
