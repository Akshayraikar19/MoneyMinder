// const mongoose = require('mongoose')
// const {Schema, model} = mongoose

// const applicationSchema = new Schema({
//     customer: {
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     customerProfile: {
//         type: Schema.Types.ObjectId,
//         ref: 'CustomerProfile'
//     },
//     loan : {
//         type: Schema.Types.ObjectId,
//         ref: 'Loan'
//     },
//     officer: {
//         type: Schema.Types.ObjectId,
//         ref: 'Officer'
//     },
//     amount: String,
//     duration: String,
//     emi: String,
//     status: {
//             type: String,
//             enum: ['pending', 'approvedByAdmin','approvedByOfficer', 'rejected', 'rejectedByAdmin'],
//             default: 'pending'
//         },
//     rejectedReason: String,
//     approvedByOfficer: {
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     officerApprovedDate: {
//         type: Date
//     },    
//     approvedByAdmin: {
//         type: Schema.Types.ObjectId, 
//         ref: 'User'
//      },
//     adminApprovedDate: { 
//         type: Date
//       },
//     nextEmiDueDate: {
//             type: Date
//   },
// }, {timestamps: true})


// const Application = model('Application', applicationSchema)

// module.exports = Application


const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const applicationSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    customerProfile: {
        type: Schema.Types.ObjectId,
        ref: 'CustomerProfile'
    },
    loan: {
        type: Schema.Types.ObjectId,
        ref: 'Loan'
    },
    officer: {
        type: Schema.Types.ObjectId,
        ref: 'Officer'
    },
    amount: String,
    duration: String,
    emi: String,
    status: {
        type: String,
        enum: ['pending', 'approvedByAdmin', 'approvedByOfficer', 'rejected', 'rejectedByAdmin'],
        default: 'pending'
    },
    rejectedReason: String,
    approvedByOfficer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    officerApprovedDate: {
        type: Date
    },
    approvedByAdmin: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    adminApprovedDate: {
        type: Date
    },
    nextEmiDueDate: {
        type: Date
    }
}, { timestamps: true });

const Application = model('Application', applicationSchema);

module.exports = Application;
