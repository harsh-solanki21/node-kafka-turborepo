import { utils } from "@repo/shared";

import Order from "../models/Order";

class OrderService {
  async handleProductMessage(message: any) {
    const { topic, key, value } = message;
    const data = JSON.parse(value);

    switch (topic) {
      case "product-created":
        console.log("Product created:", data);
        break;
      case "product-updated":
        await this.handleProductUpdate(data);
        break;
      case "product-deleted":
        await this.handleProductDelete(key);
        break;
      default:
        console.log("Unknown topic:", topic);
    }
  }

  private async handleProductUpdate(product: any) {
    try {
      const orders = await Order.find({ "products.productId": product._id });

      for (const order of orders) {
        const updatedProducts = order.products.map((p: any) => {
          if (p.productId.toString() === product._id.toString()) {
            return {
              ...p.toObject(),
              price: Number(product.price),
            };
          }
          return p.toObject();
        });

        const newTotalAmount = updatedProducts.reduce((sum, p) => {
          return sum + Number(p.price) * Number(p.quantity);
        }, 0);

        await Order.findByIdAndUpdate(
          order._id,
          {
            products: updatedProducts,
            totalAmount: newTotalAmount,
          },
          { new: true }
        );
      }
    } catch (error: any) {
      throw new utils.BadRequest(error.message);
    }
  }

  private async handleProductDelete(productId: string) {
    try {
      const orders = await Order.find({ "products.productId": productId });

      for (const order of orders) {
        const updatedProducts = order.products
          .filter((p) => p.productId.toString() !== productId)
          .map((p: any) => p.toObject());

        const newTotalAmount = updatedProducts.reduce((sum, p) => {
          return sum + Number(p.price) * Number(p.quantity);
        }, 0);

        await Order.findByIdAndUpdate(
          order._id,
          {
            products: updatedProducts,
            totalAmount: newTotalAmount,
          },
          { new: true }
        );
      }
    } catch (error: any) {
      throw new utils.BadRequest(error.message);
    }
  }
}

export default OrderService;
