const express = require("express");
const {placeOrder} = require("../Controllers/OrderController");
const router = express.Router();

router.post("/",placeOrder);

module.exports = router;