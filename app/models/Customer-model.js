// const mongoose = require('mongoose')
// const {Schema, model} = mongoose

// const customerProfileSchema = new Schema({
//     userId: {
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     firstName: String,
//     lastName: String,
//     dateOfBirth: Date,
//     address: String,
//     pincode: String,
//     profilePic: String,
//     aadhaarNumber: String,
//     panNumber: String,
//     aadhaarPhoto: String,
//     panPhoto: String,
//     isVerified: {
//         type: Boolean,
//         default: false
//     }  
// }, {timestamps: true})



// // // Middleware to replace backslashes with forward slashes
// // customerProfileSchema.pre('save', function(next) {
// //     if (this.aadhaarPhotoUrl) {
// //       this.aadhaarPhotoUrl = this.aadhaarPhotoUrl.replace(/\\/g, '/');
// //     }
// //     if (this.panPhotoUrl) {
// //       this.panPhotoUrl = this.panPhotoUrl.replace(/\\/g, '/');
// //     }
// //     next();
// //   });
// const CustomerProfile = model('CustomerProfile', customerProfileSchema)

// module.exports = CustomerProfile



const mongoose = require('mongoose');

const customerProfileSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    aadhaarNumber: { type: String, required: true },
    panNumber: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    aadhaarPhoto: { type: String, required: true },
    panPhoto: { type: String, required: true },
    profilePic: { type: String, required: true },
}, { timestamps: true });

const CustomerProfile = mongoose.model('CustomerProfile', customerProfileSchema);

module.exports = CustomerProfile;
