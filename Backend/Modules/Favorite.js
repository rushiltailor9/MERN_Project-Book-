const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },

        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "books",
            required: true
        }
    },
    {
        timestamps: true
    }
);


// Same user cannot favorite same book twice
favoriteSchema.index(
    {
        userId: 1,
        bookId: 1
    },
    {
        unique: true
    }
);


const FavoriteModel =
    mongoose.model(
        "favorites",
        favoriteSchema
    );

module.exports = FavoriteModel;