// const mongoose = require('mongoose');
// require('dotenv').config();
// const CustomerProfile = require('./app/models/Customer-model')
// const Officer = require('./app/models/Officer-model')

// mongoose.connect(process.env.DB_URL)
//   .then(() => {
//     console.log('Connected to MongoDB for migration');

//     // Example migration logic: Update existing documents or modify schema
//     CustomerProfile.updateMany({}, { $set: { isVerified: false } })
//       .then(() => {
//         console.log('CustomerProfile documents updated');
//         return Officer.updateMany({}, { $set: { profilePic: '' } });
//       })
//       .then(() => {
//         console.log('Officer documents updated');
//         mongoose.disconnect();
//       })
//       .catch((error) => {
//         console.error('Error during migration:', error);
//         mongoose.disconnect();
//       });
//   })
//   .catch((error) => {
//     console.error('Error connecting to MongoDB:', error);
//   });