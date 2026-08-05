const bcrypt = require("bcrypt");
const UserModel = require("../Modules/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
        password: hashedPassword
    });
    await userModel.save(); //Save the user data in MongoDB
    
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
            email: user.email
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
            name: `${user.firstName} ${user.lastName}`.trim() || user.firstName || user.name || user.email
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
    loginUser
}