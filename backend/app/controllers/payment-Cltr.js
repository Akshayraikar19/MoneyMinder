const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/payment-model');
const Application = require('../models/application-model')
const { pick } = require('lodash');
const { addMonths } = require('date-fns')
const paymentCltr = {};


paymentCltr.payOnline= async (req, res) => {
    const body = pick(req.body, ['applicationId', 'amount']);
    const emiAmount = parseFloat(body.amount); // Convert amount to a number

    // Validate emiAmount
    if (isNaN(emiAmount) || emiAmount <= 0) {
        return res.status(400).json({ error: 'Invalid EMI amount' });
    }

    try {
        // Create a customer with Stripe
        const customer = await stripe.customers.create({
            name: "Testing",
            address: {
                line1: 'India',
                postal_code: '403507',
                city: 'Mapusa',
                state: 'Goa',
                country: 'IN', // Fixed country code
            },
        });

        // Create a checkout session with Stripe
        const session = await stripe.checkout.sessions.create({ //invoice creation with only name field
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: "EMI Payment"
                    },
                    unit_amount: Math.round(emiAmount* 100 ) // in my case i need emi Amount
                },
                quantity: 1
            }],
            mode: "payment",
            success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:3000/cancel?session_id={CHECKOUT_SESSION_ID}', 
            customer: customer.id
        });

        // Create and save payment details to database
        const payment = new Payment({
            applicationId: body.applicationId,    // application in my case is invoiceId
            transactionId: session.id, // Stripe session ID
            amount: emiAmount, // Ensure amount is a number
            paymentType: 'card', // Payment method
            customer: req.user.id, // Customer ID from the request
            paymentDate: new Date(), // Date of payment
            paymentStatus: 'pending' // Initial status
        });

        await payment.save();

        // Respond with session details and payment information
        res.json({
            id: session.id,
            url: session.url,
            payment // Return the payment object
        });
    } catch (err) {
        console.error('Error processing payment:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

paymentCltr.successUpdate = async (req, res) => {
    const { id } = req.params;

    console.log(`Received transactionId: ${id}`); // Log received transactionId

    try {
        // Find the payment by transactionId
        const payment = await Payment.findOne({ transactionId: id });
        if (!payment) {
            console.error(`Payment not found for transactionId: ${id}`);
            return res.status(404).json({ error: 'Payment not found' });
        }

        console.log(`Found payment: ${JSON.stringify(payment)}`); // Log found payment

        // Only update the status to successful if it's not already marked
        if (payment.paymentStatus !== 'successful') {
            // Find the application by the applicationId stored in the payment
            const application = await Application.findById(payment.applicationId);
            if (!application) {
                console.error(`Application not found for applicationId: ${payment.applicationId}`);
                return res.status(404).json({ error: `Application not found for applicationId: ${payment.applicationId}` });
            }

            console.log(`Found application: ${JSON.stringify(application)}`); // Log found application

            const newNextEmiDueDate = addMonths(application.nextEmiDueDate || new Date(), 1);

            application.nextEmiDueDate = newNextEmiDueDate;
            await application.save();

            payment.verifiedByAdmin = true;
            payment.paymentStatus = 'successful';
            payment.nextEmiDueDate = newNextEmiDueDate;
            await payment.save();
        }

        res.status(200).json(payment);
    } catch (err) {
        console.error('Error updating payment:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

paymentCltr.failureUpdate = async (req, res) => {
    const { id } = req.params;

    console.log(`Received transactionId for failure: ${id}`); // Log received transactionId

    try {
        // Find the payment by transactionId
        const payment = await Payment.findOne({ transactionId: id });
        if (!payment) {
            console.error(`Payment not found for transactionId: ${id}`);
            return res.status(404).json({ error: 'Payment not found' });
        }

        console.log(`Found payment: ${JSON.stringify(payment)}`); // Log found payment

        // Only update the status to failed if it's not already marked
        if (payment.paymentStatus !== 'failed') {
            payment.paymentStatus = 'failed';
            await payment.save();
        }

        res.status(200).json(payment);
    } catch (err) {
        console.error('Error updating payment status:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

paymentCltr.payOffline = async (req, res) => {
    const { applicationId, amount } = req.body;
    try {
        const payment = new Payment({
            applicationId,
            customer: req.user.id,
            amount,
            paymentDate: new Date(),
            mode: 'offline',
            paymentStatus: 'pending',
            // transactionId: `OFFLINE-${new Date().getTime()}` // Generate or use a placeholder transaction 
            transactionId: 'Offline Payment'
        
        });

        await payment.save();
        res.json(payment);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

paymentCltr.OfflinePayments = async (req, res) => {
    try {
        const payment = await Payment.findOne({ applicationId: req.params.applicationId, mode: "offline" }).sort({ paymentDate: -1 });
        
        console.log(payment); // Add this line to debug

        if (!payment) {
            return res.status(404).json({ error: "Offline payment not found for this application" });
        }
        res.json(payment);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

 

// paymentCltr.verifyOfflinePayment = async (req, res) => {
//     // const id = req.params.id;
//     // try {
//     //     // Find the payment by ID and mode='offline'
//     //     const payment = await Payment.findOneAndUpdate(
//     //         { _id: id, mode: 'offline' },
//     //         {
//     //             $set: {
//     //                 verifiedByAdmin: true,
//     //                 paymentStatus: 'successful',
//     //                 // Calculate nextEmiDueDate based on current value in application model
//     //                 nextEmiDueDate: addMonths(new Date(), 1) // Default to current date + 1 month
//     //             }
//     //         },
//     //         { new: true }
//     //     );

//     //     if (!payment) {
//     //         return res.status(404).json({ error: 'Payment not found or not in offline mode' });
//     //     }

//     //     // Find the related application
//     //     const application = await Application.findById(payment.applicationId);

//     //     if (!application) {
//     //         return res.status(404).json({ error: 'Application not found' });
//     //     }

//     //     // Calculate the new nextEmiDueDate based on the current value in the application
//     //     const currentNextEmiDueDate = application.nextEmiDueDate || new Date();
//     //     const newNextEmiDueDate = addMonths(currentNextEmiDueDate, 1);

//     //     // Update both the application and payment documents with the new nextEmiDueDate
//     //     application.nextEmiDueDate = newNextEmiDueDate;
//     //     await application.save();

//     //     payment.nextEmiDueDate = newNextEmiDueDate;
//     //     await payment.save();

//     //     res.json(payment);
//     // } catch (err) {
//     //     console.log(err);
//     //     res.status(500).json({ error: 'Internal Server Error' });
//     // }

//     const { applicationId } = req.params;
//     try {
//         // Find the payment by ID and mode='offline'
//         const payment = await Payment.findOneAndUpdate(
//             { _id: applicationId, mode: 'offline' },
//             {
//                 $set: {
//                     verifiedByAdmin: true,
//                     paymentStatus: 'successful',
//                     // Calculate nextEmiDueDate based on current value in application model
//                 }
//             },
//             { new: true }
//         );

//         if (!payment) {
//             return res.status(404).json({ error: 'Payment not found or not in offline mode' });
//         }

//         // Find the related application
//         const application = await Application.findById(payment.applicationId);

//         if (!application) {
//             return res.status(404).json({ error: 'Application not found' });
//         }

//         // Calculate the new nextEmiDueDate based on the current value in the application
//         const currentNextEmiDueDate = application.nextEmiDueDate || new Date();
//         const newNextEmiDueDate = addMonths(currentNextEmiDueDate, 1);

//         // Update both the application and payment documents with the new nextEmiDueDate
//         application.nextEmiDueDate = newNextEmiDueDate;
//         await application.save();

//         payment.nextEmiDueDate = newNextEmiDueDate;
//         await payment.save();

//         res.json(payment);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };


paymentCltr.verifyOfflinePayment = async (req, res) => {
    const id = req.params.applicationId; // This line is causing the issue

    try {
        console.log('Processing payment with ID:', id);

        // Find the payment in offline mode
        const payment = await Payment.findOne({ applicationId: id, mode: 'offline' }).sort({ paymentDate: -1 });
        if (!payment) {
            return res.status(404).json({ error: 'No offline payment record found for this application' });
        }

        // Check if the payment is already verified
        if (payment.verifiedByAdmin) {
            return res.status(400).json({ error: 'Payment already verified' });
        }

        // Find the related application
        const application = await Application.findById(payment.applicationId);
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        // Ensure application has a nextEmiDueDate
        if (!application.nextEmiDueDate) {
            console.error('No nextEmiDueDate set in the application.');
            return res.status(400).json({ error: 'Next EMI due date not set in the application' });
        }

        // Calculate the new next EMI due date
        const newNextEmiDueDate = addMonths(application.nextEmiDueDate, 1);
        console.log('Calculated new next EMI due date:', newNextEmiDueDate);

        // Update the payment
        payment.verifiedByAdmin = true;
        payment.paymentStatus = 'successful';
        payment.nextEmiDueDate = newNextEmiDueDate; // Update payment's due date
        await payment.save();

        // Update the application with the new next due date
        application.nextEmiDueDate = newNextEmiDueDate;
        await application.save();

        // Send response
        res.json(payment);
    } catch (err) {
        console.error('Error verifying offline payment:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



// paymentCltr.list = async(req,res) => {
//     try{
//         const response = await Payment.find({customer: req.user.id}).sort({createdAt: -1})
//         res.json(response)
//     }catch(err) {
//         console.log(err)
//         res.status(500).json({error: "Internal server error"})
//     }
// }


// paymentCltr.list = async (req, res) => {
//     try {
//         let response;

//         if (req.user.role === 'admin') {
//             const customerId = req.query.customerId; // Expect customerId to be passed as a query parameter for admin requests
//             if (customerId) {
//                 response = await Payment.find({ customer: customerId }).sort({ createdAt: -1 });
//             } else {
//                 return res.status(400).json({ error: "customerId query parameter is required for admin" });
//             }
//         } else if (req.user.role === 'customer') {
//             response = await Payment.find({ customer: req.user.id }).sort({ createdAt: -1 });
//         } else {
//             return res.status(403).json({ error: "Unauthorized access" });
//         }

//         res.json(response);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

paymentCltr.list = async (req, res) => {
    try {
        // Extract query parameters
        const { sortBy = 'createdAt', order = 'desc', page = 1, limit = 10, customerId, search } = req.query;

        // Ensure page and limit are integers
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        // Validate page and limit
        if (isNaN(pageNumber) || pageNumber < 1) {
            return res.status(400).json({ error: "Invalid page number" });
        }
        if (isNaN(limitNumber) || limitNumber < 1) {
            return res.status(400).json({ error: "Invalid limit number" });
        }

        // Determine sorting options
        const sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = order === 'desc' ? -1 : 1;
        } else {
            sortOptions.createdAt = -1; // Default sort by date descending
        }

        // Pagination setup
        const skip = (pageNumber - 1) * limitNumber;

        // Initialize filter
        let filter = {};

        // Add search filter if provided
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            filter.paymentStatus = { $regex: searchRegex };
        }

        // Authorization and additional filtering
        if (req.user.role === 'admin') {
            if (customerId) {
                filter.customer = customerId;
            } else {
                return res.status(400).json({ error: "customerId query parameter is required for admin" });
            }
        } else if (req.user.role === 'customer') {
            filter.customer = req.user.id;
        } else {
            return res.status(403).json({ error: "Unauthorized access" });
        }

        // Fetch data with filter, sort, and pagination
        const payments = await Payment.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNumber);

        // Count total payments for pagination
        const totalPayments = await Payment.countDocuments(filter);

        // Respond with sorted and paginated data
        res.json({
            total: totalPayments,
            page: pageNumber,
            limit: limitNumber,
            payments
        });
    } catch (err) {
        console.error("Error in fetching payments:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
}



paymentCltr.checkStatus = async(req, res) => {
    const { customerId } = req.params;
    try {
      const application = await Application.findOne({ customer: customerId });
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
      res.json({
        status: application.status,
        nextEmiDueDate: application.nextEmiDueDate,
        emi: application.emi,
        applicationId: application._id // Return the _id as applicationId(invoiceId)
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

//   paymentCltr.listByApplicationId = async (req, res) => {
//     try {
//         const { applicationId } = req.params;
//         const payments = await Payment.find({ applicationId }).sort({ createdAt: -1 });
//         if(!payments) {
//             return res.status(400).json({ error: 'record not found'})
//         }
//         const application = await Application.findById(applicationId).populate('customerProfile').populate('loan')
//         res.json(application)
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };
  

paymentCltr.listByApplicationId = async (req, res) => {
    try {
        const { applicationId } = req.params;
        
        const payments = await Payment.find({ applicationId }).sort({ createdAt: -1 });
        if (!payments || payments.length === 0) {
            return res.status(400).json({ error: 'No payments found for this application' });
        }
        
        const application = await Application.findById(applicationId).populate('customerProfile').populate('loan');
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }
        
        const response = {
            payments,
            applicationDetails: {
                customerProfile: application.customerProfile,
                loan: application.loan,
                loanStatus: application.status, // Assuming status is part of application
            },
        };

        res.json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
};
  
  

module.exports = paymentCltr;
