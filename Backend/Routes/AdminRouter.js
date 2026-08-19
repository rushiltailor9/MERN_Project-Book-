const express = require("express");
const authMiddleware = require("../Middleware/AuthMiddleware");
const adminMiddleware = require("../Middleware/AdminMiddleware");
const {
    fetchUser,
    toggelBlockUser,
    deleteUser
} = require("../Controllers/UserController");

const router = express.Router();

router.get("/dashboard",authMiddleware,adminMiddleware,(req, res)=>{
    res.status(200).json({
        message:"Welcome to admin dashboard",
        success:true,
        admin:req.user
    });
});

router.get("/users",authMiddleware,adminMiddleware,fetchUser);

router.patch("/users/:id/block",authMiddleware,adminMiddleware,toggelBlockUser);

router.delete("/users/:id",authMiddleware,adminMiddleware,deleteUser);

module.exports = router;