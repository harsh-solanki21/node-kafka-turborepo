import { mongoose } from "@repo/shared";

interface IOrderProduct {
  productId: string;
  quantity: number;
  price: number;
}

export interface IOrder extends mongoose.Document {
  products: IOrderProduct[];
  totalAmount: number;
  status: "pending" | "completed" | "cancelled";
}

const OrderSchema: mongoose.Schema = new mongoose.Schema(
  {
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder & mongoose.Document>("Order", OrderSchema);
