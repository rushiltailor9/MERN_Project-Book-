const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/AuthMiddleware");
const {
  addToCart,
  getCart,
  updateQuantity,
  deleteCartItem,
  clearCart,
} = require("../Controllers/CartController");

router.use(authMiddleware);

router.post("/add", addToCart);
router.get("/", getCart);
router.put("/update/:id", updateQuantity);
router.delete("/delete/:id", deleteCartItem);
router.delete("/delete", clearCart);

module.exports = router;
