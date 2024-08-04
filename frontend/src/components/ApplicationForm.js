import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from '../config/axios';
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import useCustomerProfile from "./useCustomerProfile";

// Function to calculate EMI value
function calculateEMIValue(amount, interestRate, duration) {
    const monthlyInterestRate = interestRate / 12 / 100;
    const emi = amount * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -duration));
    return Math.round(emi); // Round to the nearest integer
}

// Function to calculate EMI breakdown
// Function to calculate EMI breakdown
function calculateEMIBreakdown(amount, interestRate, duration) {
    const monthlyInterestRate = interestRate / 12 / 100;
    let principal = amount;
    const emi = calculateEMIValue(amount, interestRate, duration);
    const breakdown = [];
    let endingBalance = principal;

    for (let i = 0; i < duration; i++) {
        const interestPayment = endingBalance * monthlyInterestRate;
        const principalPayment = emi - interestPayment;
        endingBalance -= principalPayment;

        breakdown.push({
            month: i + 1,
            principal: principalPayment,
            interest: interestPayment,
            endingBalance: endingBalance > 0 ? endingBalance : 0 // Ensure ending balance doesn't go negative
        });
    }

    return breakdown;
}


// Function to format number as INR
const formatToINR = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

const ApplicationForm = () => {
    const { id } = useParams();
    const { customerProfile, loading, error } = useCustomerProfile(); // Fetch customer profile
    const [loan, setLoan] = useState(null);
    const [emi, setEmi] = useState(null);
    const [emiBreakdown, setEmiBreakdown] = useState([]);
    const [submitError, setSubmitError] = useState(null); // State to hold submit error message

    useEffect(() => {
        const fetchLoanDetails = async () => {
            try {
                const response = await axios.get(`/api/loans/${id}`);
                setLoan(response.data);
            } catch (err) {
                console.error("Error fetching loan details:", err);
                alert("Error fetching loan details");
            }
        };
        fetchLoanDetails();
    }, [id]);

    const formik = useFormik({
        initialValues: {
            amount: "",
            duration: "",
        },
        validationSchema: Yup.object({
            amount: Yup.number()
                .required("Amount is required")
                .min(1, "Amount must be greater than zero"),
            duration: Yup.number()
                .required("Duration is required")
                .min(1, "Duration must be at least 1 month"),
        }),
        onSubmit: async (values) => {
            if (!customerProfile) {
                console.error('Customer profile not loaded yet.');
                return;
            }
            try {
                const response = await axios.post('/api/applications', {
                    loan: id,
                    amount: values.amount,
                    duration: values.duration,
                    customerProfile: customerProfile._id, // Use customerProfile ID from the hook
                }, {
                   headers: {
                    Authorization: localStorage.getItem('token')
                   }
                });
                console.log(response.data);
                toast.success("Application submitted successfully!!!");
            } catch (err) {
                if (err.response && err.response.data && err.response.data.errors) {
                    const errorMessage = err.response.data.errors[0].msg;
                    setSubmitError(errorMessage); // Set error message for user feedback
                } else {
                    console.error("Error submitting application:", err);
                    alert("Error submitting application");
                }
            }
        },
    });

    const handleCalculateEmi = () => {
        if (loan && formik.values.amount && formik.values.duration) {
            const calculatedEmi = calculateEMIValue(formik.values.amount, loan.interestRate, formik.values.duration);
            setEmi(calculatedEmi);
            const breakdown = calculateEMIBreakdown(formik.values.amount, loan.interestRate, formik.values.duration);
            setEmiBreakdown(breakdown);
        }
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    {loan && (
                        <form onSubmit={formik.handleSubmit} className="bg-light p-4 rounded shadow-sm">
                            <h2 className="mb-4">Apply for {loan.type}</h2>
                            <div className="mb-3">
                                <label htmlFor="amount" className="form-label">Amount:</label>
                                <input
                                    id="amount"
                                    type="number"
                                    name="amount"
                                    className={`form-control ${formik.touched.amount && formik.errors.amount ? 'is-invalid' : ''}`}
                                    value={formik.values.amount}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.amount && formik.errors.amount ? (
                                    <div className="invalid-feedback">{formik.errors.amount}</div>
                                ) : null}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="duration" className="form-label">Duration (months):</label>
                                <input
                                    id="duration"
                                    type="number"
                                    name="duration"
                                    className={`form-control ${formik.touched.duration && formik.errors.duration ? 'is-invalid' : ''}`}
                                    value={formik.values.duration}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.duration && formik.errors.duration ? (
                                    <div className="invalid-feedback">{formik.errors.duration}</div>
                                ) : null}
                            </div>
                            <button type="button" className="btn btn-primary mb-3" onClick={handleCalculateEmi}>
                                Calculate EMI
                            </button>
                            <br/>
                            {emi !== null && (
                                <div className="mb-3">
                                    <p>Estimated EMI: {formatToINR(emi)}</p>
                                </div>
                            )}
                           {emiBreakdown.length > 0 && (
                             <div className="mb-3">
                                <h4>EMI Breakdown</h4>
                                 <table className="table table-bordered">
                                  <thead>
                                    <tr>
                                   <th>Month</th>
                                   <th>Principal</th>
                                   <th>Interest</th>
                                   <th>Ending Balance</th>
                                   </tr>
                                  </thead>
                                   <tbody>
                               {emiBreakdown.map((item) => (
                                <tr key={item.month}>
                                  <td>{item.month}</td>
                                  <td>{formatToINR(item.principal)}</td>
                                  <td>{formatToINR(item.interest)}</td>
                                 <td>{formatToINR(item.endingBalance)}</td>
                                </tr>
                               ))}
                           </tbody>
                          </table>
                        </div>
                        )}

                            <button type="submit" className="btn btn-success" disabled={!customerProfile || loading}>
                                Submit Application
                            </button>
                            {submitError && <div className="alert alert-danger mt-3">{submitError}</div>}
                            {error && <div className="alert alert-danger mt-3">Error loading customer profile: {error.message}</div>}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicationForm;
