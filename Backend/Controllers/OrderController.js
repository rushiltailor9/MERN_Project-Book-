const Order = require("../Modules/Order");
const Book = require("../Modules/Book");
const Cart = require("../Modules/Cart");
const Discount = require("../Modules/Discount");

const calculateDiscount = async (book) => {
    const now = new Date();

    let discount = await Discount.findOne({
        bookId: book._id,
        isActive: true,
        startDate: {
            $lte: now
        },
        endDate: {
            $gte: now
        }
    });

    if (!discount) {
        discount = await Discount.findOne({
            bookId: null,
            isActive: true,
            startDate: {
                $lte: now
            },
            endDate: {
                $gte: now
            }
        });
    }

    const originalPrice =
        Number(book.price);

    let discountPercentage = 0;

    if (discount) {
        discountPercentage =
            Number(
                discount.discountPercentage
            );
    }

    const discountAmount =
        Number(
            (
                originalPrice *
                discountPercentage /
                100
            ).toFixed(2)
        );

    const finalPrice =
        Number(
            (
                originalPrice -
                discountAmount
            ).toFixed(2)
        );

    return {
        originalPrice,
        discountPercentage,
        discountAmount,
        finalPrice
    };
};

const placeOrder = async (req, res) => {

    try {
        const userId =
            req.user._id;
        const {
            address,
            paymentMethod = "COD",
            paymentStatus,
            transactionId
        } = req.body;

        if (!address || !address.name || !address.phone || !address.address || !address.city || !address.pincode) {
            return res.status(400).json({
                success: false,
                message: "Complete delivery address is required"
            });
        }

        const cart =
            await Cart.findOne({
                user: userId
            }).populate(
                "items.bookId"
            );

        if (
            !cart ||
            !cart.items ||
            cart.items.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }
        const orderItems = [];
        let subtotal = 0;
        let totalDiscount = 0;
        let totalAmount = 0;

        for (
            const cartItem
            of cart.items
        ) {

            const book =
                cartItem.bookId;

            if (!book) {
                return res.status(404).json({
                    success: false,
                    message: "Book not found"
                });
            }

            const quantity =
                Number(
                    cartItem.quantity
                );

            if ( !quantity || quantity < 1 ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid quantity"
                });
            }

            if ( Number(book.stock) < quantity ) {
                return res.status(400).json({
                    success: false,
                    message: `${book.bookName} has only ${book.stock} books available`
                });
            }
            const priceData = await calculateDiscount(book);
            const originalPrice = priceData.originalPrice;
            const discountPercentage = priceData.discountPercentage;
            const discountAmount = priceData.discountAmount;
            const finalPrice = priceData.finalPrice;
            const itemSubtotal =
                Number(
                    (
                        originalPrice *
                        quantity
                    ).toFixed(2)
                );

            const itemDiscount =
                Number(
                    (
                        discountAmount *
                        quantity
                    ).toFixed(2)
                );

            const itemTotal =
                Number(
                    (
                        finalPrice *
                        quantity
                    ).toFixed(2)
                );
            subtotal += itemSubtotal;
            totalDiscount += itemDiscount;
            totalAmount += itemTotal;

            orderItems.push({
                bookId: book._id,
                bookName: book.bookName,
                quantity: quantity,
                originalPrice: originalPrice,
                discountPercentage: discountPercentage,
                discountAmount: discountAmount,
                price: finalPrice
            });

        }

        subtotal =
            Number(
                subtotal.toFixed(2)
            );

        totalDiscount =
            Number(
                totalDiscount.toFixed(2)
            );

        totalAmount =
            Number(
                totalAmount.toFixed(2)
            );

        const order =
            new Order({
                user: userId,
                items: orderItems,
                address,
                subtotal: subtotal,
                totalDiscount: totalDiscount,
                totalAmount: totalAmount,
                orderStatus: "Pending",
                paymentMethod,
                paymentStatus: paymentStatus || (paymentMethod === "COD" ? "Pending" : "Paid"),
                transactionId
            });

        const savedOrder = await order.save();
            
        for ( const cartItem of cart.items ) {
            const book = cartItem.bookId;
            const quantity = Number( cartItem.quantity );
            await Book.findByIdAndUpdate(
                book._id,
                {
                    $inc: {
                        stock:
                            -quantity
                    }
                }
            );
        }

        cart.items = [];

        await cart.save();

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: savedOrder
        });
    } catch (error) {
        console.error( "Place Order Error:", error );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders =
            await Order.find()
                .populate(
                    "user",
                    "name email"
                )
                .populate(
                    "items.bookId"
                )
                .sort({
                    createdAt: -1
                });

        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error("Get All Orders Error:",error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        const orders =
            await Order.find({
                user: userId
            })
                .populate(
                    "items.bookId"
                )
                .sort({
                    createdAt: -1
                });

        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error( "Get User Orders Error:",error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getOrderById = async ( req, res ) => {
    try {
        const order =
            await Order.findById(
                req.params.id
            )
                .populate(
                    "user",
                    "name email"
                )
                .populate(
                    "items.bookId"
                );
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error( "Get Order Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Order status is required"
            });
        }

        const order =
            await Order.findById( req.params.id );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.orderStatus = status;

        const updatedOrder = await order.save();

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order: updatedOrder
        });
    } catch (error) {
        console.error( "Update Order Status Error:",error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteOrder = async ( req, res) => {

    try {
        const order = await Order.findByIdAndDelete( req.params.id );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });
    } catch (error) {
        console.error( "Delete Order Error:",error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = {
    placeOrder,
    getAllOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
};