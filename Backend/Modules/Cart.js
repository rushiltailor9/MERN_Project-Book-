const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        bookId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Book",
            require:true
        },
        bookName:{
            type: String,
            require:true
        },
        authorName:{
            type: String,
            require:true
        },
        price:{
            type: Number,
            require:true
        },
        bookImg:{
            type: String,
            require:true
        },
        language:{
            type: String,
            require:true
        },
        quantity:{
            type: Number,
            default:1
        }
    
    }
);

const CartModel = mongoose.model("cart", cartSchema);

module.exports = CartModel;
