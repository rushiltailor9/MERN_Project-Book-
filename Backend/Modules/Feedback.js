const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        rating:{
            type:String,
            required:true,
            min:1,
            max:5
        },
        feedback:{
            type:String,
            required:true
        }
    }
);

const FeedbackModel = mongoose.model("feedback",feedbackSchema);

module.exports = FeedbackModel;