const UserModel = require("../Modules/User");
const NotificationModel = require("../Modules/Notification");

// Admin events are shared with every admin account, not just the first one found.
const createAdminNotifications = async ({ type, title, message, orderId = null }) => {
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
            isRead: false
        }))
    );
};

module.exports = createAdminNotifications;
