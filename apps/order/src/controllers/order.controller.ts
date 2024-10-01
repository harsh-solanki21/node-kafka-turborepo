import { Request, Response, NextFunction, configs, utils } from "@repo/shared";
import Order, { IOrder } from "../models/Order";

export class OrderController {
  private producer: any;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    this.producer = await configs.createProducer();
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { products } = req.body;
      const totalAmount: number = products.reduce(
        (sum: number, product: any) => sum + product.price * product.quantity,
        0
      );
      const order: IOrder = await Order.create({
        products,
        totalAmount,
      });

      // Send a message to Kafka
      const message = {
        key: order._id as string,
        data: JSON.stringify(order),
      };
      configs.sendMessage(this.producer, "order-created", message);

      utils.sendSuccessResponse(res, "Order created successfully", order, 201);
    } catch (error: any) {
      next(new utils.BadRequest(error.message));
    }
  }

  async getAllOrders(_req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await Order.find();
      utils.sendSuccessResponse(
        res,
        "All Orders Retrieved successfully",
        orders
      );
    } catch (error: any) {
      next(new utils.BadRequest(error.message));
    }
  }

  async getOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const order = await Order.findById(id);
      if (!order) {
        throw new utils.NotFound("Order not found");
      }
      utils.sendSuccessResponse(res, "Order Retrieved successfully", order);
    } catch (error: any) {
      next(new utils.BadRequest(error.message));
    }
  }

  async updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { products, status } = req.body;
      const totalAmount = products.reduce(
        (sum: number, product: any) => sum + product.price * product.quantity,
        0
      );
      const order = await Order.findByIdAndUpdate(
        id,
        { products, totalAmount, status },
        { new: true }
      );
      if (!order) {
        throw new utils.NotFound("Order not found");
      }

      // Send a message to Kafka
      const message = {
        key: id,
        data: JSON.stringify(order),
      };
      configs.sendMessage(this.producer, "order-updated", message);

      utils.sendSuccessResponse(res, "Order updated successfully", order);
    } catch (error: any) {
      next(new utils.BadRequest(error.message));
    }
  }

  async deleteOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const order = await Order.findByIdAndDelete(id);
      if (!order) {
        throw new utils.NotFound("Order not found");
      }

      // Send a message to Kafka
      const message = {
        key: id,
        data: JSON.stringify({ id }),
      };
      configs.sendMessage(this.producer, "order-deleted", message);

      utils.sendSuccessResponse(res, "Order deleted successfully", null);
    } catch (error: any) {
      next(new utils.BadRequest(error.message));
    }
  }
}
