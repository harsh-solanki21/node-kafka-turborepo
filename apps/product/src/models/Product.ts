import { mongoose } from "@repo/shared";

export interface IProduct extends mongoose.Document {
  name: string;
  description: string;
  price: number;
  stock: number;
}

const ProductSchema: mongoose.Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct & mongoose.Document>(
  "Product",
  ProductSchema
);
