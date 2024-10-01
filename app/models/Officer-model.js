const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const OfficerSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    firstName: String,
    lastName: String,
    department: String,
    branchLocation: String,
    profilePic: String,
    aadhaarPhoto: String,
    panPhoto: String
}, { timestamps: true });

const Officer = model('Officer', OfficerSchema);

module.exports = Officer;
