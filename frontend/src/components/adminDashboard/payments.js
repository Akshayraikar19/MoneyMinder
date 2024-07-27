// import React, { useEffect, useState } from "react";
// import axios from "../../config/axios";
// import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { format, isValid } from "date-fns";

// const PaymentDetails = () => {
//     const { applicationId } = useParams();
//     const [payments, setPayments] = useState([]);

//     useEffect(() => {
//         const fetchPaymentDetails = async () => {
//             try {
//                 const response = await axios.get(`/payments/application/${applicationId}`, {
//                     headers: {
//                         Authorization: localStorage.getItem('token'),
//                     },
//                 });
//                 setPayments(response.data);
//             } catch (error) {
//                 toast.error("Failed to fetch payment details");
//             }
//         };
//         fetchPaymentDetails();
//     }, [applicationId]);

//     return (
//         <div className="container" style={{ backgroundColor: "#f0f0f0", padding: "20px" }}>
//             <h1 className="my-4 text-center">Payment Details</h1>
//             {payments.length === 0 ? (
//                 <p className="text-center">No payment details found</p>
//             ) : (
//                 <table className="table table-striped">
//                     <thead>
//                         <tr>
//                             <th>Payment Date</th>
//                             <th>TransactionId</th>
//                             <th>Amount</th>
//                             <th>Status</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {payments.map(payment => (
//                             <tr key={payment._id}>
//                                 <td>{isValid(new Date(payment.createdAt)) ? format(new Date(payment.createdAt), 'dd/MM/yyyy') : 'Invalid Date'}</td>
//                                 <td>{payment.transactionId}</td>
//                                 <td>{payment.amount}</td>
//                                 <td>{payment.paymentStatus}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}
//         </div>
//     );
// };

// export default PaymentDetails;

// import React, { useEffect, useState } from "react";
// import axios from "../../config/axios";
// import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { format, isValid } from "date-fns";

// const PaymentDetails = () => {
//     const { applicationId } = useParams();
//     const [payments, setPayments] = useState([]);
//     const [loanStatus, setLoanStatus] = useState(null);

//     useEffect(() => {
//         const fetchPaymentDetails = async () => {
//             try {
//                 const response = await axios.get(`/payments/application/${applicationId}`, {
//                     headers: {
//                         Authorization: localStorage.getItem('token'),
//                     },
//                 });
//                 console.log("Full API Response:", response.data);
//                 // Assuming response.data is the array of payments directly
//                 setPayments(response.data);
//                 // You may need to fetch the loan status separately as it's not included in the same response
//             } catch (error) {
//                 toast.error("Failed to fetch payment details");
//             }
//         };
//         fetchPaymentDetails();
//     }, [applicationId]);

//     // Since loanStatus is not in the same response, we need to handle it separately
//     // Example placeholder
//     const isLoanApproved = loanStatus === 'approved';

//     const hasPayments = Array.isArray(payments) && payments.length > 0;

//     console.log("Payments State:", payments);
//     console.log("Loan Status:", loanStatus);
//     console.log("Has Payments:", hasPayments);
//     console.log("Is Loan Approved:", isLoanApproved);

// //     return (
// //         <div className="container" style={{ backgroundColor: "#f0f0f0", padding: "20px" }}>
// //             <h1 className="my-4 text-center">Payment Details</h1>
// //             {isLoanApproved && !hasPayments ? (
// //                 <p className="text-center">The loan has been approved, but the customer has not made any payments yet.</p>
// //             ) : !hasPayments ? (
// //                 <p className="text-center">No payment details found</p>
// //             ) : (
// //                 <table className="table table-striped">
// //                     <thead>
// //                         <tr>
// //                             <th>Payment Date</th>
// //                             <th>TransactionId</th>
// //                             <th>Amount</th>
// //                             <th>Status</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody>
// //                         {payments.map(payment => (
// //                             <tr key={payment._id}>
// //                                 <td>{isValid(new Date(payment.createdAt)) ? format(new Date(payment.createdAt), 'dd/MM/yyyy') : 'Invalid Date'}</td>
// //                                 <td>{payment.transactionId}</td>
// //                                 <td>{payment.amount}</td>
// //                                 <td>{payment.paymentStatus}</td>
// //                             </tr>
// //                         ))}
// //                     </tbody>
// //                 </table>
//             )}
//         </div>
//     );
// };

// export default PaymentDetails;

import React, { useEffect, useState } from "react";
import axios from "../../config/axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { format, isValid } from "date-fns";
import {Container,Row,Col, Table, Alert,} from 'reactstrap';

const PaymentDetails = () => {
    const { applicationId } = useParams();
    const [payments, setPayments] = useState([]);
    const [applicationDetails, setApplicationDetails] = useState(null); // Initialize as null
    const [loanStatus, setLoanStatus] = useState(null);

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const response = await axios.get(`/payments/application/${applicationId}`, {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                });

                if (response.data) {
                    setPayments(response.data.payments || []);
                    setApplicationDetails(response.data.applicationDetails || {});
                    setLoanStatus(response.data.applicationDetails?.loanStatus || null);
                } else {
                    toast.error("No data returned from the server");
                }
            } catch (error) {
                console.error(error); // Log the error for debugging
                toast.error("Failed to fetch payment details");
            }
        };

        fetchPaymentDetails();
    }, [applicationId]);

    const isLoanApproved = loanStatus === 'approved';
    const hasPayments = Array.isArray(payments) && payments.length > 0;

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Payment Details</h1>
            <Row className="mb-4">
                <Col md="6">
                    <h4 className="text-primary">
                        Customer: {applicationDetails?.customerProfile?.firstName || 'N/A'} {applicationDetails?.customerProfile?.lastName || ''}
                    </h4>
                </Col>
                <Col md="6" className="text-md-right">
                    <h4 className="text-primary">
                        Loan Type: {applicationDetails?.loan?.type || 'N/A'}
                    </h4>
                </Col>
            </Row>
            {isLoanApproved && !hasPayments ? (
                <Alert color="warning" className="text-center">
                    The loan has been approved, but the customer has not made any payments yet.
                </Alert>
            ) : !hasPayments ? (
                <Alert color="info" className="text-center">
                    No payment details found
                </Alert>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Payment Date</th>
                            <th>Transaction ID</th>
                            <th>Amount (₹)</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map(payment => (
                            <tr key={payment._id}>
                                <td>{isValid(new Date(payment.createdAt)) ? format(new Date(payment.createdAt), 'dd/MM/yyyy') : 'Invalid Date'}</td>
                                <td>{payment.transactionId}</td>
                                <td>{`₹${payment.amount.toFixed(2)}`}</td>
                                <td>{payment.paymentStatus}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default PaymentDetails;
