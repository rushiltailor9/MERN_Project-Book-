const express = require("express");
const authMiddleware = require("../Middleware/AuthMiddleware");
const {
    placeOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus
} = require("../Controllers/OrderController");

const router = express.Router();

// Apply auth middleware to protect order routes
router.use(authMiddleware);

router.post("/", placeOrder);
router.get("/my-orders", getUserOrders);
router.get("/all", getAllOrders);
router.put("/status/:id", updateOrderStatus);

module.exports = router;