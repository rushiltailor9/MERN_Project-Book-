const Invoice = require("../Modules/Invoice");
const Order = require("../Modules/Order");

// =======================================
// CREATE INVOICE
// =======================================
const createInvoice = async (req, res) => {
    try {
        const userId = req.user._id;
        const { orderId, payment } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required"
            });
        }

        // Find order (allow order owner or admin)
        const orderQuery = req.user.role === "admin" ? { _id: orderId } : { _id: orderId, userId };
        const order = await Order.findOne(orderQuery);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Check if invoice already exists for this order
        const existingInvoice = await Invoice.findOne({ orderId: order._id });

        if (existingInvoice) {
            return res.status(200).json({
                success: true,
                message: "Invoice already exists",
                invoice: existingInvoice
            });
        }

        const customerName = order.address?.name || req.user.name || "READ-EASY Customer";
        const customerEmail = req.user.email || "";
        const invoiceNumber = "INV-" + Date.now();

        const invoiceItems = (order.items || []).map((item) => ({
            bookName: item.bookName || "Book",
            quantity: item.quantity || 1,
            price: item.price || 0
        }));

        const isCOD = ["COD", "cod"].includes(order.paymentMethod);
        const paymentMethod = payment?.paymentMethod || order.paymentMethod || "COD";
        const paymentStatus = payment?.paymentStatus || (isCOD ? "COD - Pending" : "PAID");
        const transactionId = payment?.transactionId || order.transactionId || (isCOD ? "N/A" : ("TXN_" + Date.now()));

        const invoice = await Invoice.create({
            invoiceNumber,
            orderId: order._id,
            userId: order.userId,
            customerName,
            customerEmail,
            items: invoiceItems,
            subTotal: order.totalAmount,
            discount: 0,
            totalAmount: order.totalAmount,
            paymentMethod,
            paymentStatus,
            transactionId
        });

        order.invoiceId = invoice._id;
        await order.save();

        return res.status(201).json({
            success: true,
            message: "Invoice created successfully",
            invoice
        });

    } catch (error) {
        console.error("Invoice error:", error);
        return res.status(500).json({
            success: false,
            message: "Invoice creation failed",
            error: error.message
        });
    }
};

// =======================================
// GET INVOICE
// =======================================
const getInvoice = async (req, res) => {
    try {
        const userId = req.user._id;
        const { orderId } = req.params;

        let query = { orderId };
        if (req.user.role !== "admin") {
            query.userId = userId;
        }

        let invoice = await Invoice.findOne(query);

        // If invoice doesn't exist yet, auto-generate it if order exists
        if (!invoice) {
            const orderQuery = req.user.role === "admin" ? { _id: orderId } : { _id: orderId, userId };
            const order = await Order.findOne(orderQuery);

            if (order) {
                const invoiceNumber = "INV-" + Date.now();
                const invoiceItems = (order.items || []).map((item) => ({
                    bookName: item.bookName || "Book",
                    quantity: item.quantity || 1,
                    price: item.price || 0
                }));

                const isCOD = ["COD", "cod"].includes(order.paymentMethod);
                const paymentMethod = order.paymentMethod || "COD";
                const paymentStatus = order.paymentStatus === "paid" ? "PAID" : (isCOD ? "COD - Pending" : "PAID");
                const transactionId = order.transactionId || (isCOD ? "N/A" : ("TXN_" + Date.now()));

                invoice = await Invoice.create({
                    invoiceNumber,
                    orderId: order._id,
                    userId: order.userId,
                    customerName: order.address?.name || req.user.name || "READ-EASY Customer",
                    customerEmail: req.user.email || "",
                    items: invoiceItems,
                    subTotal: order.totalAmount,
                    discount: 0,
                    totalAmount: order.totalAmount,
                    paymentMethod,
                    paymentStatus,
                    transactionId
                });

                order.invoiceId = invoice._id;
                await order.save();
            }
        }

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found"
            });
        }

        return res.status(200).json({
            success: true,
            invoice
        });

    } catch (error) {
        console.error("Get invoice error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to get invoice",
            error: error.message
        });
    }
};

module.exports = {
    createInvoice,
    getInvoice
};