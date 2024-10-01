import { Request, Response, NextFunction, configs, utils } from "@repo/shared";
import Product from "../models/Product";

export class ProductController {
  private producer: any;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    this.producer = await configs.createProducer();
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await Product.create(req.body);
      utils.sendSuccessResponse(
        res,
        "Product created successfully",
        product,
        201
      );
    } catch (error: any) {
      next(new utils.BadRequest(error.message));
    }
  }

  async getAllProducts(_req: Request, res: Response, next: NextFunction) {
    try {
      const products = await Product.find();
      utils.sendSuccessResponse(
        res,
        "All Products Retrieved successfully",
        products
      );
    } catch (error: any) {
      next(new utils.BadRequest(error.message));
    }
  }

  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) {
        throw new utils.NotFound("Product not found");
      }
      utils.sendSuccessResponse(res, "Product Retrieved successfully", product);
    } catch (error: any) {
      next(new utils.BadRequest(error.message));
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!product) {
        throw new utils.NotFound("Product not found");
      }

      // Send a message to Kafka
      const message = {
        key: "update",
        value: JSON.stringify(product),
      };
      configs.sendMessage(this.producer, "product-events", [message]);

      utils.sendSuccessResponse(res, "Product updated successfully", product);
    } catch (error: any) {
      next(new utils.BadRequest(error.message));
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        throw new utils.NotFound("Product not found");
      }

      // Send a message to Kafka
      const message = {
        key: "delete",
        value: JSON.stringify({ id }),
      };
      configs.sendMessage(this.producer, "product-events", [message]);

      utils.sendSuccessResponse(res, "Product deleted successfully", null);
    } catch (error: any) {
      next(new utils.BadRequest(error.message));
    }
  }
}
