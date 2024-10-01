// // const Officer = require('../models/Officer-model')

// const officerValidationSchema = {
//     userId: {
//         custom: {
//             options: async function(value, { req }) {
//                 const officer = await Officer.findOne({ userId: req.user.id });
//                 if (officer) {
//                     throw new Error("Profile already created");
//                 }
//                 return true;
//             }
//         }
//     },
// //     firstName: {
// //         exists: { errorMessage: 'First name is required' },
// //         notEmpty: { errorMessage: 'First name should not be empty' },
// //         trim: true
// //     },
// //     lastName: {
// //         exists: { errorMessage: 'Last name is required' },
// //         notEmpty: { errorMessage: 'Last name should not be empty' },
// //         trim: true
// //     },
// //     department: {
// //         exists: {errorMessage: 'department is required'},
// //         notEmpty: { errorMessage: 'department should not be empty'},
// //         trim: true
// //     },
// //     branchLocation: {
// //         exists: {errorMessage: 'branchLocation  is required'},
// //         notEmpty: { errorMessage: 'branchLocation should not be empty'},
// //         trim: true
// //     },
// //     profilePic: {
// //         custom: {
// //             options: (value, { req }) => {
// //                 if (!req.files || !req.files.profilePic) {
// //                     throw new Error('profilePic is required');
// //                 }
// //                 const file = req.files.ProfilePic[0];
// //                 const allowedTypes = ['image/jpeg', 'image/png'];
// //                 if (!allowedTypes.includes(file.mimetype)) {
// //                     throw new Error('Invalid file type');
// //                 }
// //                 if (file.size > 5 * 1024 * 1024) {
// //                     throw new Error('File size should not exceed 5MB');
// //                 }
// //                 return true;
// //             }
// //         }
// //     },
// // }



// // module.exports = {
// //     officerValidationSchema}
    

const Officer = require('../models/Officer-model')
const officerProfileValidationSchema = {
    userId: {
        custom: {
            options: async function(value, { req }) {
                const officer = await Officer.findOne({ userId: req.user.id });
                if (officer) {
                    throw new Error("Profile already created");
                }
                return true;
            }
        }
    },
//     firstName: {
//         exists: { errorMessage: 'First name is required' },
//         notEmpty: { errorMessage: 'First name should not be empty' },
//         trim: true
//     },
//     lastName: {
//         exists: { errorMessage: 'Last name is required' },
//         notEmpty: { errorMessage: 'Last name should not be empty' },
//         trim: true
//     },
//     department: {
//                 exists: {errorMessage: 'department is required'},
//                 notEmpty: { errorMessage: 'department should not be empty'},
//                 trim: true
//             },
//     branchLocation: {
//                 exists: {errorMessage: 'branchLocation  is required'},
//                 notEmpty: { errorMessage: 'branchLocation should not be empty'},
//                 trim: true
//             },
//             profilePic: {
//                 custom: {
//                     options: (value, { req }) => {
//                         if (!req.files || !req.files.profilePic) {
//                             throw new Error('profile photo is required');
//                         }
//                         const file = req.files.profilePic[0];
//                         const allowedTypes = ['image/jpeg', 'image/png'];
//                         if (!allowedTypes.includes(file.mimetype)) {
//                             throw new Error('Invalid file type');
//                         }
//                         if (file.size > 5 * 1024 * 1024) {
//                             throw new Error('File size should not exceed 5MB');
//                         }
//                         return true;
//                     }
//                 }
//             },
//             aadhaarPhoto: {
//                 custom: {
//                     options: (value, { req }) => {
//                         if (!req.files || !req.files.aadhaarPhoto) {
//                             throw new Error('Aadhaar photo is required');
//                         }
//                         const file = req.files.aadhaarPhoto[0];
//                         const allowedTypes = ['image/jpeg', 'image/png'];
//                         if (!allowedTypes.includes(file.mimetype)) {
//                             throw new Error('Invalid file type');
//                         }
//                         if (file.size > 5 * 1024 * 1024) {
//                             throw new Error('File size should not exceed 5MB');
//                         }
//                         return true;
//                     }
//                 }
//             },
//             panPhoto: {
//                 custom: {
//                     options: (value, { req }) => {
//                         if (!req.files || !req.files.panPhoto) {
//                             throw new Error('PAN photo is required');
//                         }
//                         const file = req.files.panPhoto[0];
//                         const allowedTypes = ['image/jpeg', 'image/png'];
//                         if (!allowedTypes.includes(file.mimetype)) {
//                             throw new Error('Invalid file type');
//                         }
//                         if (file.size > 5 * 1024 * 1024) {
//                             throw new Error('File size should not exceed 5MB');
//                         }
//                         return true;
//                     }
//                 }
//             },
    };
module.exports = officerProfileValidationSchema;