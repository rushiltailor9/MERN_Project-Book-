const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserModel = require("./User");

const mongo_url = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/booksDB";

const ensureAdminUser = async () => {
    try {
        const adminEmail = "admin@gmail.com";
        let admin = await UserModel.findOne({ email: adminEmail });

        if (!admin) {
            const hashedPassword = await bcrypt.hash("admin", 10);
            await UserModel.create({
                firstName: "Admin",
                lastName: "User",
                email: adminEmail,
                password: hashedPassword,
                role: "admin",
            });
            console.log("Default admin user created (admin@gmail.com / admin)");
        } else if (admin.role !== "admin") {
            admin.role = "admin";
            await admin.save();
        }
    } catch (error) {
        console.error("Admin seed error:", error.message);
    }
};

mongoose.connect(mongo_url)
    .then(async () => {
        console.log("MongoDB Connected Successfully✅");
        await ensureAdminUser();
    }).catch((error) => {
        console.log("MongoDB COnnection Failed❌", error);
    });