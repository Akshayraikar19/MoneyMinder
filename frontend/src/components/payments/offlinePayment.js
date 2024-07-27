// import { useState, useEffect } from "react"
// import axios from "../../config/axios"
// import { useAuth } from "../../context/AuthContext"


// export default function OfflinePayment() {
//     const { user } = useAuth();
//     const [loading, setLoading] = useState(false);
//     const [applicationStatus, setApplicationStatus] = useState('');
//     const [nextEmiDueDate, setNextEmiDueDate] = useState(null);
//     const [isEligibleToPay, setIsEligibleToPay] = useState(false);
//     const [emi, setEmi] = useState(null);
//     const [applicationId, setApplicationId] = useState('');
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchApplicationStatus = async() => {
//             if(!user) {
//                 setError('User not authenticated')
//                 return
//             };
//             setLoading(true)
//             try{
//                 const response = await axios.get(`/checkstatus/${user._id}`, {
//                     headers: {
//                         Authorization: localStorage.getItem('token')
//                     }
//                 });

//                 const {status, nextEmiDueDate, applicationId, emi } = response.data
//                 console.log('API Response:', response.data);

//                 setApplicationStatus(status)
//                 setNextEmiDueDate(nextEmiDueDate)
//                 setEmi(emi)
//                 setApplicationId(applicationId)
//                 setIsEligibleToPay(status === 'approvedByAdmin' && isBefore(new Date(), new Date(nextEmiDueDate)));

//             }catch(err) {
//                 console.error('Error fetching application status:', error);
//                 setError(error.response?.data?.message || 'Error fetching application status');
//             } finally {
//                 setLoading(false)
//             }
//         };
//         fetchApplicationStatus();
//     }, [user])

//     return (
//         <div>

//         </div>
//     )
// }



// import React, { useEffect, useState } from 'react';
// import axios from '../../config/axios';
// import { format, isBefore } from 'date-fns';
// import { useAuth } from '../../context/AuthContext';
// import {toast} from 'react-toastify'
// import {
//   Container,
//   Row,
//   Col,
//   Alert,
//   Spinner,
//   Card,
//   CardBody,
//   CardTitle,
//   CardText,
//   Button,
//   Form,
//   FormGroup,
//   Label,
//   Input
// } from 'reactstrap';

// const OfflinePayment = () => {
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [applicationStatus, setApplicationStatus] = useState('');
//   const [nextEmiDueDate, setNextEmiDueDate] = useState(null);
//   const [isEligibleToPay, setIsEligibleToPay] = useState(false);
//   const [emi, setEmi] = useState(null);
//   const [applicationId, setApplicationId] = useState('');
//   const [error, setError] = useState('');
//   const [paymentAmount, setPaymentAmount] = useState('');
//   const [paymentMode, setPaymentMode] = useState('online'); // Default to online payment

//   useEffect(() => {
//     const fetchApplicationStatus = async () => {
//       if (!user) {
//         setError('User not authenticated');
//         return;
//       }

//       setLoading(true);
//       try {
//         const response = await axios.get(`/checkStatus/${user._id}`, {
//           headers: {
//             Authorization: localStorage.getItem('token')
//           }
//         });

//         const { status, nextEmiDueDate, emi, applicationId } = response.data;
//         console.log('API Response:', response.data);

//         setApplicationStatus(status);
//         setNextEmiDueDate(nextEmiDueDate);
//         setEmi(emi);
//         setApplicationId(applicationId);
//         setPaymentAmount(emi); // Prefill payment amount with EMI value
//         setIsEligibleToPay(status === 'approvedByAdmin' && isBefore(new Date(), new Date(nextEmiDueDate)));

//       } catch (error) {
//         console.error('Error fetching application status:', error);
//         setError(error.response?.data?.message || 'Error fetching application status');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchApplicationStatus();
//   }, [user]);

//   const handlePaymentSubmit = async (e) => {
//     e.preventDefault();

//     if (!paymentAmount) {
//       setError('Please enter a payment amount.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const paymentData = {
//         applicationId,
//         amount: paymentAmount,
//         mode: paymentMode
//       };

//       const response = await axios.post('/payments/pay/offline', paymentData, {
//         headers: {
//           Authorization: localStorage.getItem('token')
//         }
//       });

//       console.log('Payment Response:', response.data);
//       setPaymentAmount(''); // Clear the payment amount after submission
//       setPaymentMode('online'); // Reset payment mode to online
//       setError('');
//       toast.success('Payment successfull')
//     } catch (error) {
//       console.error('Error processing payment:', error);
//       setError(error.response?.data?.message || 'Error processing payment');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
//         <Spinner style={{ width: '3rem', height: '3rem' }} type="border" />
//       </div>
//     );
//   }

//   if (error) {
//     return <Alert color="danger">{error}</Alert>;
//   }

//   return (
//     <Container
//       style={{
//         background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)',
//         padding: '20px',
//         borderRadius: '8px',
//         minHeight: '100vh'
//       }}
//     >
//       <Row className="my-4">
//         <Col>
//           <h2 className="text-primary text-center">EMI Payment</h2>
//         </Col>
//       </Row>
//       {applicationStatus !== 'approvedByAdmin' ? (
//         <Alert color="warning" className="text-center">You can only pay your EMI after your loan is approved by the admin.</Alert>
//       ) : (
//         <>
//           <Row className="my-3">
//             <Col md={6} className="mx-auto">
//               <Card body className="bg-light mb-3">
//                 <CardTitle tag="h5" className="text-primary">Next EMI Due Date</CardTitle>
//                 <CardText className="text-center" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
//                   {nextEmiDueDate ? format(new Date(nextEmiDueDate), 'dd/MM/yyyy') : 'N/A'}
//                 </CardText>
//               </Card>
//             </Col>
//           </Row>
//           {isEligibleToPay ? (
//             <>
//               <Form onSubmit={handlePaymentSubmit}>
//                 <Row className="my-4">
//                   <Col md={6} className="mx-auto">
//                     <Card body className="bg-light mb-3">
//                       <CardTitle tag="h5" className="text-primary">Make a Payment</CardTitle>
//                       <FormGroup>
//                         <Label for="paymentAmount">Amount</Label>
//                         <Input
//                           type="number"
//                           id="paymentAmount"
//                           value={paymentAmount}
//                           onChange={(e) => setPaymentAmount(e.target.value)}
//                           required
//                         />
//                       </FormGroup>
//                       <FormGroup>
//                         <Label for="paymentMode">Payment Mode</Label>
//                         <Input
//                           type="select"
//                           id="paymentMode"
//                           value={paymentMode}
//                           onChange={(e) => setPaymentMode(e.target.value)}
//                         >
//                           {/* <option value="online">Online</option> */}
//                           <option value="offline">Offline</option>
//                         </Input>
//                       </FormGroup>
//                       <Button color="primary" type="submit">Submit Payment</Button>
//                     </Card>
//                   </Col>
//                 </Row>
//               </Form>
//             </>
//           ) : (
//             <Alert color="info" className="text-center">You can only pay your EMI after admin approves your loan or on the due date.</Alert>
//           )}
//         </>
//       )}
//     </Container>
//   );
// };

// export default OfflinePayment;



// import React, { useEffect, useState } from 'react';
// import axios from '../../config/axios';
// import { format, isBefore } from 'date-fns';
// import { useAuth } from '../../context/AuthContext';
// import { toast } from 'react-toastify';
// import {
//   Container,
//   Row,
//   Col,
//   Alert,
//   Spinner,
//   Card,
//   CardBody,
//   CardTitle,
//   CardText,
//   Button,
//   Form,
//   FormGroup,
//   Label,
//   Input
// } from 'reactstrap';

// const OfflinePayment = () => {
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [applicationStatus, setApplicationStatus] = useState('');
//   const [nextEmiDueDate, setNextEmiDueDate] = useState(null);
//   const [isEligibleToPay, setIsEligibleToPay] = useState(false);
//   const [emi, setEmi] = useState(null);
//   const [applicationId, setApplicationId] = useState('');
//   const [error, setError] = useState('');
//   const [paymentAmount, setPaymentAmount] = useState('');
//   const [paymentMode, setPaymentMode] = useState('offline'); // Default to offline payment

//   useEffect(() => {
//     const fetchApplicationStatus = async () => {
//       if (!user) {
//         setError('User not authenticated');
//         return;
//       }

//       setLoading(true);
//       try {
//         const response = await axios.get(`/checkStatus/${user._id}`, {
//           headers: {
//             Authorization: localStorage.getItem('token')
//           }
//         });

//         const { status, nextEmiDueDate, emi, applicationId } = response.data;
//         console.log('API Response:', response.data);

//         setApplicationStatus(status);
//         setNextEmiDueDate(nextEmiDueDate);
//         setEmi(emi);
//         setApplicationId(applicationId);
//         setPaymentAmount(emi); // Prefill payment amount with EMI value
//         setIsEligibleToPay(status === 'approvedByAdmin' && isBefore(new Date(), new Date(nextEmiDueDate)));

//       } catch (error) {
//         console.error('Error fetching application status:', error);
//         setError(error.response?.data?.message || 'Error fetching application status');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchApplicationStatus();
//   }, [user]);

//   const handlePaymentSubmit = async (e) => {
//     e.preventDefault();

//     if (!paymentAmount) {
//       setError('Please enter a payment amount.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const paymentData = {
//         applicationId,
//         amount: paymentAmount,
//         mode: paymentMode
//       };

//       const response = await axios.post('/payments/pay/offline', paymentData, {
//         headers: {
//           Authorization: localStorage.getItem('token')
//         }
//       });

//       console.log('Payment Response:', response.data);
//       setPaymentAmount(''); // Clear the payment amount after submission
//       setPaymentMode('offline'); // Reset payment mode to offline
//       setError('');
//       toast.success('Payment successful');
//     } catch (error) {
//       console.error('Error processing payment:', error);
//       setError(error.response?.data?.message || 'Error processing payment');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
//         <Spinner style={{ width: '3rem', height: '3rem' }} type="border" />
//       </div>
//     );
//   }

//   if (error) {
//     return <Alert color="danger">{error}</Alert>;
//   }

//   return (
//     <Container
//       style={{
//         background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)',
//         padding: '20px',
//         borderRadius: '8px',
//         minHeight: '100vh'
//       }}
//     >
//       <Row className="my-4">
//         <Col>
//           <h2 className="text-primary text-center">EMI Payment</h2>
//         </Col>
//       </Row>
//       {applicationStatus !== 'approvedByAdmin' ? (
//         <Alert color="warning" className="text-center">You can only pay your EMI after your loan is approved by the admin.</Alert>
//       ) : (
//         <>
//           <Row className="my-3">
//             <Col md={6} className="mx-auto">
//               <Card body className="bg-light mb-3">
//                 <CardTitle tag="h5" className="text-primary">Next EMI Due Date</CardTitle>
//                 <CardText className="text-center" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
//                   {nextEmiDueDate ? format(new Date(nextEmiDueDate), 'dd/MM/yyyy') : 'N/A'}
//                 </CardText>
//               </Card>
//             </Col>
//           </Row>
//           {isEligibleToPay ? (
//             <>
//               <Form onSubmit={handlePaymentSubmit}>
//                 <Row className="my-4">
//                   <Col md={6} className="mx-auto">
//                     <Card body className="bg-light mb-3">
//                       <CardTitle tag="h5" className="text-primary">Make a Payment</CardTitle>
//                       <FormGroup>
//                         <Label for="paymentAmount">Amount</Label>
//                         <Input
//                           type="number"
//                           id="paymentAmount"
//                           value={paymentAmount}
//                           onChange={(e) => setPaymentAmount(e.target.value)}
//                           required
//                           readOnly // Make this field read-only
//                         />
//                       </FormGroup>
//                       <FormGroup>
//                         <Label for="paymentMode">Payment Mode</Label>
//                         <Input
//                           type="select"
//                           id="paymentMode"
//                           value={paymentMode}
//                           onChange={(e) => setPaymentMode(e.target.value)}
//                         >
//                           <option value="offline">Offline</option>
//                         </Input>
//                       </FormGroup>
//                       <Button color="primary" type="submit">Submit Payment</Button>
//                     </Card>
//                   </Col>
//                 </Row>
//               </Form>
//             </>
//           ) : (
//             <Alert color="info" className="text-center">You can only pay your EMI after admin approves your loan or on the due date.</Alert>
//           )}
//         </>
//       )}
//     </Container>
//   );
// };

// export default OfflinePayment;


import React, { useEffect, useState } from 'react';
import axios from '../../config/axios';
import { format, isBefore } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import {
  Container,
  Row,
  Col,
  Alert,
  Spinner,
  Card,
  CardTitle,
  CardText,
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';

const OfflinePayment = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('');
  const [nextEmiDueDate, setNextEmiDueDate] = useState(null);
  const [isEligibleToPay, setIsEligibleToPay] = useState(false);
  const [emi, setEmi] = useState(null);
  const [applicationId, setApplicationId] = useState('');
  const [error, setError] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('offline'); // Default to offline payment
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      if (!user) {
        setError('User not authenticated');
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`/checkStatus/${user._id}`, {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        });

        const { status, nextEmiDueDate, emi, applicationId, } = response.data;
        console.log('API Response:', response.data);

        setApplicationStatus(status);
    
        setNextEmiDueDate(nextEmiDueDate);
        setEmi(emi);
        setApplicationId(applicationId);
        setPaymentAmount(emi); // Prefill payment amount with EMI value
        setIsEligibleToPay(status === 'approvedByAdmin' && isBefore(new Date(), new Date(nextEmiDueDate)));

      } catch (error) {
        console.error('Error fetching application status:', error);
        setError(error.response?.data?.message || 'Error fetching application status');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationStatus();
  }, [user]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!paymentAmount) {
      setError('Please enter a payment amount.');
      return;
    }

    setLoading(true);
    try {
      const paymentData = {
        applicationId,
        amount: paymentAmount,
        mode: paymentMode
      };

      const response = await axios.post('/payments/pay/offline', paymentData, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });

      console.log('Payment Response:', response.data);
      setTransactionId(response.data.transactionId); // Set transaction ID to display
      setPaymentAmount(''); // Clear the payment amount after submission
      setPaymentMode('offline'); // Reset payment mode to offline
      setError('');
      toast.success('Payment successful');
    } catch (error) {
      console.error('Error processing payment:', error);
      setError(error.response?.data?.message || 'Error processing payment');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner style={{ width: '3rem', height: '3rem' }} type="border" />
      </div>
    );
  }

  if (error) {
    return <Alert color="danger">{error}</Alert>;
  }

  return (
    <Container
      style={{
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)',
        padding: '20px',
        borderRadius: '8px',
        minHeight: '100vh'
      }}
    >
      <Row className="my-4">
        <Col>
          <h2 className="text-primary text-center">EMI Payment</h2>
        </Col>
      </Row>
      {applicationStatus !== 'approvedByAdmin' ? (
        <Alert color="warning" className="text-center">You can only pay your EMI after your loan is approved by the admin.</Alert>
      ) : (
        <>
          <Row className="my-3">
            <Col md={6} className="mx-auto">
              <Card body className="bg-light mb-3">
                <CardTitle tag="h5" className="text-primary">Next EMI Due Date</CardTitle>
                <CardText className="text-center" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                  {nextEmiDueDate ? format(new Date(nextEmiDueDate), 'dd/MM/yyyy') : 'N/A'}
                </CardText>
              </Card>
            </Col>
          </Row>
          {isEligibleToPay ? (
            <>
              <Form onSubmit={handlePaymentSubmit}>
                <Row className="my-4">
                  <Col md={6} className="mx-auto">
                    <Card body className="bg-light mb-3">
                      <CardTitle tag="h5" className="text-primary">Make a Payment</CardTitle>
                      <FormGroup>
                        <Label for="paymentAmount">Amount</Label>
                        <Input
                          type="number"
                          id="paymentAmount"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          required
                          readOnly // Make this field read-only
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label for="paymentMode">Payment Mode</Label>
                        <Input
                          type="select"
                          id="paymentMode"
                          value={paymentMode}
                          onChange={(e) => setPaymentMode(e.target.value)}
                        >
                          <option value="offline">Offline</option>
                        </Input>
                      </FormGroup>
                      <Button color="primary" type="submit">Submit Payment</Button>
                    </Card>
                  </Col>
                </Row>
              </Form>
              {transactionId && (
                <Row className="my-3">
                  <Col md={6} className="mx-auto">
                    <Card body className="bg-light">
                      <CardTitle tag="h5" className="text-success">Payment Confirmation</CardTitle>
                      <CardText className="text-center" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                        Transaction ID: {transactionId}
                      </CardText>
                    </Card>
                  </Col>
                </Row>
              )}
            </>
          ) : (
            <Alert color="info" className="text-center">You can only pay your EMI after admin approves your loan or on the due date.</Alert>
          )}
        </>
      )}
    </Container>
  );
};

export default OfflinePayment;
