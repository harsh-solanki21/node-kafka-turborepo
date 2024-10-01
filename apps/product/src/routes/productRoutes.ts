import { express, Router } from "@repo/shared";
import { ProductController } from "../controllers/product.controller";

const router: Router = express.Router();
const productController = new ProductController();

router.post("/create", productController.createProduct);

router.get("/list", productController.getAllProducts);

router.get("/:id", productController.getProduct);

router.put("/:id", productController.updateProduct);

router.delete("/:id", productController.deleteProduct);

export default router;
