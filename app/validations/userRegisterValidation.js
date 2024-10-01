
const User = require('../models/user-model')
const userRegisterValidationSchema = {
    username: {
        exists: { errorMessage: 'Username is required' },
        notEmpty: { errorMessage: 'Username should not be empty' },
        trim: true,
        custom:{
            options: async(value) => {
                const user = await User.findOne({ username: value});
                if(user) {
                    throw new Error('Username already exists')
                }
                return true;
            }
        }
    },
    email: {
        exists: { errorMessage: 'Email is required' },
        notEmpty: { errorMessage: 'Email should not be empty' },
        isEmail: { errorMessage: 'Email should be in correct format' },
        trim: true,
        normalizeEmail: true,
        custom: {
            options: async (value) => {
                const user = await User.findOne({ email: value });
                if (user) {
                    throw new Error('Email already exists');
                }
                return true;
            }
        }
    },
    password: {
        exists: { errorMessage: 'Password is required' },
        notEmpty: { errorMessage: 'Password should not be empty' },
        trim: true,
        
    },
    phone: {
        exists: { errorMessage: 'Phone is required' },
        notEmpty: { errorMessage: 'Phone should not be empty' },
        trim: true,
        custom: {
            options: async (value) => {
                const user = await User.findOne({ phone: value });
                if (user) {
                    throw new Error('PhoneNumber already exists');
                }
                return true;
            }
        }
    },
    role: {
    //     exists: { errorMessage: 'Role is required' },
    //     notEmpty: { errorMessage: 'Role should not be empty' },
    //     trim: true,
        custom: {
            options: async function (value, { req }) {
                if (value === 'admin') {
                    const user = await User.findOne({ role: 'admin' });
                    if (user) {
                        throw new Error('Only one admin can register');
                    }
                }
                return true;
            }
        }
    }
};

module.exports = userRegisterValidationSchema