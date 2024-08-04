import { useState, useEffect } from 'react';
import axios from '../config/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';


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
            <Container className="py-5">
                <Row className="d-flex justify-content-center">
                    <Col xs={12} sm={10} md={8} lg={6} xl={5}>
                        <div className="card bg-dark text-white" style={{ borderRadius: '1rem' }}>
                            <div className="card-body p-4">
                                <h2 className="fw-bold mb-3 text-uppercase text-center">Register</h2>
                                <p className="text-white-50 mb-3 text-center">Please fill in your details to register!</p>
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
                                            invalid={!!checkUsername || (formik.errors.username && formik.touched.username)}
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
                                            invalid={!!checkEmail || (formik.errors.email && formik.touched.email)}
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
                                            invalid={formik.errors.password && formik.touched.password}
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
                                            invalid={!!checkPhone || (formik.errors.phone && formik.touched.phone)}
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

                                    <div className="d-flex justify-content-center">
                                        <Button color="outline-light" type="submit" className="btn btn-lg px-4 mt-3" disabled={formik.isSubmitting}>
                                            Register
                                        </Button>
                                    </div>
                                </Form>
                                <p className="small mt-3 mb-0 text-center">
                                    <Link to="/login" className="text-white-50">Already have an account?</Link>
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Register;
