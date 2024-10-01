import { express, Router } from "@repo/shared";
import { OrderController } from "../controllers/order.controller";

const router: Router = express.Router();
const orderController = new OrderController();

router.post("/create", orderController.createOrder);

router.get("/list", orderController.getAllOrders);

router.get("/:id", orderController.getOrder);

router.put("/:id", orderController.updateOrder);

router.delete("/:id", orderController.deleteOrder);

export default router;
