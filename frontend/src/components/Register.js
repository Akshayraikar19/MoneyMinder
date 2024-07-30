// import { useState, useEffect } from 'react';
// import axios from '../config/axios';
// import * as Yup from 'yup';
// import { toast } from 'react-toastify';
// import { useNavigate, Link } from 'react-router-dom';


// const Register = () => {
//     const navigate = useNavigate();
//     const [form, setForm] = useState({
//         username: '',
//         email: '',
//         password: '',
//         role: '',
//         phone: '',
//     });
//     const [checkUsername, setCheckUsername] = useState('');
//     const [checkEmail, setCheckEmail] = useState('');
//     const [checkPhone, setCheckPhone] = useState('');
//     const [errors, setErrors] = useState({});
//     const [adminExists, setAdminExists] = useState(false);

//     useEffect(() => {
//         handleAdminExists();  //It calls handleAdminExists to check if an admin already exists.
//     }, []);  //This effect runs once when the component mounts.

//     const handleAdminExists = async () => {
//         try {
//             const response = await axios.get('/check-admin');
//             console.log('Admin exists:', response.data.adminExists);
//             setAdminExists(response.data.adminExists);
//             if (!response.data.adminExists) {
//                 setForm(prevForm => ({ ...prevForm, role: 'admin' }));  //If no admin exists, it sets the role in the form to admin.
//             }
//         } catch (err) {
//             console.error('Error checking admin existence:', err);
//         }
//     };

//     const checkUsernameExists = async (e) => {
//         const username =e.target.value;
//         try{
//             const response = await axios.get(`/users/checkusername?username=${username}`);
//             setCheckUsername(response.data.exists ? 'Username already exists' : '');
//         } catch(error) {
//             console.error('Error checking username:', error)
//         }
//     };

//     const checkEmailExists = async (e) => {
//         const email = e.target.value;
//         try {
//             const response = await axios.get(`/users/checkemail?email=${email}`);  //checkEmail state based on the response.
//             setCheckEmail(response.data.exists ? 'Email already exists' : '');
//         } catch (error) {
//             console.error('Error checking email:', error);
//         }
//     };

//     const checkPhoneExists = async (e) => {
//         const phone = e.target.value;
//         try{
//             const response = await axios.get(`/users/checkphone?phone=${phone}`);
//             setCheckPhone(response.data.exists ? 'PhoneNumber already exists' : '');
//         } catch(error) {
//             console.error('Error checking phone:', error)
//         }
//     }

//     const validationSchema = Yup.object({
//         username: Yup.string().required('Username is required'),
//         email: Yup.string().email('Invalid email format').required('Email is required'),
//         password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
//         phone: Yup.string().required('Phone number is required').min(10, 'Phone number must be 10 digits'),
//         role: Yup.string().required('Role is required'),
//     });

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await validationSchema.validate(form, { abortEarly: false });
//             setErrors({});
//             const response = await axios.post('/users/register', form, {
//                 headers: { 'Content-Type': 'application/json' },
//             });
//             console.log(response.data);
//             toast.success('Registration Successful', {
//                 autoClose: 1000,
//                 onClose: () => {
//                     navigate('/login');
//                 },
//             });
//             setForm({
//                 username: '',
//                 email: '',
//                 password: '',
//                 role: '',
//                 phone: '',
//             });
//         } catch (err) {
//             if (err.response && err.response.data.errors) {
//                 // Server-side validation errors
//                 const serverErrors = {};
//                 err.response.data.errors.forEach(error => {
//                     serverErrors[error.param] = error.msg;
//                 });
//                 setErrors(serverErrors);
//             } else if (err instanceof Yup.ValidationError) {  //Handles validation errors (both server-side and Yup).
//                 // Yup validation errors
//                 const validationErrors = {};
//                 err.inner.forEach(error => {
//                     validationErrors[error.path] = error.message;
//                 });
//                 setErrors(validationErrors);
//             } else {
//                 console.error('Unexpected error:', err);
//             }
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setForm(prevForm => ({ ...prevForm, [name]: value }));
//         setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
//     };

//     return (
//         <div className="col-md-6 offset-md-3">
//             <h3>Register</h3>
//             <form onSubmit={handleSubmit}>
//                 <label htmlFor="username"><strong>Username:</strong></label>
//                 <input
//                     className="form-control"
//                     type="text"
//                     id="username"
//                     name="username"
//                     value={form.username}
//                     onChange={handleChange}
//                     onBlur={checkUsernameExists}
//                 />
//                 {checkUsername && <p style={{ color: 'red', margin: 0}}> {checkUsername}</p>}
//                 {errors.username && <p style={{ color: 'red', margin: 0 }}>{errors.username}</p>}

//                 <label htmlFor="email"><strong>Email:</strong></label>
//                 <input
//                     className="form-control"
//                     type="email"
//                     id="email"
//                     name="email"
//                     value={form.email}
//                     onChange={handleChange}
//                     onBlur={checkEmailExists}
//                 />
//                 {checkEmail && <p style={{ color: 'red', margin: 0 }}>{checkEmail}</p>}
//                 {errors.email && <p style={{ color: 'red', margin: 0 }}>{errors.email}</p>}

//                 <label htmlFor="password"><strong>Password:</strong></label>
//                 <input
//                     className="form-control"
//                     type="password"
//                     id="password"
//                     name="password"
//                     value={form.password}
//                     onChange={handleChange}
//                 />
//                 {errors.password && <p style={{ color: 'red', margin: 0 }}>{errors.password}</p>}

//                 <label htmlFor="phone"><strong>Phone:</strong></label>
//                 <input
//                     className="form-control"
//                     type="text"
//                     id="phone"
//                     name="phone"
//                     value={form.phone}
//                     onChange={handleChange}
//                     onBlur={checkPhoneExists}
//                 />
//                 {checkPhone && <p style={{ color: 'red', margin: 0}}> {checkPhone}</p>}
//                 {errors.phone && <p style={{ color: 'red', margin: 0 }}>{errors.phone}</p>}

//                 <label htmlFor="role"><strong>Role:</strong></label>
//                 <select
//                     className="form-control"
//                     id="role"
//                     name="role"
//                     value={form.role}
//                     onChange={handleChange}
//                     disabled={!adminExists && form.role === 'admin'}
//                 >
//                     <option value="">Select Role</option>
//                     <option value="customer">Customer</option>
//                     <option value="officer">Officer</option>
//                     {!adminExists && <option value="admin">Admin</option>}
//                 </select>
//                 {errors.role && <p style={{ color: 'red', margin: 0 }}>{errors.role}</p>}

//                 <button className="btn btn-primary mt-3" type="submit">Register</button>
//             </form>
//             <Link to="/login">Already have an account?</Link>

//             {/* <img src={image} alt="register" style={{ width: '600px', height: '400px', marginLeft: '200px' }} /> */}
//         </div>
//     );
// };

// export default Register;


// import { useState, useEffect } from 'react';
// import axios from '../config/axios';
// import * as Yup from 'yup';
// import { toast } from 'react-toastify';
// import { useNavigate, Link } from 'react-router-dom';
// import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const Register = () => {
//     const navigate = useNavigate();
//     const [form, setForm] = useState({
//         username: '',
//         email: '',
//         password: '',
//         role: '',
//         phone: '',
//     });
//     const [checkUsername, setCheckUsername] = useState('');
//     const [checkEmail, setCheckEmail] = useState('');
//     const [checkPhone, setCheckPhone] = useState('');
//     const [errors, setErrors] = useState({});
//     const [adminExists, setAdminExists] = useState(false);

//     useEffect(() => {
//         handleAdminExists();
//     }, []);

//     const handleAdminExists = async () => {
//         try {
//             const response = await axios.get('/check-admin');
//             console.log('Admin exists:', response.data.adminExists);
//             setAdminExists(response.data.adminExists);
//             if (!response.data.adminExists) {
//                 setForm(prevForm => ({ ...prevForm, role: 'admin' }));
//             }
//         } catch (err) {
//             console.error('Error checking admin existence:', err);
//         }
//     };

//     const checkUsernameExists = async (e) => {
//         const username = e.target.value;
//         try {
//             const response = await axios.get(`/users/checkusername?username=${username}`);
//             setCheckUsername(response.data.exists ? 'Username already exists' : '');
//         } catch (error) {
//             console.error('Error checking username:', error);
//         }
//     };

//     const checkEmailExists = async (e) => {
//         const email = e.target.value;
//         try {
//             const response = await axios.get(`/users/checkemail?email=${email}`);
//             setCheckEmail(response.data.exists ? 'Email already exists' : '');
//         } catch (error) {
//             console.error('Error checking email:', error);
//         }
//     };

//     const checkPhoneExists = async (e) => {
//         const phone = e.target.value;
//         try {
//             const response = await axios.get(`/users/checkphone?phone=${phone}`);
//             setCheckPhone(response.data.exists ? 'Phone number already exists' : '');
//         } catch (error) {
//             console.error('Error checking phone:', error);
//         }
//     };

//     const validationSchema = Yup.object({
//         username: Yup.string().required('Username is required'),
//         email: Yup.string().email('Invalid email format').required('Email is required'),
//         password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
//         phone: Yup.string().required('Phone number is required').min(10, 'Phone number must be 10 digits'),
//         role: Yup.string().required('Role is required'),
//     });

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await validationSchema.validate(form, { abortEarly: false });
//             setErrors({});
//             const response = await axios.post('/users/register', form, {
//                 headers: { 'Content-Type': 'application/json' },
//             });
//             toast.success('Registration Successful', {
//                 autoClose: 1000,
//                 onClose: () => {
//                     navigate('/login');
//                 },
//             });
//             setForm({
//                 username: '',
//                 email: '',
//                 password: '',
//                 role: '',
//                 phone: '',
//             });
//         } catch (err) {
//             if (err.response && err.response.data.errors) {
//                 const serverErrors = {};
//                 err.response.data.errors.forEach(error => {
//                     serverErrors[error.param] = error.msg;
//                 });
//                 setErrors(serverErrors);
//             } else if (err instanceof Yup.ValidationError) {
//                 const validationErrors = {};
//                 err.inner.forEach(error => {
//                     validationErrors[error.path] = error.message;
//                 });
//                 setErrors(validationErrors);
//             } else {
//                 console.error('Unexpected error:', err);
//             }
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setForm(prevForm => ({ ...prevForm, [name]: value }));
//         setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
//     };

//     return (
//         <div style={{
//             backgroundImage: 'url(https://mrwallpaper.com/images/high/finance-digital-blue-graph-3rpv84d278m83dx1.webp)', // Replace with your image URL
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             minHeight: '100vh',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             padding: '20px'
//         }}>
//             <div style={{
//                 backgroundColor: 'rgba(0, 0, 0, 0.5)',
//                 padding: '30px',
//                 borderRadius: '8px',
//                 width: '100%',
//                 maxWidth: '500px',
//                 color: 'white',
//             }}>
//                 <Container>
//                     <Row className="justify-content-center">
//                         <Col md={12}>
//                             <h3 className="text-center mb-4">Register</h3>
//                             <Form onSubmit={handleSubmit}>
//                                 <FormGroup>
//                                     <Label for="username">Username:</Label>
//                                     <Input
//                                         type="text"
//                                         id="username"
//                                         name="username"
//                                         value={form.username}
//                                         onChange={handleChange}
//                                         onBlur={checkUsernameExists}
//                                     />
//                                     {checkUsername && <Alert color="danger">{checkUsername}</Alert>}
//                                     {errors.username && <Alert color="danger">{errors.username}</Alert>}
//                                 </FormGroup>

//                                 <FormGroup>
//                                     <Label for="email">Email:</Label>
//                                     <Input
//                                         type="email"
//                                         id="email"
//                                         name="email"
//                                         value={form.email}
//                                         onChange={handleChange}
//                                         onBlur={checkEmailExists}
//                                     />
//                                     {checkEmail && <Alert color="danger">{checkEmail}</Alert>}
//                                     {errors.email && <Alert color="danger">{errors.email}</Alert>}
//                                 </FormGroup>

//                                 <FormGroup>
//                                     <Label for="password">Password:</Label>
//                                     <Input
//                                         type="password"
//                                         id="password"
//                                         name="password"
//                                         value={form.password}
//                                         onChange={handleChange}
//                                     />
//                                     {errors.password && <Alert color="danger">{errors.password}</Alert>}
//                                 </FormGroup>

//                                 <FormGroup>
//                                     <Label for="phone">Phone:</Label>
//                                     <Input
//                                         type="text"
//                                         id="phone"
//                                         name="phone"
//                                         value={form.phone}
//                                         onChange={handleChange}
//                                         onBlur={checkPhoneExists}
//                                     />
//                                     {checkPhone && <Alert color="danger">{checkPhone}</Alert>}
//                                     {errors.phone && <Alert color="danger">{errors.phone}</Alert>}
//                                 </FormGroup>

//                                 <FormGroup>
//                                     <Label for="role">Role:</Label>
//                                     <Input
//                                         type="select"
//                                         id="role"
//                                         name="role"
//                                         value={form.role}
//                                         onChange={handleChange}
//                                         disabled={!adminExists && form.role === 'admin'}
//                                     >
//                                         <option value="">Select Role</option>
//                                         <option value="customer">Customer</option>
//                                         <option value="officer">Officer</option>
//                                         {!adminExists && <option value="admin">Admin</option>}
//                                     </Input>
//                                     {errors.role && <Alert color="danger">{errors.role}</Alert>}
//                                 </FormGroup>

//                                 <Button color="primary" type="submit" className="w-100">Register</Button>
//                             </Form>
//                             <div className="mt-3 text-center">
//                                 <Link to="/login" style={{ color: 'white' }}>Already have an account?</Link>
//                             </div>
//                         </Col>
//                     </Row>
//                 </Container>
//             </div>
//         </div>
//     );
// };

// export default Register;


import { useState, useEffect } from 'react';
import axios from '../config/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
    const navigate = useNavigate();
    const [checkUsername, setCheckUsername] = useState('');
    const [checkEmail, setCheckEmail] = useState('');
    const [checkPhone, setCheckPhone] = useState('');
    const [adminExists, setAdminExists] = useState(false);

    useEffect(() => {
        handleAdminExists();
    }, []);

    const handleAdminExists = async () => {
        try {
            const response = await axios.get('/check-admin');
            console.log('Admin exists:', response.data.adminExists);
            setAdminExists(response.data.adminExists);
        } catch (err) {
            console.error('Error checking admin existence:', err);
        }
    };

    const checkUsernameExists = async (username) => {
        try {
            const response = await axios.get(`/users/checkusername?username=${username}`);
            setCheckUsername(response.data.exists ? 'Username already exists' : '');
        } catch (error) {
            console.error('Error checking username:', error);
        }
    };

    const checkEmailExists = async (email) => {
        try {
            const response = await axios.get(`/users/checkemail?email=${email}`);
            setCheckEmail(response.data.exists ? 'Email already exists' : '');
        } catch (error) {
            console.error('Error checking email:', error);
        }
    };

    const checkPhoneExists = async (phone) => {
        try {
            const response = await axios.get(`/users/checkphone?phone=${phone}`);
            setCheckPhone(response.data.exists ? 'Phone number already exists' : '');
        } catch (error) {
            console.error('Error checking phone:', error);
        }
    };

    const validationSchema = Yup.object({
        username: Yup.string().required('Username is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        phone: Yup.string().required('Phone number is required').min(10, 'Phone number must be 10 digits'),
        role: Yup.string().required('Role is required'),
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            phone: '',
            role: adminExists ? 'admin' : 'customer', // Set default role based on admin existence
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await axios.post('/users/register', values, {
                    headers: { 'Content-Type': 'application/json' },
                });
                toast.success('Registration Successful', {
                    autoClose: 1000,
                    onClose: () => {
                        navigate('/login');
                    },
                });
                formik.resetForm();
            } catch (err) {
                if (err.response && err.response.data.errors) {
                    const serverErrors = {};
                    err.response.data.errors.forEach(error => {
                        serverErrors[error.param] = error.msg;
                    });
                    formik.setErrors(serverErrors);
                } else {
                    console.error('Unexpected error:', err);
                }
            }
        },
    });

    return (
        <section className="vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#007bff' }}>
            <div className="container py-5">
                <div className="row d-flex justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="card bg-dark text-white" style={{ borderRadius: '1rem' }}>
                            <div className="card-body p-4 text-center">
                                <div className="mb-4 pb-4">
                                    <h2 className="fw-bold mb-3 text-uppercase">Register</h2>
                                    <p className="text-white-50 mb-3">Please fill in your details to register!</p>
                                    <Form onSubmit={formik.handleSubmit}>
                                        <FormGroup>
                                            <Label for="username">Username:</Label>
                                            <Input
                                                type="text"
                                                id="username"
                                                name="username"
                                                value={formik.values.username}
                                                onChange={formik.handleChange}
                                                onBlur={() => checkUsernameExists(formik.values.username)}
                                            />
                                            {checkUsername && <Alert color="danger">{checkUsername}</Alert>}
                                            {formik.errors.username && formik.touched.username && (
                                                <Alert color="danger">{formik.errors.username}</Alert>
                                            )}
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="email">Email:</Label>
                                            <Input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                onBlur={() => checkEmailExists(formik.values.email)}
                                            />
                                            {checkEmail && <Alert color="danger">{checkEmail}</Alert>}
                                            {formik.errors.email && formik.touched.email && (
                                                <Alert color="danger">{formik.errors.email}</Alert>
                                            )}
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="password">Password:</Label>
                                            <Input
                                                type="password"
                                                id="password"
                                                name="password"
                                                value={formik.values.password}
                                                onChange={formik.handleChange}
                                            />
                                            {formik.errors.password && formik.touched.password && (
                                                <Alert color="danger">{formik.errors.password}</Alert>
                                            )}
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="phone">Phone:</Label>
                                            <Input
                                                type="text"
                                                id="phone"
                                                name="phone"
                                                value={formik.values.phone}
                                                onChange={formik.handleChange}
                                                onBlur={() => checkPhoneExists(formik.values.phone)}
                                            />
                                            {checkPhone && <Alert color="danger">{checkPhone}</Alert>}
                                            {formik.errors.phone && formik.touched.phone && (
                                                <Alert color="danger">{formik.errors.phone}</Alert>
                                            )}
                                        </FormGroup>

                                        <FormGroup>
                                            <Label for="role">Role:</Label>
                                            <Input
                                                type="select"
                                                id="role"
                                                name="role"
                                                value={formik.values.role}
                                                onChange={formik.handleChange}
                                                disabled={!adminExists && formik.values.role === 'admin'}
                                            >
                                                <option value="">Select Role</option>
                                                <option value="customer">Customer</option>
                                                <option value="officer">Officer</option>
                                                {!adminExists && <option value="admin">Admin</option>}
                                            </Input>
                                            {formik.errors.role && formik.touched.role && (
                                                <Alert color="danger">{formik.errors.role}</Alert>
                                            )}
                                        </FormGroup>

                                        <Button color="outline-light" type="submit" className="btn btn-lg px-4 mt-3" disabled={formik.isSubmitting}>
                                            Register
                                        </Button>
                                    </Form>
                                    <p className="small mt-3 mb-0">
                                        <Link to="/login" className="text-white-50">Already have an account?</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;
