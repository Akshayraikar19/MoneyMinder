import React, { useEffect, useState } from 'react';
import axios from '../../config/axios';
import { format, isBefore } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import PaymentComponent from './paymentComponent';
import {
  Container,
  Row,
  Col,
  Table,
  Alert,
  Spinner,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Input,
  Button
} from 'reactstrap';

const PaymentLink = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('');
  const [nextEmiDueDate, setNextEmiDueDate] = useState(null);
  const [isEligibleToPay, setIsEligibleToPay] = useState(false);
  const [emi, setEmi] = useState(null);
  const [applicationId, setApplicationId] = useState('');
  const [error, setError] = useState('');
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState('status');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPayments, setTotalPayments] = useState(0);

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      if (!user) {
        setError('User not authenticated');
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`/checkStatus/${user._id}`, {
          headers: { Authorization: localStorage.getItem('token') }
        });

        const { status, nextEmiDueDate, emi, applicationId } = response.data;
        setApplicationStatus(status);
        setNextEmiDueDate(nextEmiDueDate);
        setEmi(emi);
        setApplicationId(applicationId);
        setIsEligibleToPay(
          status === 'approvedByAdmin' && isBefore(new Date(), new Date(nextEmiDueDate))
        );
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching application status');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationStatus();
  }, [user]);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user || !isEligibleToPay) return;

      setLoading(true);
      try {
        const response = await axios.get('/payments/list', {
          params: { sortBy, order, page, limit, search: search.trim() },
          headers: { Authorization: localStorage.getItem('token') }
        });
        setPayments(response.data.payments);
        setTotalPayments(response.data.total);
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching payments');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user, isEligibleToPay, sortBy, order, page, limit, search]);

  const totalPages = Math.ceil(totalPayments / limit);

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
        <Alert color="warning" className="text-center">
          You can only pay your EMI after your loan is approved by the admin.
        </Alert>
      ) : (
        <>
          <Row className="my-3">
            <Col xs={12} md={6} className="mx-auto">
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
              <PaymentComponent applicationId={applicationId} emi={emi} />
              <Row className="my-4">
                <Col xs={12}>
                  <Card>
                    <CardBody>
                      <CardTitle tag="h5" className="text-success">Your Payments</CardTitle>
                      <div className="mb-3">
                        <Input
                          type="text"
                          placeholder="Search payments..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                        <Input
                          type="select"
                          value={searchType}
                          onChange={(e) => setSearchType(e.target.value)}
                          className="mt-2"
                        >
                          <option value="status">Status</option>
                        </Input>
                      </div>
                      <div className="mb-3">
                        <label>Sort by:</label>
                        <Input
                          type="select"
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                        >
                          <option value="createdAt">Date</option>
                        </Input>
                        <Input
                          type="select"
                          value={order}
                          onChange={(e) => setOrder(e.target.value)}
                        >
                          <option value="asc">Ascending</option>
                          <option value="desc">Descending</option>
                        </Input>
                      </div>
                      <Table striped bordered hover responsive>
                        <thead className="bg-primary text-white">
                          <tr>
                            <th>Payment Date</th>
                            <th>Transaction Id</th>
                            <th>Amount</th>
                            <th>Mode</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.length > 0 ? (
                            payments.map(payment => (
                              <tr key={payment._id}>
                                <td>{format(new Date(payment.createdAt), 'dd/MM/yyyy')}</td>
                                <td>{payment.transactionId}</td>
                                <td>₹{payment.amount}</td>
                                <td>{payment.mode}</td>
                                <td>{payment.paymentStatus}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="text-center">No payments found</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                      <div className="d-flex justify-content-between align-items-center">
                        <Button
                          disabled={page <= 1}
                          onClick={() => setPage(page - 1)}
                        >
                          Previous
                        </Button>
                        <div>
                          {Array.from({ length: totalPages }, (_, i) => (
                            <Button
                              key={i + 1}
                              color={page === i + 1 ? 'primary' : 'secondary'}
                              onClick={() => setPage(i + 1)}
                              className="mx-1"
                            >
                              {i + 1}
                            </Button>
                          ))}
                        </div>
                        <Button
                          disabled={page >= totalPages}
                          onClick={() => setPage(page + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </>
          ) : (
            <Alert color="warning" className="text-center">
              Your loan is not yet eligible for EMI payments.
            </Alert>
          )}
        </>
      )}
    </Container>
  );
};

export default PaymentLink;

