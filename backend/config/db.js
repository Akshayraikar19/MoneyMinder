// const mongoose = require('mongoose')
// const configureDB = async() => {
//     try{
//         const db = await mongoose.connect(process.env.DB_URL)
//         console.log('connected to db')
//     }  catch(err) {
//         console.log(err)
//     }
// }

// module.exports = configureDB
const mongoose = require('mongoose');

// Function to configure the database connection
const configureDB = async () => {
    try {
        // Connect to MongoDB Atlas using the connection string from environment variables
        const db = await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to DB');
    } catch (err) {
        console.log('Error connecting to DB:', err);
    }
};

module.exports = configureDB;
