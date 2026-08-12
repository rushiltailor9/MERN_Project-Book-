const OrderModel = require("../Modules/Order");
const CartModel = require("../Modules/Cart");

// ======================
// Place Order
// ======================
const placeOrder = async (req, res) => {
    try {
        const userId = req.user?._id || req.body.userId;
        const {
            items,
            totalAmount,
            address,
            paymentMethod
        } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        if (!totalAmount) {
            return res.status(400).json({
                success: false,
                message: "Total amount is required"
            });
        }

        if (!address || !address.name || !address.phone || !address.address || !address.city || !address.pincode) {
            return res.status(400).json({
                success: false,
                message: "All address details (name, phone, address, city, pincode) are required"
            });
        }

        if (!paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "Payment method is required"
            });
        }

        const order = new OrderModel({
            userId,
            items,
            totalAmount,
            address,
            paymentMethod,
            orderStatus: "Pending"
        });

        const savedOrder = await order.save();

        // Clear user's cart in DB after successful order placement
        await CartModel.deleteMany({ userId });

        res.status(201).json({
            success: true,
            message: "Order placed successfully!",
            order: savedOrder
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================
// Get Logged-in User Orders
// ======================
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user?._id || req.params.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const orders = await OrderModel.find({ userId }).sort({ _id: -1 });

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================
// Get All Orders (Admin)
// ======================
const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find({})
            .populate("userId", "firstName lastName email")
            .sort({ _id: -1 });

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================
// Update Order Status (Admin)
// ======================
const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const { id } = req.params;

        if (!orderStatus) {
            return res.status(400).json({
                success: false,
                message: "Order status is required"
            });
        }

        const updatedOrder = await OrderModel.findByIdAndUpdate(
            id,
            { orderStatus },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order: updatedOrder
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    placeOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus
};