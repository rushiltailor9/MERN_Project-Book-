const express = require("express");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("./Modules/db");
const UserRouter = require("./Routes/UserRouter");
const BookRouter = require("./Routes/BookRouter");

const PORT = process.env.PORT || 5000;

app.get("/",(req, res)=>{
    res.send("Hello From index.js");
});

app.use(bodyParser.json());
app.use(cors());

app.use('/auth',UserRouter);
app.use('/book',BookRouter)

app.listen(PORT,()=>{
    console.log(`Server Is Running On Port ${PORT}`);
});