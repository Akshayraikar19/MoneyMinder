require('dotenv').config()
const express = require('express')
const configureDB = require('./config/db')
configureDB()
const {checkSchema} = require('express-validator')
const compression = require('compression')
const helmet = require('helmet')
const path = require('path');
// const morgan = require('morgan')
const cors = require('cors')
// const fs = require('fs');

const nodeCronCtlr = require('./app/utils/cronJob')
nodeCronCtlr()


const app = express()
const port = 4444


// CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'https://vercel.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json());
// Define routes after CORS middleware


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json())// Enable CORS for all origins and allow PUT method




app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));


app.use(express.urlencoded({ extended: false }));


app.use(compression({
    level: 6,
    threshold: 100 * 1000,  
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}));



const upload = require('./app/middlewares/multer')


//application level middleware - using it for logging request for debug purpose
app.use(function(req, res, next){
    console.log(`${req.ip} - ${req.method} - ${req.url} - ${new Date()}`)
    next()
})


const authenticateUser = require('./app/middlewares/authenticateUser')
const authorizeUser = require('./app/middlewares/authorizeUser')


const userRegisterValidationSchema = require('./app/validations/userRegisterValidation')
const userLoginValidationSchema = require('./app/validations/userLoginValidation')
const customerProfileValidationSchema = require('./app/validations/customer-Validation')
const customerProfileUpdateValidationSchema = require('./app/validations/customer-updateValidation')
const officerProfileValidationSchema = require('./app/validations/officer-Validation')
const officerProfileUpdateValidationSchema = require('./app/validations/officer-UpdateValidation')
const loanValidationSchema = require('./app/validations/loan-Validation')
const {applicationValidationSchema, applicationEditValidation} = require('./app/validations/application-validation')
const {forgotEmailValidationSchema, otpValidationSchema} = require('./app/validations/forgot-resetValidation')


const usersCltr = require('./app/controllers/user-Cltr')
const customerCltr = require('./app/controllers/customer-Cltr')
const loansCltr = require('./app/controllers/loan-Cltr')
const applicationsCltr = require('./app/controllers/application-Cltr')
const paymentCltr = require('./app/controllers/payment-Cltr')
const officerCltr = require('./app/controllers/officer-Cltr')



//register
app.post('/users/register', checkSchema(userRegisterValidationSchema), usersCltr.register)
app.get('/check-admin', usersCltr.checkAdmin)
app.get('/users/checkemail', usersCltr.checkEmail)
app.get('/users/checkusername', usersCltr.checkUsername)
app.get('/users/checkphone', usersCltr.checkPhone)
app.post('/users/login', checkSchema(userLoginValidationSchema), usersCltr.login)
app.get('/users/account', authenticateUser, usersCltr.account)

app.get('/unverified-officers', authenticateUser, authorizeUser(['admin']), usersCltr.unverified)
app.post('/verify-officer', authenticateUser, authorizeUser(['admin']), usersCltr.verified)
app.get('/verifiedOfficers', authenticateUser, authorizeUser(['admin']), usersCltr.verifiedOfficers)
app.post('/reject-officer', authenticateUser, authorizeUser(['admin']), usersCltr.reject)

app.post('/users/forgot-password', checkSchema(forgotEmailValidationSchema) , usersCltr.forgotPassword)
app.post('/users/reset-password',checkSchema(otpValidationSchema) ,usersCltr.resetPassword)

//profile
app.post('/api/customers/profile', 
    authenticateUser, 
    authorizeUser(['customer']), 
    upload.fields([
        { name: 'aadhaarPhoto', maxCount: 1 },
        { name: 'panPhoto', maxCount: 1 },
        { name: 'profilePic', maxCount: 1 }
    ]), 
    checkSchema(customerProfileValidationSchema), 
    customerCltr.createProfile
);


// Get customer profile route
app.get('/api/customers/profile', 
    authenticateUser, 
    authorizeUser(['customer']), 
    customerCltr.getProfile
);

// Update customer profile route
app.put('/api/customers/profile', 
    authenticateUser, 
    authorizeUser(['customer']),  
    upload.fields([
        { name: 'aadhaarPhoto', maxCount: 1 },
        { name: 'panPhoto', maxCount: 1 },
        { name: 'profilePic', maxCount: 1 }
    ]),
    checkSchema(customerProfileUpdateValidationSchema), 
    customerCltr.updateProfile
);



// Create Officer Profile
app.post('/api/officers/profile', 
    authenticateUser, 
    authorizeUser(['officer']),  
    upload.fields([
        { name: 'aadhaarPhoto', maxCount: 1 },
        { name: 'panPhoto', maxCount: 1 },
        { name: 'profilePic', maxCount: 1 }
    ]), 
    checkSchema(officerProfileValidationSchema), 
    officerCltr.createProfile
);

// Get Officer Profile
app.get('/api/officers/profile', 
    authenticateUser, 
    authorizeUser(['officer']), 
    officerCltr.getProfile
);

// Update Officer Profile
app.put('/api/officers/profile', 
    authenticateUser, 
    authorizeUser(['officer']), 
    upload.fields([
        { name: 'aadhaarPhoto', maxCount: 1 },
        { name: 'panPhoto', maxCount: 1 },
        { name: 'profilePic', maxCount: 1 }
    ]), 
    checkSchema(officerProfileUpdateValidationSchema), 
    officerCltr.updateProfile
);


//Loans
app.get('/api/loans', loansCltr.list)
app.get('/api/loans/my', authenticateUser, authorizeUser(['officer']), loansCltr.my)
app.get('/api/loans/:id', loansCltr.show)

app.post('/api/loans', authenticateUser, authorizeUser(['officer']), checkSchema(loanValidationSchema), loansCltr.create)
app.put('/api/loans/:id', authenticateUser, authorizeUser(['officer']), checkSchema(loanValidationSchema), loansCltr.update)
app.delete('/api/loans/:id', authenticateUser, authorizeUser(['officer']), loansCltr.remove)


//applications
app.post('/api/applications/calculate-emi', authenticateUser, authorizeUser(['customer']), applicationsCltr.calculateEMI)
app.post('/api/applications', authenticateUser, authorizeUser(['customer']), checkSchema(applicationValidationSchema) ,applicationsCltr.apply)
app.get('/api/loans/check/:loanId', authenticateUser, authorizeUser(['customer', 'officer']), applicationsCltr.check)

//applications updation and viewing
app.get('/api/loans/:id/applications', authenticateUser, authorizeUser([ 'officer']), loansCltr.applications)
app.get('/api/loans/:id/applications/:appId', authenticateUser, authorizeUser(['officer']), loansCltr.singleApplication)


app.put('/api/loans/:id/applications/:appId/status', authenticateUser, authorizeUser(['officer']), checkSchema(applicationEditValidation), loansCltr.applicationUpdateOfficer)

app.get('/admin/applications', authenticateUser, authorizeUser(['admin',]), loansCltr.getApplicationsForAdmin);
app.get('/admin/applications/:appId', authenticateUser, authorizeUser(['admin']), loansCltr.singleApplicationAdmin)
app.put('/admin/applications/:appId/approve', authenticateUser, authorizeUser(['admin']), loansCltr.approveApplicationsByAdmin)

app.post('/setEmiDueDate/:applicationId', authenticateUser, authorizeUser(['customer']), loansCltr.setEmiDueDate)

app.get('/admin/approved/applications', authenticateUser, authorizeUser(['admin']), loansCltr.adminApprovedApplications)

//payment
 app.post('/payments/pay/online', authenticateUser, authorizeUser(['customer']), paymentCltr.payOnline)
 app.put('/api/payment/status/update/:id',  paymentCltr.successUpdate)
 app.put('/api/payment/failure/update/:id', paymentCltr.failureUpdate)

 app.post('/payments/pay/offline', authenticateUser, authorizeUser(['customer']), paymentCltr.payOffline)
 app.get('/admin/OfflinePayments/:applicationId', authenticateUser, authorizeUser(['admin']), paymentCltr.OfflinePayments)
 app.put('/payments/verify/:applicationId', authenticateUser, authorizeUser(['admin']), paymentCltr.verifyOfflinePayment)


 app.get('/checkStatus/:customerId', paymentCltr.checkStatus)
 app.get('/payments/list' ,authenticateUser, authorizeUser(['customer', 'admin']), paymentCltr.list)
 app.get('/payments/application/:applicationId', authenticateUser, authorizeUser(['admin']), paymentCltr.listByApplicationId)


 app.get('/loans-sanctions', authenticateUser, authorizeUser(['admin']), applicationsCltr.loanSanctions)
 app.get('/loans-retentions', authenticateUser, authorizeUser(['admin']), applicationsCltr.loanretentions)

app.listen(port, () => {
    console.log('server running on port', port)
})


// Serve static files from the 'uploads' directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
//     // Ensure CORS headers allow the specified origin and credentials
//     setHeaders: (res, path, stat) => {
//       res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
//       res.set('Access-Control-Allow-Credentials', 'true');
//     },
//   }));

// const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
// app.use(morgan('combined', { stream: accessLogStream }));
// app.use(cors())
// app.use(cors({
//     origin: ['http://localhost:3000', 'https://money-minder-loan-app-frontend.vercel.app'],
//   }));
  
  
// // Enable CORS for all origins and allow required methods and headers
// app.use(cors({
//   origin: 'http://localhost:3000',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,  // enable set cookie with CORS
// }));

// Serve static files