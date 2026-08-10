const express = require("express");
const authMiddleware = require("../Middleware/AuthMiddleware");
const adminMiddleware = require("../Middleware/AdminMiddleware");

const router = express.Router();

router.get("/dashboard",authMiddleware,adminMiddleware,(req, res)=>{
    res.status(200).json({
        message:"Welcome to admin dashboard",
        success:true,
        admin:req.user
    });
})

module.exports = router;