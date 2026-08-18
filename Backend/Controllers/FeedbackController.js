const FeedbackModel = require("../Modules/Feedback");
const createAdminNotifications = require("../Utils/createAdminNotifications");

const createFeedback = async(req, res) =>{
    try{
        const {
            name,
            email,
            rating,
            feedback
        } = req.body;

        if( !name || !email || !rating || !feedback){
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const newFeedback = await FeedbackModel.create({
            name,
            email,
            rating,
            feedback
        });

        await createAdminNotifications({
            type: "FEEDBACK",
            title: "New Feedback",
            message: `${name} has submitted new feedback.`
        });

        res.status(200).json({
            message:"Feedback submitted Successfully",
            success:true,
            newFeedback
        });

    }catch(error){
        res.status(500).json({
            message:"Internal Server error",
            success: false,
            error: error.message
        });
    }
};

const getAllFeedback = async(req, res) =>{
    try{
        const contacts = await FeedbackModel.find().sort({createdAt:-1});

        res.status(200)
            .json({
                success: true,
                contacts
            });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    createFeedback,
    getAllFeedback
}
