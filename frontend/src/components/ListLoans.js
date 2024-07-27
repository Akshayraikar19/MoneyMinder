import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "../config/axios";
import bg3 from "../assets/images/bg3.jpg";
import { Container, Row, Col, ListGroup, ListGroupItem, Button } from 'reactstrap';

const ListLoan = () => {
    const [loans, setLoans] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get('/api/loans');
                setLoans(response.data);
            } catch (err) {
                alert(err);
            }
        })();
    }, []);

    return (
        <div style={{
            backgroundImage: `url(${bg3})`,
            backgroundSize: 'cover',
            minHeight: '100vh',
            paddingTop: '80px', // Adjust padding top to move content down if needed
            paddingBottom: '80px' // Adjust padding bottom as necessary
        }}>
            <Container>
                <h2 className="text-center mb-4 text-white">Available Loans - {loans.length}</h2>
                <Row className="justify-content-center">
                    <Col md="8">
                        <ListGroup>
                            {loans.map((loan) => (
                                <ListGroupItem key={loan._id} className="d-flex justify-content-between align-items-center bg-grey text-white">
                                    <span>
                                        <Link to={`/loan-detail/${loan._id}`} className="text-decoration-none text-navy">
                                            {loan.type}
                                        </Link>
                                    </span>
                                    <Link to={`/loan-detail/${loan._id}`} className="btn btn-info btn-sm">
                                        Details
                                    </Link>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default ListLoan;
