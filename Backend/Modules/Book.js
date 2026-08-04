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
    }
});

const BookModel = mongoose.model("books", bookSchema);

module.exports = BookModel;