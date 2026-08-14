const express = require("express");

const {
    addFavorite,
    removeFavorite,
    getFavorite,
    checkFavorite
} = require("../Controllers/FavoriteController");

const authMiddleware =
    require("../Middleware/AuthMiddleware");

const router = express.Router();


// ADD FAVORITE
// POST /favorite
router.post(
    "/",
    authMiddleware,
    addFavorite
);


// GET ALL FAVORITES
// GET /favorite
router.get(
    "/",
    authMiddleware,
    getFavorite
);


// CHECK FAVORITE
// GET /favorite/:bookId
router.get(
    "/:bookId",
    authMiddleware,
    checkFavorite
);


// REMOVE FAVORITE
// DELETE /favorite/:bookId
router.delete(
    "/:bookId",
    authMiddleware,
    removeFavorite
);


module.exports = router;