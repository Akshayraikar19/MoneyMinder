import { useState, useEffect } from 'react';
import axios from '../config/axios';

const useCustomerProfile = () => {
    const [customerProfile, setCustomerProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomerProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/customers/profile', {
                    headers: {
                        Authorization: token,
                    },
                });
                setCustomerProfile(response.data); // Assuming response.data is the customer profile object
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerProfile();
    }, []);

    return { customerProfile, loading, error };
};

export default useCustomerProfile;
