const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        orderId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        },
        amount:{
            type: String,
            required:true
        },
        paymentMethod:{
            type: String,
            enum: ["dummy_card", "dummy_upi", "fake_card", "cod", "COD", "ONLINE", "online"],
            default: "dummy_card"
        },
        paymentStatus:{
            type: String,
            enum: ["pending", "success", "failed", "PAID", "paid"],
            default: "pending"
        },
        transactionId:{
            type:String,
            sparse: true
        }
    }
);

const PaymentModel = mongoose.model("payment",paymentSchema);

module.exports = PaymentModel;

