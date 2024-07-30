import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const OfficerProfile = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        department: '',
        branchLocation: '',
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
                const response = await axios.get('/api/officers/profile', {
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
                        department: data.department || '',
                        branchLocation: data.branchLocation || '',
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
                        department: '',
                        branchLocation: '',
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
        department: Yup.string().required('Department is required'),
        branchLocation: Yup.string().required('Branch Location is required'),
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
            formData.append('department', form.department);
            formData.append('branchLocation', form.branchLocation);
            if (form.profilePic) formData.append('profilePic', form.profilePic);
            if (form.aadhaarPhoto) formData.append('aadhaarPhoto', form.aadhaarPhoto);
            if (form.panPhoto) formData.append('panPhoto', form.panPhoto);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: localStorage.getItem('token')
                }
            };

            const url = isProfileCreated ? '/api/officers/profile' : '/api/officers/profile';
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
                            <label htmlFor="department"><strong>Department:</strong></label>
                            <input
                                type="text"
                                name="department"
                                value={form.department}
                                onChange={handleInputChange}
                                className={`form-control ${errors.department ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.department && <div className="invalid-feedback">{errors.department}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="branchLocation"><strong>Branch Location:</strong></label>
                            <input
                                type="text"
                                name="branchLocation"
                                value={form.branchLocation}
                                onChange={handleInputChange}
                                className={`form-control ${errors.branchLocation ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.branchLocation && <div className="invalid-feedback">{errors.branchLocation}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="profilePic"><strong>Profile Picture:</strong></label>
                            <input
                                type="file"
                                name="profilePic"
                                onChange={handleFileChange}
                                className={`form-control ${errors.profilePic ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.profilePic && <div className="invalid-feedback">{errors.profilePic}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="aadhaarPhoto"><strong>Aadhaar Photo:</strong></label>
                            <input
                                type="file"
                                name="aadhaarPhoto"
                                onChange={handleFileChange}
                                className={`form-control ${errors.aadhaarPhoto ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.aadhaarPhoto && <div className="invalid-feedback">{errors.aadhaarPhoto}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="panPhoto"><strong>PAN Photo:</strong></label>
                            <input
                                type="file"
                                name="panPhoto"
                                onChange={handleFileChange}
                                className={`form-control ${errors.panPhoto ? 'is-invalid' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.panPhoto && <div className="invalid-feedback">{errors.panPhoto}</div>}
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                        {serverErrors._error && <div className="mt-3 alert alert-danger">{serverErrors._error}</div>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OfficerProfile;
