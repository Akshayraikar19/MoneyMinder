const { validationResult } = require('express-validator');
const Officer = require('../models/Officer-model');
const upload = require('../middlewares/multer')
const officerCltr = {};

// Create Officer Profile
officerCltr.createProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const body = req.body;

    try {
        // Create a new officer instance
        const officer = new Officer(body);
        officer.userId = req.user.id;

        // Check if files are uploaded
        if (req.files) {
            if (req.files['aadhaarPhoto']) {
                officer.aadhaarPhoto = req.files['aadhaarPhoto'][0].path;
                console.log('Aadhaar Photo URL:', officer.aadhaarPhoto);
            }
            if (req.files['panPhoto']) {
                officer.panPhoto = req.files['panPhoto'][0].path;
                console.log('PAN Photo URL:', officer.panPhoto);
            }
            if (req.files['profilePic']) {
                officer.profilePic = req.files['profilePic'][0].path;
                console.log('Profile Pic URL:', officer.profilePic);
            }
        }

        console.log('Uploaded files:', JSON.stringify(officer, null, 2));
        // Save officer instance to the database
        await officer.save();

        // Return the saved officer object in the response
        res.json(officer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// Get Officer Profile
officerCltr.getProfile = async (req, res) => {
    try {
        const officer = await Officer.findOne({ userId: req.user.id });
        if (!officer) {
            return res.status(404).json({ error: 'Officer profile not found' });
        }
        res.json(officer); // Send officer profile as JSON response
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update Officer Profile
officerCltr.updateProfile = async (req, res) => {
    console.log('Files:', req.files);
    console.log('Body:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { firstName, lastName, department, branchLocation } = req.body;
    const userId = req.user.id; // Assuming userId is extracted from JWT token or session

    try {
        // Find the officer by userId and update the fields
        let officer = await Officer.findOne({ userId });

        if (!officer) {
            return res.status(400).json({ msg: 'No officer found' });
        }

        // Update the officer document with the new fields
        officer.firstName = firstName;
        officer.lastName = lastName;
        officer.department = department;
        officer.branchLocation = branchLocation;
        
        // Handle aadhaarPhoto, panPhoto, and profilePic update or fallback to existing URLs
        if (req.files) {
            if (req.files.aadhaarPhoto) {
                officer.aadhaarPhoto = req.files.aadhaarPhoto[0].path;
            }

            if (req.files.panPhoto) {
                officer.panPhoto = req.files.panPhoto[0].path;
            }

            if (req.files.profilePic) {
                officer.profilePic = req.files.profilePic[0].path;
            }
        }
        
        // Save the updated officer document
        await officer.save();
        res.json(officer); // Return the updated officer document
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = officerCltr;
