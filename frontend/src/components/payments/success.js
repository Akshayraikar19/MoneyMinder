import axios from '../../config/axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Alert } from 'reactstrap';
import { CheckCircle } from 'react-feather'; // Add react-feather for a success icon

export default function Success() {
    const navigate = useNavigate();
    const stripeSessionId = localStorage.getItem('stripeSessionId');

    useEffect(() => {
        (async () => {
            if (!stripeSessionId) {
                console.error('Stripe session ID not found in local storage');
                toast.error('Stripe session ID not found');
                navigate('/error');
                return;
            }

            try {
                const response = await axios.put(`/api/payment/status/update/${stripeSessionId}`);
                console.log('Response from Stripe PUT request:', response.data);
                toast.success('Payment status updated successfully');
            } catch (err) {
                console.error('Error updating payment status:', err.response || err.message);
                toast.error(err.response?.data?.error || 'Error updating payment status');
                navigate('/error');
            }
        })();
    }, [stripeSessionId, navigate]);

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md="8" lg="6">
                    <Card body className="text-center">
                        <CardBody>
                            <CheckCircle size={50} color="green" className="mb-3" />
                            <CardTitle tag="h3">Payment Successful</CardTitle>
                            <CardText>
                                Your payment has been processed successfully. Thank you for your payment!
                            </CardText>
                            <Alert color="success">
                                <strong>Success!</strong> Your payment was completed successfully.
                            </Alert>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

