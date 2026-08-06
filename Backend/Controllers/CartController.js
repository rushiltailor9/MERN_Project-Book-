const CartModel = require("../Modules/Cart");

// ======================
// Add To Cart
// ======================
const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      bookId,
      bookName,
      authorName,
      price,
      bookImg,
      language,
      quantity,
    } = req.body;

    if (
      !bookId ||
      !bookName ||
      !authorName ||
      !price ||
      !bookImg ||
      !language
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const existingBook = await CartModel.findOne({ bookId, userId });

    if (existingBook) {
      existingBook.quantity += quantity || 1;
      await existingBook.save();

      return res.status(200).json({
        success: true,
        message: "Book quantity updated successfully.",
        cart: existingBook,
      });
    }

    const cartItem = await CartModel.create({
      userId,
      bookId,
      bookName,
      authorName,
      price,
      bookImg,
      language,
      quantity: quantity || 1,
    });

    res.status(201).json({
      success: true,
      message: "Book added to cart successfully.",
      cart: cartItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// Get Cart
// ======================
const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await CartModel.find({ userId });

    res.status(200).json({
      success: true,
      totalItems: cart.length,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// Update Quantity
// ======================
const updateQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1.",
      });
    }

    const cart = await CartModel.findOneAndUpdate(
      { _id: req.params.id, userId },
      { quantity },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Quantity updated successfully.",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// Delete Cart Item
// ======================
const deleteCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await CartModel.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item removed successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// Clear Cart
// ======================
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    await CartModel.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateQuantity,
  deleteCartItem,
  clearCart,
};
