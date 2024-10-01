const User = require('../models/user-model')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const {validationResult} = require('express-validator')
const usersCltr = {}
const {sendOTPEmail} = require('.././utils/otpMail')

usersCltr.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const body = req.body;
    try {
        const existingUsers = await User.find();
        let role = 'customer';
        let isVerified = false;

        if (existingUsers.length === 0) {
            role = 'admin';
            isVerified = true;
        } else if (body.role === 'officer') {
            role = 'officer';
        } else if (role === 'customer') {
            isVerified = true;
        }

        const salt = await bcryptjs.genSalt();
        const hashPassword = await bcryptjs.hash(body.password, salt);

        const user = new User({
            username: body.username,
            email: body.email,
            password: hashPassword,
            role: role,
            phone: body.phone,
            isVerified: isVerified
        });
  
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

usersCltr.checkAdmin = async (req, res) => {
    try {
        const adminExists = await User.exists({ role: 'admin' });
        res.json({ adminExists });
    } catch (err) {
        console.error('Error checking admin existence:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
    // User.create(body)
    //     .then((user) => {
    //         res.status(201).json(user)
    //     })
    //     .catch((err) => {
    //         res.status(500).json({ error: 'something went wrong'})
    //     })

    usersCltr.login = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { username, email, phone, password } = req.body;
    
        try {
            // Find the user by email, username, or phone
            const user = await User.findOne({
                $or: [
                    { email: email },
                    { username: username },
                    { phone: phone }
                ]
            });
    
            if (user) {
                const isAuth = await bcryptjs.compare(password, user.password);
                if (isAuth) {
                    if (user.role === 'officer' && !user.isVerified) {
                        return res.status(403).json({ errors: [{ msg: 'Officer not verified by admin' }] });
                    }
    
                    const tokenData = {
                        id: user._id,
                        role: user.role
                    };
                    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '7d' });
                    return res.json({ token: token });
                }
                return res.status(400).json({ errors: [{ msg: 'Invalid email, username, phone number, or password' }] });
            }
    
            res.status(400).json({ errors: [{ msg: 'Invalid email, username, phone number, or password' }] });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ errors: [{ msg: 'Something went wrong' }] });
        }
    };

    usersCltr.account = async (req, res) => {  // finding the user through token+
        try{
            const user =  await User.findById(req.user.id)
            res.json(user)
        } catch(err) {
            res.status(500).json({ error: 'something went wrong'})
        }
    }

    usersCltr.checkEmail = async (req, res) => {
    const { email } = req.query;
    //const email=req.query.email
    try{
        const user=await User.findOne({email})
        if(user){
            res.json({exists:true})
        }else{
            res.json({exists:false})
        }
    }catch(err){
        res.status(500).json('something went wrong')
    }
}

    usersCltr.checkUsername = async (req, res) => {
        const {username} = req.query
        try{
            const user = await User.findOne({username})
            if(user) {
                res.json({ exists: true})
            } else {
                res.json({ exists: false})
            }
        } catch(err) {
            res.status(500).json('something went wrong')
        }
    }

    usersCltr.checkPhone = async(req, res) => {
        const {phone} = req.query
        try{
            const user = await User.findOne({phone})
            if(user) {
                res.json({ exists: true})
            } else {
                res.json({ exists: false})
            }
        } catch(err) {
            res.status(500).json('something went w')
        }
    }
    

    usersCltr.unverified = async (req, res) => {
        try {
            const unverifiedOfficers = await User.find({ role: 'officer', isVerified: false, isRejected: false });
            res.json(unverifiedOfficers);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch unverified officers' });
        }
    }

    usersCltr.verified = async(req, res) => {
        try {
            const { userId } = req.body;
            await User.findByIdAndUpdate(userId, { isVerified: true });
            res.json({ message: 'Officer verified successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to verify officer' });
        }
    }

    usersCltr.reject = async(req, res) => {
        try {
            const { userId } = req.body;
            await User.findByIdAndUpdate(userId, { isRejected: true });
            res.json({ message: 'Officer rejected successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to reject officer' });
        }
    }
    
    usersCltr.verifiedOfficers = async(req, res) => {
        try{
            const verifiedOfficers = await User.find({ role: 'officer', isVerified: true })
            res.json(verifiedOfficers)
        } catch(error) {
            res.status(500).json({error: 'Failed to fetch verified officers'})
        }
    }



    usersCltr.forgotPassword = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email } = req.body; // Only email is needed
    
        try {
            const user = await User.findOne({ email });
            if (!user) {
                console.error(`No user found with email: ${email}`);
                return res.status(404).json({ message: 'No user found for this registered email' });
            }
    
            // Send OTP email and get the OTP
            const otp = await sendOTPEmail(email, user.username);
            if (!otp) {
                console.error('Failed to send OTP email');
                return res.status(500).json({ message: 'Failed to send OTP email' });
            }
    
            // Store the OTP in the user's record with an expiration time (e.g., 10 minutes)
            user.resetPasswordToken = otp;
            user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
            await user.save();
    
            res.status(200).json({ message: 'OTP sent to email' });
        } catch (error) {
            console.error('Server error', error);
            res.status(500).json({ message: 'Server error' });
        }
    };
    
      

  //reset password
  usersCltr.resetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if OTP is valid and not expired
        if (user.resetPasswordToken !== otp) {
            console.log('Invalid OTP');
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.resetPasswordExpires < Date.now()) {
            console.log('Expired OTP');
            return res.status(400).json({ message: 'Expired OTP' });
        }

        // Hash the new password and save it
        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined; // Clear the OTP fields
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};



    // usersCltr.login = async (req, res) => {
    //     const errors = validationResult(req) 
    //     if(!errors.isEmpty()) {
    //         return res.status(400).json({ errors: errors.array()})
    //     }
    //     const body = req.body 
    //     try { 
    //         const user = await User.findOne({email: body.email }) // in user model find email.
    //         if(user) { //checking if the user is present or no in db
    //             const isAuth = await bcryptjs.compare(body.password, user.password) //comparing password with db password, plain password with hashed password.
    //             if(isAuth) {
    //                 const tokenData = {
    //                     id: user._id, // generate a token with the values
    //                     role: user.role 
    //                 }
    //                 const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '7d'})
    //                 return res.json({ token: token })
    //             }
    //             return res.status(404).json({ errors: 'invalid email / password '}) // send it to frontend.
    //         }
    //         res.status(404).json({ errors: 'invalid email/password'})
    //     } catch(err) {
    //         res.status(500).json({ errors: 'something went wrong'})
    //     }
    // }

    module.exports = usersCltr