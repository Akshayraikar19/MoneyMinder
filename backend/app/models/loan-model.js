const mongoose = require('mongoose')
const {Schema, model} = mongoose

const loanSchema = new Schema({
    type: String,
    officer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    description: String,
    interestRate: String
}, {timestamps:true})

const Loan = model('Loan', loanSchema)

module.exports = Loan