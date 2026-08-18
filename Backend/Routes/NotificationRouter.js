const express = require("express");

const authMiddleware = require("../Middleware/AuthMiddleware");
const {
    getNotification,
    markNotificationRead,
    markAllNotificationsRead
} = require("../Controllers/NotificationController");

const router = express.Router();

router.get("/",authMiddleware,getNotification);

router.put("/read-all", authMiddleware, markAllNotificationsRead);

router.put("/:id",authMiddleware,markNotificationRead);

module.exports = router;
