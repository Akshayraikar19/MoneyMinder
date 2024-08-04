import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import axios from '../config/axios';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { startForgotPassword } from '../actions/forgot-action';

export default function Login() {
    const navigate = useNavigate();
    const { handleLogin } = useAuth();
    const [serverError, setServerError] = useState([]);
    const [modal, setModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotEmailError, setForgotEmailError] = useState('');

    const toggle = () => {
        formik.resetForm();
        setForgotEmail('');
        setForgotEmailError('');
        setServerError([]);
        setModal(!modal);
    };

    const handleInputChange = (e) => {
        setForgotEmail(e.target.value);
    };

    const dispatch = useDispatch();
    const error = useSelector(state => state.forgot.error);

    const validationSchema = Yup.object().shape({
        identifier: Yup.string().required('Email, Username, or Phone is required'),
        password: Yup.string().required('Password is required'),
    });

    const forgotPasswordSchema = Yup.object({
        forgotEmail: Yup.string().email('Invalid email format').required('Email is required'),
    });

    const formik = useFormik({
        initialValues: {
            identifier: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                let loginData = { password: values.password };

                if (values.identifier.includes('@')) {
                    loginData.email = values.identifier;
                } else if (/^\d+$/.test(values.identifier)) {
                    loginData.phone = values.identifier;
                } else {
                    loginData.username = values.identifier;
                }

                const response = await axios.post('/users/login', loginData);
                localStorage.setItem('token', response.data.token);

                const userResponse = await axios.get('/users/account', {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                });

                handleLogin(userResponse.data);
                resetForm();
                toast.success('Login Success', {
                    autoClose: 1000,
                    onClose: () => {
                        navigate('/loan-list');
                    },
                });
            } catch (err) {
                if (err.response) {
                    if (err.response.status === 403) {
                        navigate('/verification-progress');
                    } else if (err.response.status === 400 && err.response.data.errors) {
                        setServerError(err.response.data.errors.map(error => error.msg));
                    } else {
                        console.error('Error:', err.message);
                        setServerError(['Something went wrong. Please try again.']);
                    }
                }
            }
        },
    });

    const handleSubmitForgotPassword = async (e) => {
        e.preventDefault();
        try {
            await forgotPasswordSchema.validate({ forgotEmail });
            setForgotEmailError('');
            dispatch(startForgotPassword(forgotEmail, toggle, navigate));
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                setForgotEmailError(error.message);
            } else if (error.response && error.response.status === 404) {
                setForgotEmailError(error.response.data.message);
            } else {
                dispatch(startForgotPassword(error));
            }
        }
    };

    return (
        <section className="vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#007bff' }}>
            <div className="container py-5">
                <div className="row d-flex justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 col-xl-6">
                        <div className="card bg-dark text-white" style={{ borderRadius: '1rem' }}>
                            <div className="card-body p-4 text-center">
                                <div className="mb-4 pb-4">
                                    <h2 className="fw-bold mb-3 text-uppercase">Login</h2>
                                    <p className="text-white-50 mb-3">Please enter your login and password!</p>
                                    <form onSubmit={formik.handleSubmit}>
                                        <div className="mb-3">
                                            <input
                                                type="text"
                                                id="identifier"
                                                name="identifier"
                                                onChange={formik.handleChange}
                                                value={formik.values.identifier}
                                                className="form-control form-control-lg"
                                                placeholder="Email, Username, or Phone"
                                            />
                                            {formik.touched.identifier && formik.errors.identifier && (
                                                <p className="text-danger mt-1 mb-0">{formik.errors.identifier}</p>
                                            )}
                                            {serverError.includes('Email, Username, or Phone is required') && (
                                                <p className="text-danger mt-1 mb-0">Email, Username, or Phone is required</p>
                                            )}
                                        </div>
                                        <div className="mb-3">
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                onChange={formik.handleChange}
                                                value={formik.values.password}
                                                className="form-control form-control-lg"
                                                placeholder="Password"
                                            />
                                            {formik.touched.password && formik.errors.password && (
                                                <p className="text-danger mt-1 mb-0">{formik.errors.password}</p>
                                            )}
                                            {serverError.includes('Password is required') && (
                                                <p className="text-danger mt-1 mb-0">Password is required</p>
                                            )}
                                        </div>
                                        {serverError.length > 0 && (
                                            <p className="text-danger mt-2 mb-0">{serverError.join(', ')}</p>
                                        )}
                                        <button className="btn btn-outline-light btn-lg px-4 mt-3" type="submit" disabled={formik.isSubmitting}>
                                            Login
                                        </button>
                                    </form>
                                    <p className="small mt-3 mb-0">
                                        <Link className="text-white-50" onClick={toggle}>Forgot password?</Link>
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-0">Don't have an account? <Link to="/register" className="text-white-50 fw-bold">Sign Up</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Forgot Password</ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSubmitForgotPassword}>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Email to reset Password"
                            value={forgotEmail}
                            onChange={handleInputChange}
                        />
                        {forgotEmailError && (
                            <p className="text-danger mt-2 mb-0">{forgotEmailError}</p>
                        )}
                        {error && (
                            <p className="text-danger mt-2 mb-0">{error}</p>
                        )}
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button type="submit" color="primary" onClick={handleSubmitForgotPassword} className="mt-2">
                        Submit
                    </Button>
                    <Button color="secondary" onClick={toggle}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </section>
    );
}
