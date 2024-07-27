const Application = require('../models/application-model')


const applicationValidationSchema = {
    loan: {
        in: ['body'],
        exists: {
           errorMessage: 'loan is required'
        },
        notEmpty: {
            errorMessage: 'loan cannot be empty'
        },
        isMongoId: {
            errorMessage: 'loan should be a valid id'
        },
        custom: {
            options: async function(value, {req}) {
              const application = await Application.findOne({ loan: value, customer: req.user.id })
              if(application) {
                throw new Error('You have already applied for this loan')
              }
              return true
            }
        }
    },
    amount: {
        in: ['body'],
        exists: {
            errorMessage: 'amount is required'
        },
        notEmpty: {
            errorMessage: 'amount cannot be empty'
        },
        trim: true
    },
    duration: {
        in: ['body'],
        exists: {
            errorMessage: 'duration is required'
        },
        notEmpty: {
            errorMessage: 'duration cannot be empty'
        },
        trim: true
    }
}

const applicationEditValidation = {
    status: {
        in: ['body'],
        exists: {
            errorMessage: 'status is required'
        },
        notEmpty: {
            errorMessage: 'status cannot be empty'
        },
        isIn: {
            options: [['approvedByOfficer', 'rejected']],
            errorMessage: 'status should be either approvedByOfficer or pending'
        }
    }
}

module.exports = {applicationValidationSchema, applicationEditValidation}