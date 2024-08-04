import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { format, parse } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const CustomerProfile = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        address: '',
        pincode: '',
        aadhaarNumber: '',
        panNumber: '',
        profilePic: null,
        aadhaarPhoto: null,
        panPhoto: null,
    });

    const [profileData, setProfileData] = useState(null);
    const [errors, setErrors] = useState({});
    const [serverErrors, setServerErrors] = useState({});
    const [isProfileCreated, setIsProfileCreated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProfileDetails = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('/api/customers/profile', {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                const data = response.data;

                if (data) {
                    setProfileData(data);
                    setForm({
                        firstName: data.firstName || '',
                        lastName: data.lastName || '',
                        dateOfBirth: data.dateOfBirth ? format(new Date(data.dateOfBirth), 'yyyy-MM-dd') : '',
                        address: data.address || '',
                        pincode: data.pincode || '',
                        aadhaarNumber: data.aadhaarNumber || '',
                        panNumber: data.panNumber || '',
                        profilePic: null,
                        aadhaarPhoto: null,
                        panPhoto: null,
                    });

                    setIsProfileCreated(true);
                } else {
                    setIsProfileCreated(false);
                    setForm({
                        firstName: '',
                        lastName: '',
                        dateOfBirth: '',
                        address: '',
                        pincode: '',
                        aadhaarNumber: '',
                        panNumber: '',
                        profilePic: null,
                        aadhaarPhoto: null,
                        panPhoto: null,
                    });
                }
            } catch (error) {
                console.error('Error fetching profile details:', error);
                setIsProfileCreated(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileDetails();
    }, []);

    // Validation schema
    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        dateOfBirth: Yup.string().required('Date of Birth is required'),
        address: Yup.string().required('Address is required'),
        pincode: Yup.string()
            .required('Pincode is required')
            .matches(/^[1-9][0-9]{5}$/, 'Invalid pin code. Please enter a valid 6-digit pin code'),
        aadhaarNumber: Yup.string().required('Aadhaar Number is required'),
        panNumber: Yup.string().required('PAN Number is required'),
        profilePic: Yup.mixed()
            .required('Profile Picture is required')
            .test('fileType', 'Image must be jpeg or png', value =>
                !value || ['image/jpeg', 'image/png'].includes(value.type)
            ),
        aadhaarPhoto: Yup.mixed()
            .required('Aadhaar Photo is required')
            .test('fileType', 'Image must be jpeg or png', value =>
                !value || ['image/jpeg', 'image/png'].includes(value.type)
            ),
        panPhoto: Yup.mixed()
            .required('PAN Photo is required')
            .test('fileType', 'Image must be jpeg or png', value =>
                !value || ['image/jpeg', 'image/png'].includes(value.type)
            ),
    });
    

    // Define Cloudinary configuration
    const cloudName = 'dwyh3ou3x'; // Use your cloud name here
    const uploadPreset = 'Loan App'; // Ensure this matches your unsigned preset name

    // Upload to Cloudinary
    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        try {
            const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
            return response.data.secure_url;
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw new Error('Error uploading image');
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Validate form data
            await validationSchema.validate(form, { abortEarly: false });

            setIsLoading(true);

            const formData = new FormData();
            formData.append('firstName', form.firstName);
            formData.append('lastName', form.lastName);
            formData.append('dateOfBirth', parse(form.dateOfBirth, 'yyyy-MM-dd', new Date()).toISOString());
            formData.append('address', form.address);
            formData.append('pincode', form.pincode);
            formData.append('aadhaarNumber', form.aadhaarNumber);
            formData.append('panNumber', form.panNumber);

            if (form.profilePic) formData.append('profilePic', form.profilePic);
            if (form.aadhaarPhoto) formData.append('aadhaarPhoto', form.aadhaarPhoto);
            if (form.panPhoto) formData.append('panPhoto', form.panPhoto);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: localStorage.getItem('token')
                }
            };

            const url = isProfileCreated ? '/api/customers/profile' : '/api/customers/profile';
            const method = isProfileCreated ? 'put' : 'post';

            const response = await axios[method](url, formData, config);

            setProfileData(response.data);
            toast.success('Profile saved successfully');
            navigate('/account')
        } catch (error) {
            if (error.response) {
                // Detailed error handling
                console.error('Error response:', error.response.data);
                setServerErrors(error.response.data.errors || { _error: 'Failed to save profile' });
            } else if (error.inner) {
                // Handle Yup validation errors
                const formErrors = {};
                error.inner.forEach(err => {
                    formErrors[err.path] = err.message;
                });
                setErrors(formErrors);
            } else {
                console.error('Error saving profile:', error.message);
                setServerErrors({ _error: 'Failed to save profile' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setForm({
            ...form,
            [name]: files[0]
        });
    };

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6">
                    <h4 className="text-center">{isProfileCreated ? "Edit Profile" : "Create Profile"}</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="firstName"><strong>First Name:</strong></label>
                            <input
                                type="text"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleInputChange}
                                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName"><strong>Last Name:</strong></label>
                            <input
                                type="text"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleInputChange}
                                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="dateOfBirth"><strong>Date of Birth:</strong></label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={form.dateOfBirth}
                                onChange={handleInputChange}
                                className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="address"><strong>Address:</strong></label>
                            <input
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={handleInputChange}
                                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="pincode"><strong>Pincode:</strong></label>
                            <input
                                type="text"
                                name="pincode"
                                value={form.pincode}
                                onChange={handleInputChange}
                                className={`form-control ${errors.pincode ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.pincode && <div className="invalid-feedback">{errors.pincode}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="aadhaarNumber"><strong>Aadhaar Number:</strong></label>
                            <input
                                type="text"
                                name="aadhaarNumber"
                                value={form.aadhaarNumber}
                                onChange={handleInputChange}
                                className={`form-control ${errors.aadhaarNumber ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.aadhaarNumber && <div className="invalid-feedback">{errors.aadhaarNumber}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="panNumber"><strong>PAN Number:</strong></label>
                            <input
                                type="text"
                                name="panNumber"
                                value={form.panNumber}
                                onChange={handleInputChange}
                                className={`form-control ${errors.panNumber ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.panNumber && <div className="invalid-feedback">{errors.panNumber}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="profilePic"><strong>Profile Picture:</strong></label> <br/>
                            <input
                                type="file"
                                name="profilePic"
                                onChange={handleFileChange}
                                className={`form-control-file ${errors.profilePic ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.profilePic && <div className="invalid-feedback">{errors.profilePic}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="aadhaarPhoto"><strong>Aadhaar Photo:</strong></label> <br/>
                            <input
                                type="file"
                                name="aadhaarPhoto"
                                onChange={handleFileChange}
                                className={`form-control-file ${errors.aadhaarPhoto ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.aadhaarPhoto && <div className="invalid-feedback">{errors.aadhaarPhoto}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="panPhoto"><strong>PAN Photo:</strong></label> <br/>
                            <input
                                type="file"
                                name="panPhoto"
                                onChange={handleFileChange}
                                className={`form-control-file ${errors.panPhoto ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.panPhoto && <div className="invalid-feedback">{errors.panPhoto}</div>}
                        </div>
                        {serverErrors._error && <div className="alert alert-danger">{serverErrors._error}</div>}
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isProfileCreated ? 'Update Profile' : 'Create Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;
