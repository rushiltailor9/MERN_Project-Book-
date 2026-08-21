const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user:{
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
                originalPrice:{
                    type: Number,
                    require: true
                },
                discountPrice:{
                    type: Number,
                    require: 0
                },
                discountAmount:{
                    type: Number,
                    require: 0
                },
                discountPercentage:{
                    type: Number,
                    default: 0
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
        subtotal: {
            type: Number,
            default: 0
        },

        totalDiscount: {
            type: Number,
            default: 0
        },

        totalAmount: {
            type: Number,
            required: true
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