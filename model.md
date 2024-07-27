# Usermodel
username: String,
email: String,
password: String,
role: [admin, Officer, customer]
phone: String

# loanModel
type: [carloan, houseloan, gold, personalloan]
description: String,
interestRate: Number,
 maxDuration: {
        type: Number,
        required: true
    }

# customerAccount
user: {
    type: Schema.Types.ObjectID,
    ref: 'User'
},
firstName: String,
lastName: String,
dateOfBirth: Date,
address: {
    street: String,
    city: String,
    state: String,
    postalCode: String
},
aadhaarNumber: String,
panNumber: String,
aadhaarPhoto: String,
panPhoto: String
isVerified: {
    type: Boolean,
    default: false
}


# applicationModel
loan : {
    type: Schema.Types.ObjectId,
    ref: 'Loan'
},
customer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
},
amount: Number
processingFee: {
    type: Boolean,
    default: false
}
nextEmiDueDate: {
        type: Date
  },
status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
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
  }

 # paymentModel
application: {
    type: Schema.Types.ObjectId,
    ref: 'Application'
},
customer: {
    type: Schema.Types.Objectid,
    ref: 'User'
},
amount : Number,
paymentDate: Date,
mode: {
        type: String,
        enum: ['online', 'offline'],
        default: 'online'
  },
   verifiedByAdmin: {
        type: Boolean,
        default: false
    }