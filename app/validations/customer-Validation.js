const CustomerProfile = require('../models/Customer-model');

const customerProfileValidationSchema = {
    userId: {
        custom: {
            options: async function(value, { req }) {
                const customer = await CustomerProfile.findOne({ userId: req.user.id });
                if (customer) {
                    throw new Error("Profile already created");
                }
                return true;
            }
        }
    },
    firstName: {
        exists: { errorMessage: 'First name is required' },
        notEmpty: { errorMessage: 'First name should not be empty' },
        trim: true
    },
    lastName: {
        exists: { errorMessage: 'Last name is required' },
        notEmpty: { errorMessage: 'Last name should not be empty' },
        trim: true
    },
    dateOfBirth: {
        exists: { errorMessage: 'dateOfBirth number is required' },
        notEmpty: { errorMessage: 'dateOfBirth number should not be empty' },
        trim: true
    },
    address:{
        exists: { errorMessage: 'address is required' },
        notEmpty: { errorMessage: 'address should not be empty' },
        trim:true
    },
    aadhaarNumber:{
        exists: { errorMessage: 'aadhaarNumber is required' },
        notEmpty: { errorMessage: 'aadhaarNumber should not be empty' },
        trim:true
    },
    panNumber:{
        exists: { errorMessage: 'panNumberis required' },
        notEmpty: { errorMessage: 'panNumber should not be empty' },
        trim:true
    },
    // profilePic: {
    //     custom: {
    //         options: (value, { req }) => {
    //             if (!req.files || !req.files.profilePic) {
    //                 throw new Error('profile photo is required');
    //             }
    //             const file = req.files.profilePic[0];
    //             const allowedTypes = ['image/jpeg', 'image/png'];
    //             if (!allowedTypes.includes(file.mimetype)) {
    //                 throw new Error('Invalid file type');
    //             }
    //             if (file.size > 5 * 1024 * 1024) {
    //                 throw new Error('File size should not exceed 5MB');
    //             }
    //             return true;
    //         }
    //     }
    // },
    // aadhaarPhoto: {
    //     custom: {
    //         options: (value, { req }) => {
    //             if (!req.files || !req.files.aadhaarPhoto) {
    //                 throw new Error('Aadhaar photo is required');
    //             }
    //             const file = req.files.aadhaarPhoto[0];
    //             const allowedTypes = ['image/jpeg', 'image/png'];
    //             if (!allowedTypes.includes(file.mimetype)) {
    //                 throw new Error('Invalid file type');
    //             }
    //             if (file.size > 5 * 1024 * 1024) {
    //                 throw new Error('File size should not exceed 5MB');
    //             }
    //             return true;
    //         }
    //     }
    // },
    // panPhoto: {
    //     custom: {
    //         options: (value, { req }) => {
    //             if (!req.files || !req.files.panPhoto) {
    //                 throw new Error('PAN photo is required');
    //             }
    //             const file = req.files.panPhoto[0];
    //             const allowedTypes = ['image/jpeg', 'image/png'];
    //             if (!allowedTypes.includes(file.mimetype)) {
    //                 throw new Error('Invalid file type');
    //             }
    //             if (file.size > 5 * 1024 * 1024) {
    //                 throw new Error('File size should not exceed 5MB');
    //             }
    //             return true;
    //         }
    //     }
    // },
    pincode:{
        exists: { errorMessage: 'pincode is required' },
        notEmpty: { errorMessage: 'pincode should not be empty' },
        trim:true,
        custom:{
                options: (value) => {
                    // Validate pin code format (6 digits)
                    const pincodeRegex = /^[1-9][0-9]{5}$/;
                    if (!pincodeRegex.test(value)) {
                        throw new Error('Invalid pin code. Please enter a valid 6-digit pin code');
                    }
                    return true;
                }
            }
        }
    };



module.exports = customerProfileValidationSchema