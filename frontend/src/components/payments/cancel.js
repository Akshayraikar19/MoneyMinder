// import React, { useEffect } from 'react';
// import axios from '../../config/axios'; 

// export default function Cancel() {
//   useEffect(() => {
//     const sessionId = new URLSearchParams(window.location.search).get('session_id');
//     console.log('Session ID:', sessionId); // Debugging line

//     if (sessionId) {
//       axios.put(`/api/payment/failure/update/${sessionId}`)
//         .then(response => {
//           console.log('Payment status updated:', response.data);
//         })
//         .catch(err => {
//           console.error('Error updating payment status:', err);
//         });
//     }
//   }, []);

//   return (
//     <div>
//       <h1>Payment Failure</h1>
//       <p>There was an issue with your payment. Please try again or contact support.</p>
//     </div>
//   );
// };


import React, { useEffect } from 'react';
import axios from '../../config/axios'; 
import { Container, Row, Col, Alert, Card, CardBody, CardText } from 'reactstrap';

export default function Cancel() {
  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    console.log('Session ID:', sessionId); // Debugging line

    if (sessionId) {
      axios.put(`/api/payment/failure/update/${sessionId}`)
        .then(response => {
          console.log('Payment status updated:', response.data);
        })
        .catch(err => {
          console.error('Error updating payment status:', err);
        });
    }
  }, []);

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md="8" lg="6">
          <Card body className="text-center">
            <CardBody>
              <Alert color="danger" className="mb-4">
                <h4 className="alert-heading">Payment Failure</h4>
                <CardText>
                  There was an issue with your payment. Please try again later or contact support if the problem persists.
                </CardText>
              </Alert>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
