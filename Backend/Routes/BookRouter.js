const express = require("express");
const { createBooks, fetchBooks, deleteBookById, updateBookById } = require("../Controllers/BookController");
const router = express.Router();

router.get("/",fetchBooks);

router.post("/",createBooks);

router.put("/:id", updateBookById);

router.delete("/:id", deleteBookById);

module.exports = router;