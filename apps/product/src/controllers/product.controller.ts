import { Request, Response, NextFunction, configs, utils } from "@repo/shared";
import Product, { IProduct } from "../models/Product";

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
      const product: IProduct = await Product.create(req.body);

      // Send a message to Kafka
      const message = {
        key: product._id as string,
        data: JSON.stringify(product),
      };
      configs.sendMessage(this.producer, "product-created", message);

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
      const product: IProduct | null = await Product.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );
      if (!product) {
        throw new utils.NotFound("Product not found");
      }

      // Send a message to Kafka
      const message = {
        key: id,
        data: JSON.stringify(product),
      };
      configs.sendMessage(this.producer, "product-updated", message);

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
        key: id,
        data: id,
      };
      configs.sendMessage(this.producer, "product-deleted", message);

      utils.sendSuccessResponse(res, "Product deleted successfully", null);
    } catch (error: any) {
      next(new utils.BadRequest(error.message));
    }
  }
}
