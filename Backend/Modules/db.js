const mongoose = require("mongoose");

const mongo_url = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/booksDB";

mongoose.connect(mongo_url)
    .then(()=>{
        console.log("MongoDB Connected Successfully✅");
    }).catch((error)=>{
        console.log("MongoDB COnnection Failed❌", error);
    });