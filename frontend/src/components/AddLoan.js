import axios from '../config/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

export default function AddLoan() {

    const loanTypes = [
        { name: 'Home Loan', value: 'HomeLoan' },
        { name: 'Car Loan', value: 'CarLoan' },
        { name: 'Personal Loan', value: 'PersonalLoan' },
        { name: 'Gold Loan', value: 'GoldLoan' }
    ];

    // Form validation Schema using Yup
    const validationSchema = Yup.object().shape({
        type: Yup.string().required('Type is required'),
        description: Yup.string().required('Description is required'),
        interestRate: Yup.string().required('Rate of interest is required')
    });

    // Formik form setup
    const formik = useFormik({
        initialValues: {
            type: '',
            description: '',
            interestRate: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const response = await axios.post('/api/loans', values, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                console.log(response.data);
                toast.success('Loan created successfully');
                resetForm();
            } catch (error) {
                console.log('Error', error);
                if (error.response && error.response.data && error.response.data.errors) {
                    const serverErrors = error.response.data.errors;
                    formik.setErrors(serverErrors); // Set server validation errors to formik
                }
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6">
                    <h4 className="text-center">Add Loan</h4>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-group">
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
                                {loanTypes.map((loan, index) => (
                                    <option key={index} value={loan.value}>
                                        {loan.name}
                                    </option>
                                ))}
                            </select>
                            {formik.errors.type && <div className="invalid-feedback">{formik.errors.type}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="description"><strong>Description:</strong></label>
                            <textarea
                                id="description"
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                className={`form-control ${formik.errors.description ? 'is-invalid' : ''}`}
                                disabled={formik.isSubmitting}
                            />
                            {formik.errors.description && <div className="invalid-feedback">{formik.errors.description}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="interestRate"><strong>Interest Rate(%):</strong></label>
                            <input
                                type="text"
                                id="interestRate"
                                name="interestRate"
                                value={formik.values.interestRate}
                                onChange={formik.handleChange}
                                className={`form-control ${formik.errors.interestRate ? 'is-invalid' : ''}`}
                                disabled={formik.isSubmitting}
                            />
                            {formik.errors.interestRate && <div className="invalid-feedback">{formik.errors.interestRate}</div>}
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
