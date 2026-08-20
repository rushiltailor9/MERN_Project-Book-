const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        recevier:{
            type: mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"users"
        },
        recevierRole:{
            type: String,
            enum:["user", "admin"],
            required: true
        },
        type:{
            type:String,
            enum:["ORDER","USER","FEEDBACK","LOW_STOCK","OUT_OF_STOCK"],
            required:true
        },
        title:{
            type: String,
            required: true
        },
        message:{
            type: String,
            required: true
        },
        orderId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"orders",
            default:null
        },
        bookId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"books",
            default:null
        },
        isRead:{
            type:Boolean,
            default:false
        }
    },
    {
        timestamps: true
    }
)

const NotificationModel = mongoose.model("Notification",notificationSchema);

module.exports = NotificationModel;
