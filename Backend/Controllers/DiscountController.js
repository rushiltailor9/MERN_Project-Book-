const DiscountModel = require("../Modules/Discount");

const addDiscount = async(req, res) =>{
    try{
        const {
            bookId,
            discountPercentage,
            startDate,
            endDate
        } = req.body;

        if(discountPercentage === undefined || !startDate || !endDate){
            return res.status(400).json({
                success: false,
                message: "Discount Percentage, start date and end date require"
            });
        }
        if(discountPercentage < 0 || discountPercentage > 100){
            return res.status(400).json({
                success: false,
                message: "Discount must be between 0 to 100"
            });
        }
        if(new Date(startDate) > new Date(endDate)){
            return res.status(400).json({
                success: false,
                message: "Start date cannot be after end date"
            });
        }
        const existingDiscount = await DiscountModel.findOne({
            bookId: bookId || null,
            isActive: true
        });
        if(existingDiscount){
            return res.status(400).json({
                success: true,
                message: "Active Discount already exists for this work"
            });
        }
        const discount = await DiscountModel.create({
            bookId: bookId || null,
            discountPercentage: Number(discountPercentage),
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            isActive: true
        });

        res.status(200).json({
            success: true,
            message: "Discount added Successfully",
            discount
        });
    }catch(error){
        console.error("Add Discount Error",error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const getAllDiscounts = async(req, res) =>{
    try{
        const discounts = await DiscountModel.find().populate("bookId","bookName price bookImg").sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            discounts
        });
    }catch(error){
        res.status(500).json({
            success: true,
            message: error.message
        });
    }
}

const getBookDiscount = async(req, res) =>{
    try{
        const bookId = req.params.bookId;
        const now = new Date();

        let discount = await DiscountModel.findOne({
            bookId,
            isActive:true,
            startDate:{
                $lte: now
            },
            endDate:{
                $gte: now
            }
        });
        if(!discount){
            discount = await DiscountModel.findOne({
            bookId,
            isActive:true,
            startDate:{
                $lte: now
            },
            endDate:{
                $gte: now
            }
        });
        res.status(200).json({
            success: true,
            discount
        });
        }
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const updateDiscount = async(req, res) =>{
    try{
        const{
            discountPercentage,
            startDate,
            endDate,
            isActive
        } = req.body;

        const discount = await DiscountModel.findByIdAndUpdate(
            req.params.id,
            {
                discountPercentage: Number(discountPercentage),
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                isActive
            },
            {
                new: true
            }
        );

        if(!discount){
            return res.status(404).json({
                success: false,
                message: "Discount is not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Discount Update Successfully",
            discount
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const deleteDiscount = async(req, res) =>{
    try{
        const discount = await DiscountModel.findByIdAndDelete(req.params.id);

        if(!discount){
            return res.status(404).json({
                success: false,
                message: "Discount not found"
            });
        }
        res.status.json({
            success: true,
            message: "Discount Deleted successfully"
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    addDiscount,
    getAllDiscounts,
    getBookDiscount,
    updateDiscount,
    deleteDiscount
}