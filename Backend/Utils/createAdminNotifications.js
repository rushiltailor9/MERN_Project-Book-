const UserModel = require("../Modules/User");
const NotificationModel = require("../Modules/Notification");

// Admin events are shared with every admin account, not just the first one found.
const createAdminNotifications = async ({ type, title, message, orderId = null, bookId = null }) => {
    const admins = await UserModel.find({ role: "admin" }).select("_id").lean();

    if (admins.length === 0) {
        return;
    }

    await NotificationModel.insertMany(
        admins.map((admin) => ({
            recevier: admin._id,
            recevierRole: "admin",
            type,
            title,
            message,
            orderId,
            bookId,
            isRead: false
        }))
    );
};

const createLowStockNotification = async (book) => {
    const stock = Number(book?.stock);

    if (!book || Number.isNaN(stock) || stock > 5) {
        return;
    }

    const isOutOfStock = stock === 0;
    const type = isOutOfStock ? "OUT_OF_STOCK" : "LOW_STOCK";
    const existingNotification = await NotificationModel.findOne({
        recevierRole: "admin",
        type: { $in: ["LOW_STOCK", "OUT_OF_STOCK"] },
        bookId: book._id,
        isRead: false
    });

    const title = `${isOutOfStock ? "Out of stock" : "Low stock"}: ${book.bookName}`;
    const message = isOutOfStock
        ? `"${book.bookName}" is out of stock.`
        : `"${book.bookName}" is low on stock. Only ${stock} copies left.`;

    if (existingNotification) {
        if (existingNotification.type !== type || existingNotification.message !== message) {
            await NotificationModel.updateMany(
                {
                    recevierRole: "admin",
                    type: { $in: ["LOW_STOCK", "OUT_OF_STOCK"] },
                    bookId: book._id,
                    isRead: false
                },
                {
                    type,
                    title,
                    message
                }
            );
        }
        return;
    }

    await createAdminNotifications({
        type,
        title,
        message,
        bookId: book._id
    });
};

const createDiscountNotifications = async ({ discountPercentage, bookName = null, bookId = null }) => {
    try {
        const users = await UserModel.find({ role: "user" }).select("_id").lean();
        if (users.length === 0) return;

        const title = bookName
            ? `Special Offer: ${discountPercentage}% OFF on ${bookName}!`
            : `Special Offer: ${discountPercentage}% OFF on All Books!`;

        const message = bookName
            ? `Get ${discountPercentage}% discount on "${bookName}". Limited time offer!`
            : `Enjoy ${discountPercentage}% discount across the store. Shop your favorite books now!`;

        await NotificationModel.insertMany(
            users.map((user) => ({
                recevier: user._id,
                recevierRole: "user",
                type: "DISCOUNT",
                title,
                message,
                bookId,
                isRead: false
            }))
        );
    } catch (err) {
        console.error("Discount notification error:", err);
    }
};

module.exports = createAdminNotifications;
module.exports.createLowStockNotification = createLowStockNotification;
module.exports.createDiscountNotifications = createDiscountNotifications;
