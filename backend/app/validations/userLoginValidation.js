

const userLoginValidationSchema = {
    email: {
        in: 'body',
        optional: true,
        errorMessage: 'email is required',
        notEmpty: true,
        isEmail: {
            errorMessage: 'invalid email format'
        },
        normalizeEmail: true,
        trim: true
    },
    username: {
        in: 'body',
        optional: true,
        errorMessage: 'username is required',
        notEmpty: true,
        isLength: {
            options: { min: 3 },
            errorMessage: 'username must be at least 3 characters long'
        },
        trim: true
    },
    phone: {
        in: 'body',
        optional: true,
        errorMessage: 'phone number is required',
        notEmpty: true,
        isLength: {
            options: { min: 10, max: 10 },
            errorMessage: 'phone number must be 10 digits'
        },
        isNumeric: {
            errorMessage: 'phone number must contain only numbers'
        },
        trim: true
    },
    password: {
        in: 'body',
        exists: true,
        errorMessage: 'password is required',
        notEmpty: true,
        isLength: {
            options: { min: 8, max: 128 },
            errorMessage: 'password should be between 8 - 128 characters'
        },
        trim: true
    },
    customValidator: {
        custom: {
            options: (value, { req }) => {
                const { email, username, phone } = req.body;
                if (!email && !username && !phone) {
                    throw new Error('Email, username, or phone number is required');
                }
                return true;
            }
        }
    }
};

module.exports = userLoginValidationSchema;
