const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../Middleware/AuthMiddleware");

const {
    createInvoice,
    getInvoice
} =
    require("../Controllers/InvoiceController");


router.post(
    "/create",
    authMiddleware,
    createInvoice
);


router.get(
    "/:orderId",
    authMiddleware,
    getInvoice
);


module.exports = router;