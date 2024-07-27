import React, { useState } from 'react';
import axios from '../../config/axios'; // Make sure this points to your configured Axios instance
import { toast } from 'react-toastify';
import { Button, Card, CardBody, CardTitle, Spinner } from 'reactstrap';

const PaymentComponent = ({ applicationId, emi }) => {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            if (isNaN(emi) || emi <= 0) {
                throw new Error('Invalid EMI amount');
            }

            const emiInCents = Math.round(emi); // Convert to cents

            const response = await axios.post('/payments/pay/online', { // invoice creation, checkout page
                applicationId,
                amount: emiInCents
            }, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });

            if (response.data && response.data.url) {
                //store the transaction Id in loacalstorage
                localStorage.setItem('stripeSessionId', response.data.id);

                //Redirecting user to checkout page of stripe
                window.location.href = response.data.url;
            } else {
                console.error('Unexpected response from payment API:', response);
                toast.error('Unexpected response from payment API');
            }
        } catch (error) {
            console.error('Error initiating payment:', error);
            toast.error(error.response?.data?.error || 'Error initiating payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="text-center mt-4" style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <CardBody>
                <CardTitle tag="h5" className="mb-3">Pay Your EMI</CardTitle>
                <p className="mb-4" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Amount: ₹{emi}</p>
                <Button
                    color="primary"
                    onClick={handlePayment}
                    disabled={loading}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '5px',
                        transition: 'background-color 0.3s ease',
                        backgroundColor: '#007bff',
                        border: 'none'
                    }}
                >
                    {loading ? <Spinner size="sm" /> : 'Pay Now'}
                </Button>
            </CardBody>
        </Card>
    );
};

export default PaymentComponent;
