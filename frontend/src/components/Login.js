// import { useFormik } from 'formik';
// import { toast } from 'react-toastify';
// import * as Yup from 'yup';
// import axios from '../config/axios';
// import { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate, Link } from 'react-router-dom';
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
// import { useDispatch, useSelector } from 'react-redux';
// import { startForgotPassword } from '../actions/forgot-action';

// export default function Login() {
//     const navigate = useNavigate();
//     const { handleLogin } = useAuth();
//     const [serverError, setServerError] = useState([]);
//     const [modal, setModal] = useState(false);
//     const [forgotEmail, setForgotEmail] = useState('');
//     const [forgotEmailError, setForgotEmailError] = useState('');
//     const dispatch = useDispatch();
//     const error = useSelector(state => state.forgot.error);

//     const validationSchema = Yup.object().shape({
//         identifier: Yup.string().required('Email, Username, or Phone is required'),
//         password: Yup.string().required('Password is required'),
//     });

//     const formik = useFormik({
//         initialValues: {
//             identifier: '',
//             password: '',
//         },
//        validationSchema,
//         onSubmit: async (values, { resetForm }) => {
//             try {
//                 let loginData = {
//                     password: values.password,
//                 };

//                 // Determine which identifier was used (email, username, or phone)
//                 if (values.identifier.includes('@')) {
//                     loginData.email = values.identifier;
//                 } else if (/^\d+$/.test(values.identifier)) {
//                     loginData.phone = values.identifier;
//                 } else {
//                     loginData.username = values.identifier;
//                 }

//                 const response = await axios.post('/users/login', loginData);
//                 localStorage.setItem('token', response.data.token);

//                 const userResponse = await axios.get('/users/account', {
//                     headers: {
//                         Authorization: localStorage.getItem('token'),
//                     },
//                 });

//                 handleLogin(userResponse.data);
//                 resetForm();
//                 toast.success('Login Success', {
//                     autoClose: 1000,
//                     onClose: () => {
//                         navigate('/');
//                     },
//                 });
//             } catch (err) {
//                 if (err.response && err.response.status === 403) {
//                     // Officer not verified by admin
//                     setServerError(['Officer not verified by admin.']);
//                 } else if (err.response && err.response.status === 400 && err.response.data.errors) {
//                     setServerError(err.response.data.errors.map(error => error.msg));
//                 } else {
//                     console.error('Error:', err.message);
//                     setServerError(['Something went wrong. Please try again.']);
//                 }
//             }
//         },
//     });

//     const toggle = () => {
//         formik.resetForm();
//         setForgotEmail('');
//         setForgotEmailError('');
//         setServerError([]);
//         setModal(!modal);
//     };

//     const handleInputChange = (e) => {
//         setForgotEmail(e.target.value);
//     };

//     const handleSubmitForgotPassword = async (e) => {
//         e.preventDefault();
//         try {
//             await Yup.string().email('Invalid email format').required('Email is required').validate({ forgotEmail });
//             setForgotEmailError('');
//             dispatch(startForgotPassword(forgotEmail, toggle, navigate));
//         } catch (error) {
//             if (error instanceof Yup.ValidationError) {
//                 setForgotEmailError(error.message);
//             } else if (error.response && error.response.status === 404) {
//                 setForgotEmailError(error.response.data.message);
//             } else {
//                 dispatch(startForgotPassword(error));
//             }
//         }
//     };

//     return (
//         <div className="col-md-6">
//             <h3>Login Component</h3>
//             {serverError.length > 0 && (
//                 <div className="alert alert-danger" role="alert">
//                     <ul>
//                         {serverError.map((error, index) => (
//                             <li key={index}>{error}</li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//             <form onSubmit={formik.handleSubmit}>
//                 <div className="form-group">
//                     <label htmlFor="identifier">Email, Username, or Phone</label><br />
//                     <input
//                         type="text"
//                         id="identifier"
//                         name="identifier"
//                         onChange={formik.handleChange}
//                         value={formik.values.identifier}
//                         className="form-control"
//                     />
//                     {formik.touched.identifier && formik.errors.identifier && (
//                         <p style={{ color: 'red', marginTop: '5px', marginBottom: '0' }}>{formik.errors.identifier}</p>
//                     )}
//                 </div>

//                 <div className="form-group">
//                     <label htmlFor="password">Password</label><br />
//                     <input
//                         type="password"
//                         id="password"
//                         name="password"
//                         onChange={formik.handleChange}
//                         value={formik.values.password}
//                         className="form-control"
//                     />
//                     {formik.touched.password && formik.errors.password && (
//                         <p style={{ color: 'red', marginTop: '5px', marginBottom: '0' }}>{formik.errors.password}</p>
//                     )}
//                 </div>

//                 <input type="submit" value="Login" className="btn btn-primary mt-3" disabled={formik.isSubmitting} />
//             </form>


//             <Link onClick={toggle}>Forgot password?</Link>
//             <Modal isOpen={modal} toggle={toggle}>
//                 <ModalHeader toggle={toggle}>Forgot Password</ModalHeader>
//                 <ModalBody>
//                     <form className='col-md-8'>
//                         <input
//                             className='form-control'
//                             type='text'
//                             placeholder='Enter Email to reset Password'
//                             value={forgotEmail}
//                             onChange={handleInputChange}
//                         />

//                         {forgotEmailError && (
//                             <p style={{ color: 'red', marginTop: '5px', marginBottom: '0' }}>{forgotEmailError}</p>
//                         )}

//                         {error && typeof error === 'string' && (
//                             <p style={{ color: 'red', marginTop: '5px', marginBottom: '0' }}>{error}</p>
//                         )}

//                         {error && typeof error === 'object' && error.message && (
//                             <p style={{ color: 'red', marginTop: '5px', marginBottom: '0' }}>{error.message}</p>
//                         )}

//                         {error && typeof error === 'object' && !error.message && (
//                             <p style={{ color: 'red', marginTop: '5px', marginBottom: '0' }}>An error occurred.</p>
//                         )}
//                     </form>
//                 </ModalBody>
//                 <ModalFooter>
//                     <Button type="submit" color="primary" onClick={handleSubmitForgotPassword} className="mt-2">
//                         Submit
//                     </Button>
//                     <Button color="secondary" onClick={toggle}>
//                         Cancel
//                     </Button>
//                 </ModalFooter>
//             </Modal>
//         </div>
//     );
// }


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
    const { handleLogin } = useAuth();  // Custom hook to get authentication context.
    const [serverError, setServerError] = useState([]); // State for server errors.
    const [modal, setModal] = useState(false); // State for toggling the forgot password modal.
    const [forgotEmail, setForgotEmail] = useState(''); // State for the email input in the forgot password modal.
    const [forgotEmailError, setForgotEmailError] = useState(''); // State for errors related to the forgot email input.

    const toggle = () => {
        formik.resetForm();
        setForgotEmail('');
        setForgotEmailError('');
        setServerError([]);
        setModal(!modal);
    };

    const handleInputChange = (e) => { // Updates the current forgot email state
        setForgotEmail(e.target.value);
    };

    const dispatch = useDispatch();
    const error = useSelector(state => state.forgot.error); // Redux selector for forgot password errors.

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
        validationSchema, // Assuming you have a validation schema
        onSubmit: async (values, { resetForm }) => {
            try {
                let loginData = { password: values.password };

                // Determining which identifier was used (email, username, or phone)
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
                        // Navigate to VerificationProgress page if the officer is unverified
                        navigate('/verification-progress');
                    } else if (err.response.status === 400 && err.response.data.errors) {
                        // Handle other server validation errors
                        setServerError(err.response.data.errors.map(error => error.msg));
                    } else {
                        console.error('Error:', err.message);
                        setServerError(['Something went wrong. Please try again.']);
                    }
                }
            }
        },
    });

    // Handles the submission of the forgot password form. Validates the email using Yup and dispatches the Redux action for starting the forgot password process.
    const handleSubmitForgotPassword = async (e) => {
        e.preventDefault();
        try {
            await forgotPasswordSchema.validate({ forgotEmail });
            setForgotEmailError(''); // Clear previous error
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
        <section className="vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#007bff' }}> {/* Primary color background */}
            <div className="container py-5">
                <div className="row d-flex justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
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
                                        {serverError && <p className="text-danger mt-2 mb-0">{serverError}</p>}
                                        <button className="btn btn-outline-light btn-lg px-4 mt-3" type="submit" disabled={formik.isSubmitting}>
                                            Login
                                        </button>
                                    </form>
                                    <p className="small mt-3 mb-0">
                                        <Link className="text-white-50" onClick={toggle}>Forgot password?</Link>
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-0">Don't have an account? <a href="/register" className="text-white-50 fw-bold">Sign Up</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Forgot Password</ModalHeader>
                <ModalBody>
                    <form className="col-md-8">
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



// import React, { useState } from 'react';
// import { useFormik } from 'formik';
// import { toast } from 'react-toastify';
// import * as Yup from 'yup';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
// import { startForgotPassword, clearForgotError } from '../actions/forgot-action';
// import { useDispatch, useSelector } from 'react-redux';
// import { useAuth } from '../context/AuthContext';

// export default function Login() {
//     const navigate = useNavigate();
//     const { handleLogin } = useAuth();
//     const [forgotEmail, setForgotEmail] = useState('');
//     const [serverError, setServerError] = useState('');
//     const [forgotEmailError, setForgotEmailError] = useState('');
//     const [modal, setModal] = useState(false);
//     const toggle = () => {
//         // Reset form values and errors on modal toggle
//         formik.resetForm();
//         setForgotEmail('');
//         setForgotEmailError('');
//         setServerError('');
//         setModal(!modal);
//     };

//     const handleInputChange = (e) => {
//         setForgotEmail(e.target.value);
//         dispatch(clearForgotError());
//     };

//     const dispatch = useDispatch();
//     const error = useSelector(state => state.forgot.error);

//     const validationSchema = Yup.object({
//         email: Yup.string().email('Invalid email format').required('Email is required'),
//         password: Yup.string()
//             .min(8, 'Password must be at least 8 characters')
//             .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
//             .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
//             .matches(/\d/, 'Password must contain at least one number')
//             .matches(/[@$!%*?&#]/, 'Password must contain at least one special character')
//             .required('Password is required'),
//     });

//     const forgotPasswordSchema = Yup.object({
//         forgotEmail: Yup.string().email('Invalid email format').required('Email is required'),
//     });

//     const formik = useFormik({
//         initialValues: {
//             email: '',
//             password: '',
//         },
//         validationSchema,
//         onSubmit: async (values, { resetForm }) => {
//             try {
//                 const response = await axios.post('http://localhost:5555/api/users/login', values);
//                 console.log(response.data)
//                 localStorage.setItem('token', response.data.token);
//                 const userResponse = await axios.get('http://localhost:5555/api/users/account', {
//                     headers: {
//                         Authorization: localStorage.getItem('token'),
//                     },
//                 });
//                 handleLogin(userResponse.data);
//                 resetForm();
//                 toast.success('Login Success', {
//                     autoClose: 1000,
//                     onClose: () => {
//                         navigate('/');
//                     },
//                 });
//             } catch (err) {
//                 setServerError(err.response.data);
//             }
//         },
//     });

//     const handleSubmitForgotPassword = async (e) => {
//         e.preventDefault();
//         try {
//             await forgotPasswordSchema.validate({ forgotEmail });
//             setForgotEmailError(''); // Clear previous error
//             dispatch(startForgotPassword(forgotEmail, toggle, navigate));
//         } catch (error) {
//             if (error instanceof Yup.ValidationError) {
//                 setForgotEmailError(error.message);
//             } else if (error.response && error.response.status === 404) {
//                 setForgotEmailError(error.response.data.message);
//             } else {
//                 dispatch(startForgotPassword(error));
//             }
//         }
//     };

//     return (
//         <section className="vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#0000FF' }}>
//             <div className="container py-5">
//                 <div className="row d-flex justify-content-center">
//                     <div className="col-12 col-md-8 col-lg-6 col-xl-5">
//                         <div className="card bg-dark text-white" style={{ borderRadius: '1rem' }}>
//                             <div className="card-body p-4 text-center">
//                                 <div className="mb-4 pb-4">
//                                     <h2 className="fw-bold mb-3 text-uppercase">Login</h2>
//                                     <p className="text-white-50 mb-3">Please enter your login and password!</p>
//                                     <form onSubmit={formik.handleSubmit}>
//                                         <div className="mb-3">
//                                             <input
//                                                 type="text"
//                                                 id="email"
//                                                 name="email"
//                                                 onChange={formik.handleChange}
//                                                 onPaste={(e) => e.preventDefault()}
//                                                 value={formik.values.email}
//                                                 className="form-control form-control-lg"
//                                                 placeholder="Email"
//                                             />
//                                             {formik.touched.email && formik.errors.email && (
//                                                 <p className="text-danger mt-1 mb-0">{formik.errors.email}</p>
//                                             )}
//                                         </div>
//                                         <div className="mb-3">
//                                             <input
//                                                 type="password"
//                                                 id="password"
//                                                 name="password"
//                                                 onPaste={(e) => e.preventDefault()}
//                                                 onChange={formik.handleChange}
//                                                 value={formik.values.password}
//                                                 className="form-control form-control-lg"
//                                                 placeholder="Password"
//                                             />
//                                             {formik.touched.password && formik.errors.password && (
//                                                 <p className="text-danger mt-1 mb-0">{formik.errors.password}</p>
//                                             )}
//                                         </div>
//                                         {serverError && <p className="text-danger mt-2 mb-0">{serverError}</p>}
//                                         <button className="btn btn-outline-light btn-lg px-4 mt-3" type="submit" disabled={formik.isSubmitting}>
//                                             Login
//                                         </button>
//                                     </form>
//                                     <p className="small mt-3 mb-0">
//                                         <Link className="text-white-50"  onClick={toggle}>Forgot password?</Link>
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <p className="mb-0">Don't have an account? <a href="/register" className="text-white-50 fw-bold">Sign Up</a></p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <Modal isOpen={modal} toggle={toggle}>
//                 <ModalHeader toggle={toggle}>Forgot Password</ModalHeader>

//                 <ModalBody>
//                     <form className="col-md-8">
//                         <input
//                             className="form-control"
//                             type="text"
//                             placeholder="Enter Email to reset Password"
//                             value={forgotEmail}
//                             onChange={handleInputChange}
//                         />
//                         {forgotEmailError && (
//                             <p className="text-danger mt-2 mb-0">{forgotEmailError}</p>
//                         )}
//                         {error && (
//                             <p className="text-danger mt-2 mb-0">{error}</p>
//                         )}
//                     </form>
//                 </ModalBody>

//                 <ModalFooter>
//                     <Button type="submit" color="primary" onClick={handleSubmitForgotPassword} className="mt-2">
//                         Submit
//                     </Button>
//                     <Button color="secondary" onClick={toggle}>
//                         Cancel
//                     </Button>
//                 </ModalFooter>
                
//             </Modal>
//         </section>
//     );
// }
