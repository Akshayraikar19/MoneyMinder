const Application = require('../models/application-model')
const Loan = require('../models/loan-model')
const  {validationResult} = require('express-validator')
const loansCltr= {}


loansCltr.list = async (req,res) => {
    try{
        const loans = await Loan.find() 
        res.json(loans)
    }catch(err) {
        console.log(err) 
        res.status(500).json({ error: 'something went wrong'})
    }
}

loansCltr.show = async(req, res) => {
    const id = req.params.id
    try{
        const loan = await Loan.findById(id) 
        res.json(loan)
    } catch(err) {
        console.log(err)
        res.status(500).json({ error: 'something went wrong'})
    }
}

loansCltr.my = async(req, res) => {
    try{
        const loans = await Loan.find({ officer: req.user.id})
        res.json(loans)
    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'something went wrong'})
    }
}

//loans creations
loansCltr.create = async(req,res) => {
    const errors = validationResult(req) 
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()})
    }
    const body = req.body
    const loan = new Loan(body)
    loan.officer = req.user.id
    await loan.save()
    res.status(201).json(loan)
}

loansCltr.update = async(req,res) => {
    const id = req.params.id
    const body = req.body

    const loan = await Loan.findOneAndUpdate({ officer: req.user.id, _id:id}, body, {new: true})
    if(!loan) {
        return res.status(404).json({ error: 'record not found'})
    }
    res.json(loan)
}

loansCltr.remove = async(req, res) => {
    const id = req.params.id
    const loan = await Loan.findOneAndDelete({ officer: req.user.id, _id:id})
    if(!loan) {
        return res.status(404).json({ error: 'record not found'})
    }
    res.json(loan)
}



//finding all applications for the loan
loansCltr.applications = async (req, res) => {
    const id = req.params.id
    const loan = await Loan.findOne({_id: id, officer: req.user.id}) // 1st find all the loans that belong to the officer
    if(!loan) {
        return res.status(400).json({ error: 'record not found'})
    }
    const application = await Application.find({ loan: loan._id }).populate('customer')
    res.json(application)
}

loansCltr.singleApplication = async(req, res) => {
    const id = req.params.id
    const appId = req.params.appId
    
    const loan = await Loan.findOne({ _id: id, officer: req.user.id})
    if(!loan) {
        return res.status(400).json({error: 'record not found'})
    }
    const application = await Application.findOne({ _id:appId, loan:loan._id}).populate('customerProfile')
    res.json(application)
}


loansCltr.applicationUpdateOfficer = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id;
    const appId = req.params.appId;
    const { status, rejectedReason } = req.body;

    try {
        // Check if the loan exists and belongs to the logged-in officer
        const loan = await Loan.findOne({ _id: id, officer: req.user.id });
        if (!loan) {
            return res.status(404).json({ error: 'Loan record not found' });
        }

        // Find the application
        const application = await Application.findOne({ _id: appId, loan: id }).populate('customerProfile');
        if (!application) {
            return res.status(404).json({ error: 'Application not found for this loan' });
        }

        if (status === 'approvedByOfficer') {
            if (application.status === 'pending') {
                application.status = 'approvedByOfficer';
                application.approvedByOfficer = req.user.id;
                application.officerApprovedDate = new Date();

                // Update the customer profile to set isVerified to true
                if (application.customerProfile) {
                    application.customerProfile.isVerified = true;
                    await application.customerProfile.save();
                }

                await application.save();
                return res.json(application);
            } else {
                return res.status(400).json({ error: 'Invalid status transition' });
            }
        } else if (status === 'rejected') {
            if (application.status === 'pending') {
                application.status = 'rejected';
                application.rejectedReason = rejectedReason;
                await application.save();
                return res.json(application);
            } else {
                return res.status(400).json({ error: 'Invalid status transition' });
            }
        } else {
            return res.status(400).json({ error: 'Invalid status value' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};




//admin logic admin only gets the approved applications 

loansCltr.getApplicationsForAdmin = async (req, res) => {
    try {
        // Find applications with status 'approvedByOfficer' and populate 'customerProfile'
        const applications = await Application.find({ status: 'approvedByOfficer' }).populate('customerProfile').populate('loan')
        res.json(applications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

loansCltr.singleApplicationAdmin = async(req, res) => {
    const appId = req.params.appId

    const application = await Application.findOne({ _id:appId}).populate('customerProfile').populate('loan')
    res.json(application)
}


loansCltr.approveApplicationsByAdmin = async (req, res) => {
    const { appId } = req.params;
    const { action, reason } = req.body;

    try {
        const application = await Application.findById(appId);

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        if (application.status !== 'approvedByOfficer') {
            return res.status(400).json({ error: 'Invalid status transition' });
        }

        if (action === 'approve') {
            application.status = 'approvedByAdmin';
            application.approvedByAdmin = req.user.id;
            application.adminApprovedDate = new Date();
        } else if (action === 'reject') {
            application.status = 'rejectedByAdmin';
            application.rejectedReason = reason;
        } else {
            return res.status(400).json({ error: 'Invalid action' });
        }

        await application.save();
        res.json(application);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};



loansCltr.setEmiDueDate = async (req, res) => {
    const { applicationId } = req.params;
    const { nextEmiDueDate } = req.body;

    try {
        const application = await Application.findByIdAndUpdate(
            applicationId,
            { nextEmiDueDate },
            { new: true }
        );
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.json({ message: "EMI due date set successfully", application });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

loansCltr.adminApprovedApplications = async (req, res) => {
    try {
        // Find applications with status 'approvedByOfficer' and populate 'customerProfile'
        const applications = await Application.find({ status: 'approvedByAdmin' }).populate('customerProfile').populate('loan')
        res.json(applications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};



module.exports = loansCltr