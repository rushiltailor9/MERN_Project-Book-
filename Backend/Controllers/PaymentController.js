const Payment =
    require("../Modules/Payment");


// =======================================
// CREATE DUMMY PAYMENT
// =======================================

const createDummyPayment = async (req, res) => {

    try {

        const userId = req.user._id;

        const {
            amount,
            paymentMethod,
            paymentResult
        } = req.body;


        // ==============================
        // VALIDATION
        // ==============================

        if (!amount || amount <= 0) {

            return res.status(400).json({

                success: false,

                message: "Invalid payment amount"

            });

        }


        if (
            !["dummy_card", "dummy_upi"]
                .includes(paymentMethod)
        ) {

            return res.status(400).json({

                success: false,

                message: "Invalid payment method"

            });

        }


        // ==============================
        // DEMO PAYMENT FAILURE
        // ==============================

        if (paymentResult === "failed") {

            return res.status(400).json({

                success: false,

                message: "Dummy payment failed",

                paymentStatus: "failed"

            });

        }


        // ==============================
        // CREATE FAKE TRANSACTION ID
        // ==============================

        const transactionId =
            "DUMMY_TXN_" +
            Date.now();


        // ==============================
        // SAVE PAYMENT
        // ==============================

        const payment =
            await Payment.create({

                userId,

                amount,

                paymentMethod,

                paymentStatus: "success",

                transactionId

            });


        // ==============================
        // RESPONSE
        // ==============================

        return res.status(201).json({

            success: true,

            message:
                "Dummy payment successful",

            payment: {

                paymentId:
                    payment._id,

                amount:
                    payment.amount,

                paymentMethod:
                    payment.paymentMethod,

                paymentStatus:
                    payment.paymentStatus,

                transactionId:
                    payment.transactionId

            }

        });


    } catch (error) {

        console.error(
            "Dummy payment error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Payment failed",

            error: error.message

        });

    }

};


module.exports = {
    createDummyPayment
};