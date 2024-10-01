const customerProfileUpdateValidationSchema = {
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
        exists: { errorMessage: 'Date of birth is required' },
        notEmpty: { errorMessage: 'Date of birth should not be empty' },
        trim: true
    },
    address: {
        exists: { errorMessage: 'Address is required' },
        notEmpty: { errorMessage: 'Address should not be empty' },
        trim: true
    },
    aadhaarNumber: {
        exists: { errorMessage: 'Aadhaar number is required' },
        notEmpty: { errorMessage: 'Aadhaar number should not be empty' },
        trim: true
    },
    panNumber: {
        exists: { errorMessage: 'PAN number is required' },
        notEmpty: { errorMessage: 'PAN number should not be empty' },
        trim: true
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
    pincode: {
        exists: { errorMessage: 'Pincode is required' },
        notEmpty: { errorMessage: 'Pincode should not be empty' },
        trim: true,
        custom: {
            options: (value) => {
                const pincodeRegex = /^[1-9][0-9]{5}$/;
                if (!pincodeRegex.test(value)) {
                    throw new Error('Invalid pin code. Please enter a valid 6-digit pin code');
                }
                return true;
            }
        }
    }
};

module.exports = customerProfileUpdateValidationSchema