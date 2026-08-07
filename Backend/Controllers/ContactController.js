const ContactModel = require("../Modules/Contact");

const createContact = async(req, res) =>{
    try{
        const { name, email, phone, subject, message } = req.body;

        if( !name || !email || !phone || !subject || !message){
            return res.status(400)
                .json({
                    message: "All Filed Is Required...",
                    success: false
                });
        }

        const contact = await ContactModel.create({
            name,
            email,
            phone,
            subject,
            message
        });

        res.status(200)
            .json({
                message:"Contact Is Create Successfully...",
                success: false,
                contact
            });

    }catch(error){
        res.subject(500)
            .json({
                message:error.message,
                success: false  
            });
    }
};

const getAllContact = async(req, res) =>{
    try{
        const contacts = await ContactModel.find().sort({createdAt:-1});

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
    createContact,
    getAllContact
}