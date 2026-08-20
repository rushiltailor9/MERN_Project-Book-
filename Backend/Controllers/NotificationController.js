const NotificationModel = require("../Modules/Notification");

const getNotification = async(req, res) =>{
    try{
        const filter = { recevier: req.user._id };
        const [notifications, unreadCount] = await Promise.all([
            NotificationModel.find(filter)
                .sort({ createdAt: -1 })
                .limit(50)
                .lean(),
            NotificationModel.countDocuments({
                ...filter,
                isRead: false
            })
        ]);

            res.status(200).json({
                success: true,
                notifications,
                unreadCount
            });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

const markNotificationRead = async(req, res) =>{
    try{
        const notifications = await NotificationModel.findOneAndUpdate(
            {
                _id: req.params.id,
                recevier: req.user._id
            },
            {
                isRead: true
            },
            {
                new: true
            }
        )

        if(!notifications){
            return res.status(404).json({
                success: false,
                message: "Notification Is Not Found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Notification Mark as read",
            notifications
        })
    }catch(error){

        console.error("Mark Notification Error",error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const markAllNotificationsRead = async(req, res) => {
    try {
        await NotificationModel.updateMany(
            {
                recevier: req.user._id,
                isRead: false
            },
            {
                isRead: true
            }
        );

        res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });
    } catch (error) {
        console.error("Mark all Notification Error",error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    getNotification,
    markNotificationRead,
    markAllNotificationsRead
}
