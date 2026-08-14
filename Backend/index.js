const express = require("express");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("./Modules/db");
const UserRouter = require("./Routes/UserRouter");
const BookRouter = require("./Routes/BookRouter");
const CartRouter = require("./Routes/CartRouter");
const ContactRouter = require("./Routes/ContactRouter");
const FeedbackRouter = require("./Routes/FeedbackRouter");
const AdminRouter = require("./Routes/AdminRouter");
const OrderRouter = require("./Routes/OrderRouter");
const FavoriteRouter = require("./Routes/FavoriteRouter");

const PORT = process.env.PORT || 5000;

app.get("/",(req, res)=>{
    res.send("Hello From index.js");
});

app.use(
    cors({
        origin:"http://localhost:5173"
    })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use('/auth',UserRouter);

app.use('/book',BookRouter);

app.use('/cart',CartRouter);

app.use('/contact',ContactRouter);

app.use('/feedback',FeedbackRouter);

app.use('/admin',AdminRouter);

app.use('/order',OrderRouter);

app.use('/favorite',FavoriteRouter)

app.listen(PORT,()=>{
    console.log(`Server Is Running On Port ${PORT}`);
});