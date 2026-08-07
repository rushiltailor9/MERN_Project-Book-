const express = require("express");
const { createFeedback, getAllFeedback } = require("../Controllers/FeedbackController");
const router = express.Router();



router.post('/',createFeedback);

router.get('/', getAllFeedback);

module.exports = router;