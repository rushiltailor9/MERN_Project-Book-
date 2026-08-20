const express = require("express");

const router = express.Router();

const {
    addDiscount,
    getAllDiscounts,
    getBookDiscount,
    updateDiscount,
    deleteDiscount
} = require("../Controllers/DiscountController");

router.post("/",addDiscount);

router.get("/",getAllDiscounts);

router.put("/:id",updateDiscount);

router.delete("/:id",deleteDiscount);

router.get("/book/:bookId",getBookDiscount);

module.exports = router;