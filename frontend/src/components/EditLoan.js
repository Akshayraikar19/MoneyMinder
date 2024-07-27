import axios from '../config/axios';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {toast} from "react-toastify"

export default function EditLoan() {
    const navigate = useNavigate();
    const { loanId } = useParams(); // Ensure we capture loanId from useParams
    const [loan, setLoan] = useState(null);

    useEffect(() => {
        async function fetchLoan() {
            try {
                const response = await axios.get(`/api/loans/${loanId}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                setLoan(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchLoan();
    }, [loanId]);

    const validationSchema = Yup.object().shape({
        type: Yup.string().required('Loan type is required'),
        description: Yup.string().required('Description is required'),
        interestRate: Yup.number().required('Interest rate is required').min(0, 'Interest rate must be at least 0')
    });

    const formik = useFormik({
        initialValues: {
            type: loan?.type || '',
            description: loan?.description || '',
            interestRate: loan?.interestRate || ''
        },
        enableReinitialize: true, // Enable reinitialization of form values when loan changes
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await axios.put(`/api/loans/${loanId}`, values, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                console.log(response.data);
                setSubmitting(false);
                toast.success('loan updated successfullyyy!!!')
                navigate(`/loan-detail/${loanId}`); // Redirect to loan details page after successful update
            } catch (error) {
                console.log('Error:', error);
                setSubmitting(false);
                // Handle error, e.g., show validation errors or display an error message
            }
        }
    });

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h4 className="text-center mb-4">Edit Loan</h4>
                    {loan ? (
                        <form onSubmit={formik.handleSubmit} className="p-4 shadow-sm rounded bg-light">
                            <div className="form-group mb-3">
                                <label htmlFor="type"><strong>Loan Type:</strong></label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formik.values.type}
                                    onChange={formik.handleChange}
                                    className={`form-control ${formik.errors.type ? 'is-invalid' : ''}`}
                                    disabled={formik.isSubmitting}
                                >
                                    <option value="">Select Loan Type</option>
                                    <option value="HomeLoan">Home Loan</option>
                                    <option value="CarLoan">Car Loan</option>
                                    <option value="PersonalLoan">Personal Loan</option>
                                    <option value="GoldLoan">Gold Loan</option>
                                </select>
                                {formik.errors.type && <div className="invalid-feedback">{formik.errors.type}</div>}
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="description"><strong>Description:</strong></label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="4"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    className={`form-control ${formik.errors.description ? 'is-invalid' : ''}`}
                                    disabled={formik.isSubmitting}
                                />
                                {formik.errors.description && <div className="invalid-feedback">{formik.errors.description}</div>}
                            </div>
                            <div className="form-group mb-4">
                                <label htmlFor="interestRate"><strong>Interest Rate (%):</strong></label>
                                <input
                                    type="number"
                                    id="interestRate"
                                    name="interestRate"
                                    value={formik.values.interestRate}
                                    onChange={formik.handleChange}
                                    className={`form-control ${formik.errors.interestRate ? 'is-invalid' : ''}`}
                                    disabled={formik.isSubmitting}
                                />
                                {formik.errors.interestRate && <div className="invalid-feedback">{formik.errors.interestRate}</div>}
                            </div>
                            <button type="submit" className="btn btn-primary w-100" disabled={formik.isSubmitting}>
                                Save Changes
                            </button>
                        </form>
                    ) : (
                        <div className="text-center">Loading...</div>
                    )}
                </div>
            </div>
        </div>
    );
}
