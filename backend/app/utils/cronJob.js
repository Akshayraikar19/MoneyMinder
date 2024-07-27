// require('dotenv').config(); // Ensure dotenv is loaded

// const cron = require('node-cron');
// const nodemailer = require('nodemailer');
// const { addDays, startOfDay, isBefore, isAfter, format } = require('date-fns');
// const Application = require('../models/application-model'); // Import the application model

// // Configure Nodemailer
// const transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.PASS,
//   },
// });

// // Utility function to send an email
// const sendReminderEmail = async (email, username, dueDate) => {
//   const mailOptions = {
//     from: process.env.EMAIL,
//     to: email,
//     subject: 'EMI Payment Reminder',
//     text: `Dear ${username},

// This is a reminder that your EMI payment will be due on ${dueDate}. 

// Please make sure to make the payment before the due date to avoid any late fees.

// If you have already made the payment, please disregard this reminder.

// Best regards,
// MoneyMinder`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`Reminder email sent to ${email} for due date ${dueDate}`);
//   } catch (error) {
//     console.error('Error sending reminder email:', error);
//   }
// };

// // Define the cron job function
// const nodeCronCtlr = async () => {
//   try {
//     const today = startOfDay(new Date());

//     // Fetch all applications with upcoming EMI due dates
//     const applications = await Application.find({
//       nextEmiDueDate: { $gte: today },
//     }).populate('customer');

//     console.log('Fetched applications:', applications);

//     // Process each application
//     for (const application of applications) {
//       const nextDueDate = application.nextEmiDueDate;
//       const reminderDate = addDays(nextDueDate, -2); // 2 days before the due date

//       // Check if today is 2 days before the reminder date
//       if (isBefore(today, reminderDate) && isAfter(today, addDays(reminderDate, -2))) {
//         const customer = application.customer;
//         if (customer) {
//           console.log(`Sending reminder email to ${customer.email}...`);
//           await sendReminderEmail(customer.email, customer.username, format(nextDueDate, 'yyyy-MM-dd'));
//         } else {
//           console.log('No customer found for application:', application._id);
//         }
//       } else {
//         console.log(`No reminder needed for application ${application._id}.`);
//       }
//     }
//   } catch (error) {
//     console.error('Error running cron job:', error);
//   }
// };

// // // Schedule a cron job to run daily at midnight
// // cron.schedule('0 0 * * *', () => {
// //   console.log('Running daily EMI reminder job...');
// //   nodeCronCtlr(); // Call your function to handle the reminders
// // });

// console.log('Cron job scheduled: Daily at midnight');

// // Export for testing
// module.exports = nodeCronCtlr;



// // For testing, schedule the cron job to run every minute
// cron.schedule('* * * * *', () => {
//   console.log('Running job every minute for testing...');
//   nodeCronCtlr(); // Call your function to handle the reminders
// });


require('dotenv').config(); // Ensure dotenv is loaded

const cron = require('node-cron');
const nodemailer = require('nodemailer');
const { addDays, startOfDay, isEqual, format } = require('date-fns');
const Application = require('../models/application-model'); // Import the application model

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

// Utility function to send an email
const sendReminderEmail = async (email, username, dueDate) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'EMI Payment Reminder',
    text: `Dear ${username},

This is a reminder that your EMI payment will be due on ${dueDate}. 

Please make sure to make the payment before the due date to avoid any late fees.

If you have already made the payment, please disregard this reminder.

Best regards,
MoneyMinder`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${email} for due date ${dueDate}`);
  } catch (error) {
    console.error('Error sending reminder email:', error);
  }
};

// Define the cron job function
const nodeCronCtlr = async () => {
  try {
    const today = startOfDay(new Date());

    // Fetch all applications with upcoming EMI due dates
    const applications = await Application.find({
      nextEmiDueDate: { $gte: today },
    }).populate('customer');

    // console.log('Fetched applications:', applications);

    // Process each application
    for (const application of applications) {
      const nextDueDate = application.nextEmiDueDate;
      const reminderDate = addDays(nextDueDate, -2); // 2 days before the due date

      // Debug log for reminder dates
      console.log(`Reminder date for application ${application._id}: ${format(reminderDate, 'yyyy-MM-dd')}`);
      console.log(`Today: ${format(today, 'yyyy-MM-dd')}`);

      // Check if today is the same as the reminder date
      if (isEqual(today, reminderDate)) {
        const customer = application.customer;
        if (customer) {
          console.log(`Sending reminder email to ${customer.email}...`);
          await sendReminderEmail(customer.email, customer.username, format(nextDueDate, 'yyyy-MM-dd'));
        } else {
          console.log('No customer found for application:', application._id);
        }
      } else {
        console.log(`No reminder needed for application ${application._id}.`);
      }
    }
  } catch (error) {
    console.error('Error running cron job:', error);
  }
};

// For testing, schedule the cron job to run every minute
// Schedule a cron job to run daily at midnight
cron.schedule('0 0 * * *', () => {
  console.log('Running daily EMI reminder job...');
  nodeCronCtlr(); // Call your function to handle the reminders
});
 //console.log('Cron job scheduled: Daily at midnight')


module.exports = nodeCronCtlr


// node-cron will handle the scheduling and execution of tasks automatically as long as your application is running.









// require('dotenv').config(); // Ensure dotenv is loaded

// const cron = require('node-cron');
// const nodemailer = require('nodemailer');
// const { addDays, startOfDay, format } = require('date-fns');
// const Application = require('../models/application-model'); // Import the application model

// // Configure Nodemailer
// const transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.PASS,
//   },
// });

// // Utility function to send an email
// const sendReminderEmail = async (email, username, dueDate) => {
//   const mailOptions = {
//     from: process.env.EMAIL,
//     to: email,
//     subject: 'EMI Payment Reminder',
//     text: `Dear ${username},

// This is a reminder that your EMI payment will be due on ${dueDate}. 

// Please make sure to make the payment before the due date to avoid any late fees.

// If you have already made the payment, please disregard this reminder.

// Best regards,
// MoneyMinder`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`Reminder email sent to ${email} for due date ${dueDate}`);
//   } catch (error) {
//     console.error('Error sending reminder email:', error);
//   }
// };

// // Define the cron job function
// const nodeCronCtlr = async () => {
//   try {
//     const today = startOfDay(new Date());

//     // Fetch all applications with upcoming EMI due dates
//     const applications = await Application.find({
//       nextEmiDueDate: { $gte: today },
//     }).populate('customer');

//     console.log('Fetched applications:', applications);

//     // Process each application
//     for (const application of applications) {
//       const nextDueDate = application.nextEmiDueDate;
//       const reminderDate = addDays(nextDueDate, -2); // 2 days before the due date

//       // Debug log for reminder dates
//       console.log(`Reminder date for application ${application._id}: ${format(reminderDate, 'yyyy-MM-dd')}`);
//       console.log(`Today: ${format(today, 'yyyy-MM-dd')}`);

//       // Send email to the customer regardless of the reminder date
//       const customer = application.customer;
//       if (customer) {
//         console.log(`Sending reminder email to ${customer.email}...`);
//         await sendReminderEmail(customer.email, customer.username, format(nextDueDate, 'yyyy-MM-dd'));
//       } else {
//         console.log('No customer found for application:', application._id);
//       }
//     }
//   } catch (error) {
//     console.error('Error running cron job:', error);
//   }
// };

// // For testing, schedule the cron job to run every minute
// cron.schedule('* * * * *', () => {
//   console.log('Running job every minute for testing...');
//   nodeCronCtlr(); // Call your function to handle the reminders
// });

// module.exports = nodeCronCtlr