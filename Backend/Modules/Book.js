const { required } = require("joi");
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    bookName:{
        type:String,
        required:true
    },
    authorName:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    bookImg:{
        type:String,
        required:true
    },
    language:{
        type:String,
        required:true
    },
    category:{
        type:[String],
        required:true,
        default:[]
    },
    uploadedBy:{
        type:String,
        required:true,
        default:"Guest"
    }
});

const BookModel = mongoose.model("books", bookSchema);

module.exports = BookModel;