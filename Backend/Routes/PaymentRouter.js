const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../Middleware/AuthMiddleware");

const {
    createDummyPayment
} =
    require("../Controllers/PaymentController");


router.post(
    "/dummy",
    authMiddleware,
    createDummyPayment
);


module.exports = router;