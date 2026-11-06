import { Router } from "express";
import multer from "multer";
import { createProduct, getAllProducts, getColors, getProductDetails, removeProduct, editProduct, getAdminProductById, searchProducts } from "../controllers/product.controller.js";
import { authenticateSeller } from "../middlewares/authMiddleware.js";
import { productValidator } from "../validators/productValidator.js";
import { cacheMiddleware } from "../middlewares/cacheMiddleware.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

const productRouter = Router();

productRouter.post("/", authenticateSeller, upload.any(), productValidator, createProduct);
productRouter.get("/", cacheMiddleware("products", 300), getAllProducts);
productRouter.get("/search", cacheMiddleware("products", 60), searchProducts);
productRouter.get("/colors", cacheMiddleware("products", 600), getColors);
productRouter.get("/detail/:slug", cacheMiddleware("products", 300), getProductDetails);
productRouter.get("/admin/:id", authenticateSeller, getAdminProductById);
productRouter.put("/:id", authenticateSeller, upload.any(), productValidator, editProduct);
productRouter.delete("/:id", authenticateSeller, removeProduct);

export default productRouter;