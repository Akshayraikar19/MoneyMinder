// const mongoose = require('mongoose')
// const {Schema, model} = mongoose

// const paymentSchema = new Schema({
//     applicationId: {
//         type: Schema.Types.ObjectId,
//         ref: 'Application'
//     },
//     customer: {
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     amount : Number,
//     paymentDate: Date,
//     mode: {
//             type: String,
//             enum: ['online', 'offline'],
//             default: 'online'
//       },
//     verifiedByAdmin: {
//             type: Boolean,
//            default: false
//         },
//     emiDueDate: Date 
// }, {timestamps: true})

// const Payment = model('Payment', paymentSchema)

// module.exports = Payment



const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const Application = require('../models/application-model')
const { addMonths } = require('date-fns');

const paymentSchema = new Schema({
    applicationId: {
        type: Schema.Types.ObjectId,
        ref: 'Application',
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    transactionId: String, //(sessionId)
    amount: Number,
    paymentDate: Date,
    mode: {
        type: String,
        enum: ['online', 'offline'],
        default: 'online'
    },
    verifiedByAdmin: {
        type: Boolean,
        default: false
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'successful', 'failed'],
        default: 'pending'
    },
    // nextEmiDueDate: {
    //     type: Date, // Assuming nextEmiDueDate is a Date type
    //     ref: 'Application.nextEmiDueDate' // Reference the correct field in Application model
    // }
    nextEmiDueDate: Date 
}, { timestamps: true });

const Payment = model('Payment', paymentSchema);

module.exports = Payment;