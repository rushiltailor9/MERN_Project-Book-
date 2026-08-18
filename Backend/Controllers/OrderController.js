const OrderModel = require("../Modules/Order");
const CartModel = require("../Modules/Cart");
const BookModel = require("../Modules/Book");
const NotificationModel = require("../Modules/Notification");
const createAdminNotifications = require("../Utils/createAdminNotifications");

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

        if (!address || 
            !address.name ||
            !address.phone || 
            !address.address || 
            !address.city || 
            !address.pincode
        ) {
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

        for( const item of items){
            const book = await BookModel.findById(item.bookId);

            if(!book){
                return res.status(400).json({
                    success:false,
                    message: `Book "${item.bookName} Is Not Found"`
                });
            }
            const quantity = Number(item.quantity);

            if (!Number.isInteger(quantity) || quantity <= 0) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid quantity for ${book.bookName}`
                });
            }

            if (Number(book.stock) < quantity) {
                return res.status(400).json({
                    success: false,
                    message: `"${book.bookName}" has only ${book.stock} copies available`
                });
            }
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

        for (const item of items){


            const quantity = Number(item.quantity);

            const book = await BookModel.findById(item.bookId);

            if (!book) {
                return res.status(404).json({
                    success: false,
                    message: "Book not found"
                });
            }

            const currentStock = Number(book.stock);

            if (currentStock < quantity) {
                return res.status(400).json({
                    success: false,
                    message: `${book.bookName} has only ${currentStock} copies available`
                });
            }

            book.stock = currentStock - quantity;

            await book.save();
        }

        // Clear user's cart in DB after successful order placement
        await CartModel.deleteMany({ userId });

        await createAdminNotifications({
            type: "ORDER",
            title: "New Order",
            message: `New order #${savedOrder._id.toString().substring(0, 8)} has been placed`,
            orderId: savedOrder._id
        });

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

        const allowedStatues = [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ];

        if(!allowedStatues.includes(orderStatus)){
            return res.status(400).json({
                success: false,
                message: "Invalid Order Status"
            });
        }

        const order = await OrderModel.findById(id);

        if(!order){
            return res.status(400).json({
                success: false,
                message: "Order Is Not Found"
            });
        }

        if(order.orderStatus === orderStatus){
            res.status(200).json({
                success: true,
                message: "Status is already the same",
                order
            });
        }

        // const oldStatus = order.orderStatus;

        order.orderStatus = orderStatus;
 
        const updateOrder = await order.save();


        let notificationTitle = "";
        let notificationMessage = "";

        switch(orderStatus){
            case "Pending":
                notificationTitle = "Order Pending";
                notificationMessage = 
                    `Your order #${order._id
                        .toString()
                        .substring(0,8)}
                        is pending.`;
                break;

            case "Processing":
                notificationTitle = "Order Processing";
                notificationMessage = 
                    `Your order #${order._id
                        .toString()
                        .substring(0,8)}
                        is now being processed.`;
                break;

            case "Shipped":
                notificationTitle = "Order Processing";
                notificationMessage = 
                    `Your order #${order._id
                        .toString()
                        .substring(0,8)}
                        has now been shipped.`;
                break;

            case "Delivered":
                notificationTitle = "Order Delivered";
                notificationMessage = 
                    `Your order #${order._id
                        .toString()
                        .substring(0,8)}
                        has been Delivered.`;
                break;
       
            case "Cancelled":
                notificationTitle = "Order Cancelled";
                notificationMessage = 
                    `Your order #${order._id
                        .toString()
                        .substring(0,8)}
                        has been cancelled.`;
                break;

        default:
            notificationTitle = "Order Updated"
            notificationMessage = `Your Order status changed to ${orderStatus}`
        }

        await NotificationModel.create({
            recevier: order.userId,
            recevierRole: "user",
            type: "ORDER",
            title: notificationTitle,
            message: notificationMessage,
            orderId: order._id,
            isRead: false
        });
        res.status(200).json({
            success: true,
            message:`Order status changed from ${oldStatus} to ${orderStatus}`,
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
