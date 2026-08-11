const OrderModel = require("../Modules/Order");

const placeOrder = async(req, res) =>{
    try{
        const {
            userId,
            items,
            totalAmount,
            address,
            paymentMethod,
            orderStatus
        } = req.body;

        if(!userId){
            return res.status(400).json({
                success:false,
                message: "User Id Is required"
            });
        }

        if(!items || items.length === 0){
            return res.status(400).json({
                success: false,
                message: "Cart is Empty"
            });
        }
        if (!totalAmount) {
            return res.status(400).json({
                success: false,
                message: "Total amount is required"
            });
        }


        if (!address) {
            return res.status(400).json({
                success: false,
                message: "Address is required"
            });
        }


        if (!paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "Payment method is required"
            });
        }

        const order = new OrderModel({
            userId,
            items,
            totalAmount,
            address,
            paymentMethod
        });

        const savedOrder = await order.save();

        res.status(201).json({
            success:true,
            message:"Order Successfully Placed",
            order: savedOrder
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    placeOrder
}