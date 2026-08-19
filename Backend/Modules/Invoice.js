const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber:{
            type: String,
            required: true,
            unique: true
        },
        orderId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true
        },
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        customerName:{
            type: String,
            required: true
        },
        customerEmail:{
            type: String,
            default: ""
        },
        items:[
            {
                bookName: String,
                quantity: Number,
                price: Number
            }
        ],
        subTotal:{
            type: Number,
            required: true
        },
        discount:{
            type: Number,
            default: 0
        },
        totalAmount:{
            type: Number,
            required: true
        },
        paymentMethod:{
            type: String,
            default: "COD"
        },
        paymentStatus:{
            type: String,
            default: "PAID"
        },
        transactionId:{
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

const InvoiceModel = mongoose.model("invoice",invoiceSchema);

module.exports = InvoiceModel;