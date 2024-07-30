// import { useState, useEffect } from "react"
// import axios from "../../config/axios"
// import { useParams } from "react-router-dom"
// import {toast} from "react-toastify"


// export default function VerifyOfflinePayment() {

//     return(
//         <div>

//         </div>
//     )}


// import { useState, useEffect } from "react";
// import axios from "../../config/axios";
// import { toast } from "react-toastify";
// import { useParams } from "react-router-dom";
// import { format } from 'date-fns';
// import { Container, Row, Col, Button, Alert } from 'reactstrap';

// export default function VerifyOfflinePayment() {
//     const { applicationId } = useParams();
//     const [application, setApplication] = useState({});
//     const [payment, setPayment] = useState({});
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         const fetchApplicationDetails = async () => {
//             try {
//                 const response = await axios.get(`/admin/OfflinePayments/${applicationId}`, {
//                     headers: {
//                         Authorization: localStorage.getItem('token')
//                     },
//                 });
//                 setApplication(response.data);
//                 setPayment(response.data);
//             } catch (error) {
//                 toast.error('Failed to fetch application details');
//             }
//         };
//         fetchApplicationDetails();
//     }, [applicationId]);

//     const handleVerification = async () => {
//         setLoading(true);
//         if (!payment || !payment._id) {
//             toast.error('No payment data available to verify');
//             setLoading(false);
//             return;
//         }
    
//         try {
//             const response = await axios.put(`/payments/verify/${applicationId}`, {}, {
//                 headers: {
//                     Authorization: localStorage.getItem('token')
//                 },
//             });

//             if (response.data.error) {
//                 toast.error(response.data.error);
//             } else {
//                 toast.success('Payment verified successfully');
//             }
//         } catch (error) {
//             toast.error('Failed to verify payment');
//             console.error('Verification Error:', error.response.data); // Log server response
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     return (
//         <Container className="my-5">
//             <h1 className="text-center mb-4">Verify Payment</h1>
//             <Row className="justify-content-center">
//                 <Col md="8">
//                     {!payment._id ? (
//                         <Alert color="warning" className="text-center">
//                             No payment record found for this application.
//                         </Alert>
//                     ) : (
//                         <div className="text-center">
//                             <h4>EMI Amount: {payment.amount}</h4>
//                             <h4>Payment Date: {payment.paymentDate ? format(new Date(payment.paymentDate), 'dd/MM/yyyy') : 'N/A'}</h4>
//                             {payment.verifiedByAdmin ? (
//                                 <Alert color="success" className="mt-4">
//                                     Payment already verified
//                                 </Alert>
//                             ) : (
//                                 <Button
//                                     color="primary"
//                                     className="mt-4"
//                                     onClick={handleVerification}
//                                     disabled={loading}
//                                 >
//                                     {loading ? 'Verifying...' : 'Verify Payment'}
//                                 </Button>
//                             )}
//                         </div>
//                     )}
//                 </Col>
//             </Row>
//         </Container>
//     );
// }


import { useState, useEffect } from "react";
import axios from "../../config/axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { format } from 'date-fns';
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import { useNavigate } from "react-router-dom";

export default function VerifyOfflinePayment() {
    const navigate = useNavigate()
    const { applicationId } = useParams();
    const [application, setApplication] = useState({});
    const [payment, setPayment] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchApplicationDetails = async () => {
            try {
                const response = await axios.get(`/admin/OfflinePayments/${applicationId}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    },
                });
                setApplication(response.data);
                setPayment(response.data); // Ensure payment data is correctly set
            } catch (error) {
                toast.error('Failed to fetch application details');
            }
        };
        fetchApplicationDetails();
    }, [applicationId]);

    const handleVerification = async () => {
        setLoading(true);

        // Check if payment data is available
        if (!payment || !payment._id) {
            toast.error('No payment data available to verify');
            setLoading(false);
            return;
        }
    
        try {
            // Send verification request
            const response = await axios.put(`/payments/verify/${applicationId}`, {}, {
                headers: {
                    Authorization: localStorage.getItem('token')
                },
            });

            if (response.data.error) {
                toast.error(response.data.error);
            } else {
                // Update local payment state to reflect the verification status
                setPayment(prevPayment => ({ ...prevPayment, verifiedByAdmin: true }));
                toast.success('Payment verified successfully');
                navigate('approved-applications')
            }
        } catch (error) {
            toast.error('Failed to verify payment');
            console.error('Verification Error:', error.response ? error.response.data : error.message); // Log server response
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Container className="my-5">
            <h1 className="text-center mb-4">Verify Payment</h1>
            <Row className="justify-content-center">
                <Col md="8">
                    {!payment._id ? (
                        <Alert color="warning" className="text-center">
                            No payment record found for this application.
                        </Alert>
                    ) : (
                        <div className="text-center">
                            <h4>EMI Amount: {payment.amount}</h4>
                            <h4>Payment Date: {payment.paymentDate ? format(new Date(payment.paymentDate), 'dd/MM/yyyy') : 'N/A'}</h4>
                            {payment.verifiedByAdmin ? (
                                <Alert color="success" className="mt-4">
                                    Payment already verified
                                </Alert>
                            ) : (
                                <Button
                                    color="primary"
                                    className="mt-4"
                                    onClick={handleVerification}
                                    disabled={loading}
                                >
                                    {loading ? 'Verifying...' : 'Verify Payment'}
                                </Button>
                            )}
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
}
