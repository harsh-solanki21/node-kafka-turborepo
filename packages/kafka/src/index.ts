import express, { Express } from "express";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";

dotenv.config();
const app: Express = express();

const corsOptions: CorsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(express.json());

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
