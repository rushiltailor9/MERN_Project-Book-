const bcrypt = require("bcrypt");
const UserModel = require("../Modules/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const createAdminNotifications = require("../Utils/createAdminNotifications");

//Register Logic
const registerUser = async (req, res) =>{
    try{
    const {firstName, lastName, email, password} = req.body; //Client data
    const user = await UserModel.findOne({email}); //MongoDB Data


    if(user){
        return res.status(400)
            .json({
                message: "User Already Exists",
                success: false
            });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const userModel = new UserModel({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role:"user"
    });
    await userModel.save(); //Save the user data in MongoDB

    await createAdminNotifications({
        type: "USER",
        title: "New User Registered",
        message: `${firstName} ${lastName} has registered on READ-EASY.`
    });
    
    res.status(201)
        .json({
            message: "Register Successfully...",
            success:true
        });
    }catch(error){
        console.error("Register Error:", error);
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Email already registered",
                success: false
            });
        }
        res.status(500)
            .json({
                message: "Internal Server Error",
                success: false,
                error: error.message
            });
    }
}

const fetchUser = async(req, res) =>{
    try{
        const data = await UserModel
            .find({})
            .select("-password");

        res.status(200)
            .json({
                message:"User Is Fetch",
                success:true,
                data
            });
    }catch(error){
        console.error("Error fetching books:", error);
        res.status(500)
            .json({
                message:"User Is Not Fetch",
                error: error.message,
                success:false
            });
    }
}

const toggelBlockUser = async(req, res) =>{
    try{
        const {id} = req.params;
        
        const user = await UserModel.findById(id);

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User Is Not Found"
            });
        }

        if(user.role === "admin"){
            return res.status(403).json({
                success: false,
                message: "Admin Can't be Blocked"
            });
        }

        user.isBlocked = !user.isBlocked;

        await user.save();

        res.status(200).json({
            success:true,
            message: user.isBlocked 
                ? "User Is Blocked Successfully"
                : "User Is UnBlocked Successfully" ,
            user:{
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                isBlocked: user.isBlocked
            }
        });
        
    }catch(error){
        console.error("Toggel Blocked Error",error);

        res.status(500).json({
            success:true,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

const deleteUser = async(req, res) =>{
    try{
        const {id} = req.params;

        const user = await UserModel.findById(id);

        if(!user){
            return res.status(403).json({
                success: false,
                message: "User is not found"
            });
        }

        if(user.role === "admin"){
            return res.status(403).json({
                success: false,
                message: "Admin can't be Deleted"
            });
        }

        await UserModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "User Deleted Successfully"
        });
    }catch(error){
        console.log("Deleted User",error);

        res.status(500).json({
            success: false,
            message: "Inetrnal server error",
            error: error.message
        })
    }
}


//Login Logic
const loginUser = async (req, res) =>{
    try{
    const {email, password} = req.body; //Client data
    const user = await UserModel.findOne({email}); //MongoDB Data

    if(!user){
        return res.status(400)
            .json({
                message: "Email or Password is incorrect",
                success: false
            });
    }
    if(user.isBlocked){
        return res.status(403).json({
            success:false,
            message:"Your Account is blocked by admin"
        });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if(!isPasswordCorrect){
        return res.status(400)
            .json({
                message: "Email or Password is incorrect",
                success: false
            })
    }

    const jwtToken = jwt.sign(
        {
            _id: user._id,
            email: user.email,
            role: user.role

        },
        process.env.JWT_SECRET,
        { expiresIn: '24h'}
    );
    
    res.status(201)
        .json({
            message: "Login Successfully...",
            success:true,
            jwtToken,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`.trim(),
            role: user.role
        });
    }catch(error){
        console.log(error);
        res.status(500)
            .json({
                message: "Internal Server Error",
                success: false
            });
    }
}

module.exports = {
    registerUser,
    fetchUser,
    loginUser,
    toggelBlockUser,
    deleteUser
}
