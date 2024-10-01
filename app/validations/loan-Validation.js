
const loanValidationSchema = {
    type: {
        in: ['body'],
        exists:{
            errorMessage: 'loan type is required'
        },
        trim: true,
        notEmpty: {
            errorMessage: 'loan type cannot be empty'
        },
        isIn: {
            options: [['HomeLoan', 'CarLoan', 'PersonalLoan', 'GoldLoan']],
            errorMessage: 'Should be either of HomeLoan, CarLoan, PersonalLoan, GoldLoan'
        }
    },
    description: {
        in: ['body'],
        exists: {
            errorMessage: 'description is required'
        },
        trim: true,
        notEmpty: {
            errorMessage: 'description cannot be empty'
        }
    },
    interestRate: {
        exists: {
            errorMessage: 'interestRate is required'
        },
        trim: true,
        notEmpty: {
            errorMessage: 'interestRate cannot be empty'
        },
        // isNumeric: {
        //     errorMessage: 'interestRate should be a number'
        // }
    }
}

module.exports = loanValidationSchema