const mongoose = require("mongoose");
const FavoriteModel = require("../Modules/Favorite");


// ==========================================
// ADD FAVORITE
// POST /favorite
// ==========================================

const addFavorite = async (req, res) => {
    try {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User is not authenticated"
            });
        }


        const userId = req.user._id;
        const { bookId } = req.body;


        if (!bookId) {
            return res.status(400).json({
                success: false,
                message: "BookId is required"
            });
        }


        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid BookId"
            });
        }


        // Check already favorite
        const existingFavorite =
            await FavoriteModel.findOne({
                userId,
                bookId
            });


        if (existingFavorite) {
            return res.status(400).json({
                success: false,
                message: "Book is already in favorites"
            });
        }


        const favorite =
            await FavoriteModel.create({
                userId,
                bookId
            });


        return res.status(201).json({
            success: true,
            message: "Book added to favorite",
            favorite
        });

    } catch (error) {

        console.error(
            "Add Favorite Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// REMOVE FAVORITE
// DELETE /favorite/:bookId
// ==========================================

const removeFavorite = async (req, res) => {
    try {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User is not authenticated"
            });
        }


        const userId = req.user._id;
        const { bookId } = req.params;


        if (!bookId) {
            return res.status(400).json({
                success: false,
                message: "BookId is required"
            });
        }


        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid BookId"
            });
        }


        const favorite =
            await FavoriteModel.findOneAndDelete({
                userId,
                bookId
            });


        if (!favorite) {
            return res.status(404).json({
                success: false,
                message: "Book is not found in favorites"
            });
        }


        return res.status(200).json({
            success: true,
            message: "Book removed from favorite"
        });

    } catch (error) {

        console.error(
            "Remove Favorite Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// GET FAVORITES
// GET /favorite
// ==========================================

const getFavorite = async (req, res) => {
    try {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User is not authenticated"
            });
        }


        const userId = req.user._id;


        const favorite =
            await FavoriteModel
                .find({ userId })
                .populate(
                    "bookId",
                    "bookName authorName price bookImg language category stock"
                )
                .sort({
                    createdAt: -1
                });


        return res.status(200).json({
            success: true,
            favorite
        });

    } catch (error) {

        console.error(
            "Get Favorite Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// CHECK FAVORITE
// GET /favorite/:bookId
// ==========================================

const checkFavorite = async (req, res) => {
    try {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User is not authenticated"
            });
        }


        const userId = req.user._id;
        const { bookId } = req.params;


        if (!bookId) {
            return res.status(400).json({
                success: false,
                message: "BookId is required"
            });
        }


        const favorite =
            await FavoriteModel.findOne({
                userId,
                bookId
            });


        return res.status(200).json({
            success: true,
            isFavorite: !!favorite
        });

    } catch (error) {

        console.error(
            "Check Favorite Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    addFavorite,
    removeFavorite,
    getFavorite,
    checkFavorite
};