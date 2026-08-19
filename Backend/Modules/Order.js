const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            require: true
        },
        items:[
            {
                bookId:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref : "books",
                    require: true
                },
                bookName:{
                    type: String,
                    require: true
                },
                price:{
                    type: Number,
                    require: true
                },
                quantity: {
                    type:Number,
                    require:true
                },
                bookImg:{
                    type:String
                }
            }
        ],
        totalAmount:{
            type: Number,
            require: true
        },
        address:{
            name:{
                type:String,
                require: true
            },
            phone:{
                type:String,
                require: true
            },
            address:{
                type:String,
                require: true
            },
            city:{
                type:String,
                require: true
            },
            pincode:{
                type:String,
                require: true
            }
        },
        orderStatus:{
            type: String,
            default:"Pending"
        },
        paymentMethod: {
            type: String,
            enum: ["fake_card", "cod", "dummy_card", "dummy_upi", "COD", "ONLINE", "online"],
            default: "COD"
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "success", "Pending", "Paid", "Failed", "Success"],
            default: "pending"
        },

        transactionId: {
            type: String
        },

        invoiceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "invoice"
        }
    },
    { timestamps: true }
);

const OrderModel = mongoose.model("orders",orderSchema);

module.exports = OrderModel;