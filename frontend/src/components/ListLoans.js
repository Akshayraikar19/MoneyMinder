import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "../config/axios";
import images from "../assets/images/images.jpg";
import { Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';

const ListLoan = () => {
    const [loans, setLoans] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get('/api/loans');
                console.log(response.data); // Debugging line to ensure data is received
                setLoans(response.data);
            } catch (err) {
                alert('Failed to fetch loans');
                console.error(err); // Debugging line for errors
            }
        })();
    }, []);

    return (
        <div style={{
            backgroundImage: `url(${images})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            paddingTop: '80px',
            paddingBottom: '80px',
            color: 'white' // Ensure text color is white for visibility
        }}>
            <Container>
                <h2 className="text-center mb-4">Available Loans - {loans.length}</h2>
                <Row className="justify-content-center">
                    <Col xs="12" md="10" lg="8">
                        <ListGroup>
                            {loans.length > 0 ? (
                                loans.map((loan) => (
                                    <ListGroupItem
                                        key={loan._id}
                                        className="d-flex justify-content-between align-items-center bg-dark text-white mb-2"
                                        style={{
                                            borderRadius: '5px',
                                            border: '1px solid #444' // Optional border style
                                        }}
                                    >
                                        <span>
                                            <Link to={`/loan-detail/${loan._id}`} className="text-decoration-none text-light">
                                                {loan.type || 'Unknown Type'}
                                            </Link>
                                        </span>
                                        <Link to={`/loan-detail/${loan._id}`} className="btn btn-info btn-sm">
                                            Details
                                        </Link>
                                    </ListGroupItem>
                                ))
                            ) : (
                                <ListGroupItem className="text-center">No loans available</ListGroupItem>
                            )}
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default ListLoan;
