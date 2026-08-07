const express = require("express");
const { createContact, getAllContact } = require("../Controllers/ContactController");
// const { contactValidtion } = require("../Middleware/ContactValidation");
const router = express.Router();

router.post('/',createContact);

router.get('/',getAllContact);

module.exports = router;