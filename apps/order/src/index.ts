import {
  Express,
  express,
  cors,
  dotenv,
  middlewares,
  configs,
} from "@repo/shared";
import orderRoutes from "./routes/orderRoutes";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 5001;

const corsOptions: cors.CorsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(express.json());

// kafka
(async () => {
  try {
    const consumer = await configs.createConsumer("order-group");

    await configs.consumeMessages(consumer, ["product-events"], (message) => {
      console.log("Received message:", message);
    });
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
