// const { validationResult } = require('express-validator');
// const CustomerProfile = require('../models/Customer-model')
// const customerCltr ={}

// //create patientProfile
// customerCltr.createProfile = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const body = req.body;

//     try {
//         // Create a new customer instance
//         const customer = new CustomerProfile(body);
//         customer.userId = req.user.id;

//         // Check if files are uploaded
//         if (req.files) {
//             if (req.files['aadhaarPhoto']) {
//                 customer.aadhaarPhoto = req.files['aadhaarPhoto'][0].path.replace(/\\/g, '/');
//             }
//             if (req.files['panPhoto']) {
//                 customer.panPhoto = req.files['panPhoto'][0].path.replace(/\\/g, '/');
//             }
//             if (req.files['profilePic']) {
//                 customer.profilePic = req.files['profilePic'][0].path.replace(/\\/g, '/');
//             }
//         }

//         // Save customer instance to the database
//         await customer.save();

//         // Return the saved customer object in the response
//         res.json(customer);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Something went wrong' });
//     }
// }
// //get patientProfile
// customerCltr.getProfile=async(req,res)=>{
//     try{
//         const customer=await CustomerProfile.findOne({userId:req.user.id})
//             return res.json(customer)
//     }catch(err){
//         console.log(err)
//         return res.status(500).json("Something went wrong")
//     }
// }

// //update patientProfile
// customerCltr.updateProfile = async (req, res) => {
//     console.log('Files:', req.files);
//     console.log('Body:', req.body);
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { firstName, lastName, dateOfBirth, address, pincode } = req.body;
//     const userId = req.user.id; // Assuming userId is extracted from JWT token or session

//     try {
//         // Find the customer by userId and update the fields
//         let customer = await CustomerProfile.findOne({ userId });

//         if (!customer) {
//             return res.status(400).json({ msg: 'No customer found' });
//         }

//         // Update the customer document with the new fields
//         customer.firstName = firstName;
//         customer.lastName = lastName;
//         customer.dateOfBirth = dateOfBirth;
//         customer.address = address;
//         customer.pincode = pincode;

//         // Handle aadhaarPhoto, panPhoto, and profilePic update or fallback to existing URLs
//         if (req.files) {
//             if (req.files.aadhaarPhoto) {
//                 customer.aadhaarPhoto = req.files.aadhaarPhoto[0].path.replace(/\\/g, '/');
//             }

//             if (req.files.panPhoto) {
//                 customer.panPhoto = req.files.panPhoto[0].path.replace(/\\/g, '/');
//             }

//             if (req.files.profilePic) {
//                 customer.profilePic = req.files.profilePic[0].path.replace(/\\/g, '/');
//             }
//         }

//         // Save the updated customer document
//         await customer.save();
//         res.json(customer); // Return the updated customer document
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ msg: 'Server error' });
//     }
// };
// module.exports = customerCltr

const { validationResult } = require('express-validator');
const CustomerProfile = require('../models/Customer-model')
const upload = require('../middlewares/multer')
const customerCltr ={}


customerCltr.createProfile = async (req, res) => {
    console.log('Request received at:', new Date());
    console.log('Request body:', JSON.stringify(req.body, null, 2)); // Log the body as a formatted JSON string

    if (req.files) {
        console.log('Uploaded files:', JSON.stringify(req.files, null, 2)); // Log the files as a formatted JSON string
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', JSON.stringify(errors.array(), null, 2));
        return res.status(400).json({ errors: errors.array() });
    }

    const body = req.body;

    try {
        const customer = new CustomerProfile(body);
        customer.userId = req.user.id;

        if (req.files) {
            if (req.files['aadhaarPhoto']) {
                customer.aadhaarPhoto = req.files['aadhaarPhoto'][0].path;
                console.log('Aadhaar Photo URL:', customer.aadhaarPhoto);
            }
            if (req.files['panPhoto']) {
                customer.panPhoto = req.files['panPhoto'][0].path;
                console.log('PAN Photo URL:', customer.panPhoto);
            }
            if (req.files['profilePic']) {
                customer.profilePic = req.files['profilePic'][0].path;
                console.log('Profile Pic URL:', customer.profilePic);
            }
        }

        console.log('Creating customer with:', JSON.stringify(customer, null, 2));

        await customer.save();
        res.json(customer);
    } catch (err) {
        console.error('Error saving customer:', err.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
};


// //get patientProfile
customerCltr.getProfile=async(req,res)=>{
    try{
        const customer=await CustomerProfile.findOne({userId:req.user.id})
            return res.json(customer)
    }catch(err){
        console.log(err)
        return res.status(500).json("Something went wrong")
    }
}

// Update customer profile
customerCltr.updateProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, dateOfBirth, address, pincode } = req.body;
    const userId = req.user.id;

    try {
        // Find the customer by userId
        let customer = await CustomerProfile.findOne({ userId });

        if (!customer) {
            return res.status(400).json({ msg: 'No customer found' });
        }

        // Update customer fields
        customer.firstName = firstName;
        customer.lastName = lastName;
        customer.dateOfBirth = dateOfBirth;
        customer.address = address;
        customer.pincode = pincode;

        // Handle file updates
        if (req.files) {
            if (req.files.aadhaarPhoto) {
                console.log('Updating Aadhaar Photo:', req.files.aadhaarPhoto[0].path);
                customer.aadhaarPhoto = req.files.aadhaarPhoto[0].path;
            }

            if (req.files.panPhoto) {
                console.log('Updating PAN Photo:', req.files.panPhoto[0].path);
                customer.panPhoto = req.files.panPhoto[0].path;
            }

            if (req.files.profilePic) {
                console.log('Updating Profile Pic:', req.files.profilePic[0].path);
                customer.profilePic = req.files.profilePic[0].path;
            }
        }

        // Save the updated customer document
        await customer.save();
        res.json(customer); // Return the updated customer document
    } catch (err) {
        console.error('Error updating customer:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = customerCltr;