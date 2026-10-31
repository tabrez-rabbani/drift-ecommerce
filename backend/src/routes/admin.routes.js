import { Router } from "express";
import {
    getDashboardStats,
    getAdminOrders,
    getAdminCancelledOrders,
    updateAdminOrderStatus,
    getAdminUsers,
    deleteAdminUser,
    globalSearch,
} from "../controllers/admin.controller.js";
import { authenticateSeller } from "../middlewares/authMiddleware.js";

const adminRouter = Router();

adminRouter.get("/dashboard-stats", authenticateSeller, getDashboardStats);
adminRouter.get("/search", authenticateSeller, globalSearch);
adminRouter.get("/orders", authenticateSeller, getAdminOrders);
adminRouter.get("/orders/cancelled", authenticateSeller, getAdminCancelledOrders);
adminRouter.patch("/orders/:id/status", authenticateSeller, updateAdminOrderStatus);
adminRouter.get("/users", authenticateSeller, getAdminUsers);
adminRouter.delete("/users/:id", authenticateSeller, deleteAdminUser);

export default adminRouter;
