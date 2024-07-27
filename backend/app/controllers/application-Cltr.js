const { validationResult } = require('express-validator');
const _ = require('lodash');
const Loan = require('../models/loan-model')
const Application = require('../models/application-model')
const Payment = require('../models/payment-model')
const moment = require('moment')

const applicationsCltr = {}

// function calculateEMIValue(amount, interestRate, duration) {
//     const monthlyInterestRate = interestRate / 12 / 100;
//     return amount * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -duration));
// }

function calculateEMIValue(amount, interestRate, duration) {
    const monthlyInterestRate = interestRate / 12 / 100;
    const emi = amount * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -duration));
    return Math.round(emi);
}

applicationsCltr.calculateEMI = async (req, res) => {
    const { loan, amount, duration } = req.body;

    try {
        // Fetch the loan details to get the interest rate
        const loanDetails = await Loan.findById(loan);
        if (!loanDetails) {
            return res.status(404).json({ error: 'Loan not found' });
        }

        // Convert interestRate from String to Number
        const interestRate = parseFloat(loanDetails.interestRate);

        // Calculate EMI
        const emi = calculateEMIValue(amount, interestRate, duration);

        res.json({ emi });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

applicationsCltr.apply = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { loan, amount, duration, customerProfile } = req.body;

        // Fetch the loan details to get the interest rate
        const loanDetails = await Loan.findById(loan);
        if (!loanDetails) {
            console.log(`Loan with ID ${loan} not found`);
            return res.status(404).json({ error: 'Loan not found' });
        }

        // Convert interestRate from String to Number
        const interestRate = parseFloat(loanDetails.interestRate);

        // Calculate EMI
        const emi = calculateEMIValue(amount, interestRate, duration);

        // Set next EMI due date (assuming it's one month from the current date)
        // const nextEmiDueDate = new Date();
        // nextEmiDueDate.setMonth(nextEmiDueDate.getMonth() + 1);

        // Prepare the application body
        const application = new Application({
            loan: loan,
            amount: amount,
            duration: duration,
            emi: emi,
            customerProfile: customerProfile
            // nextEmiDueDate: nextEmiDueDate,
        });

        // Save the application to the database
        application.customer = req.user.id
        console.log(application)
        await application.save();

        // Log success message and send response
        console.log('Application saved successfully:', application);
        res.json(application);
    } catch (err) {
        console.error('Error applying for loan:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

applicationsCltr.check = async(req, res) => {
  const loanId = req.params.loanId;
  try {
      const application = await Application.findOne({ loan: loanId, customer: req.user.id });
      if (!application) {
          return res.json({ applied: false });
      }
      res.json({ applied: true, application }); // Return application details if found
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
}

applicationsCltr.loanSanctions = async (req, res) => {
    try {
        const startOfMonth = moment().startOf('month').toDate();
        const endOfMonth = moment().endOf('month').toDate();
        
        const sanctions = await Application.aggregate([
            {
                $match: {
                    adminApprovedDate: { $gte: startOfMonth, $lte: endOfMonth },
                    status: 'approvedByAdmin'
                }
            },
            {
                $group: {
                    _id: { month: { $month: "$adminApprovedDate" }, year: { $year: "$adminApprovedDate" } },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Send the sanctions data with a 200 status code
        res.status(200).json(sanctions);
    } catch (error) {
        // Log the error and send a 500 status code
        console.error('Error fetching loan sanctions:', error);
        res.status(500).json({ message: 'Error fetching loan sanctions', error });
    }
}


applicationsCltr.loanretentions = async (req, res) => {
    try {
        const startOfMonth = moment().startOf('month').toDate();
        const endOfMonth = moment().endOf('month').toDate();

        const totalSanctions = await Application.countDocuments({
            adminApprovedDate: { $gte: startOfMonth, $lte: endOfMonth },
            status: 'approvedByAdmin'
        });

        const totalPayments = await Payment.aggregate([
            {
                $lookup: {
                    from: 'applications',
                    localField: 'applicationId',
                    foreignField: '_id',
                    as: 'application'
                }
            },
            { $unwind: '$application' },
            {
                $match: {
                    'application.adminApprovedDate': { $gte: startOfMonth, $lte: endOfMonth },
                }
            },
            {
                $group: {
                    _id: { month: { $month: "$paymentDate" }, year: { $year: "$paymentDate" } },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Calculate retention rate (assuming retention rate is the percentage of payments compared to total sanctions)
        const retentionRate = totalSanctions ? (totalPayments[0]?.count || 0) / totalSanctions * 100 : 0;

        res.status(200).json({ retentionRate });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching loan retentions', error });
    }
}

module.exports = applicationsCltr