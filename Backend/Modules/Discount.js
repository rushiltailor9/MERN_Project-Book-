const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
    {
        bookId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "books",
            required: false,
            default: null
        },
        discountPercentage:{
            type: Number,
            required: true,
            min:0,
            max:100
        },
        startDate:{
            type:Date,
            required:true
        },
        endDate:{
            type:Date,
            required:true
        },
        isActive:{
            type:Boolean,
            default:true
        }

    },
    { timestamps: true }
);

const DiscountModel = mongoose.model("discount",discountSchema);

module.exports = DiscountModel;