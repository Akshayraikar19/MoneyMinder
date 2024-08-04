
import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, CardBody, CardTitle, CardText } from 'reactstrap';

const Home = () => {
    const [showLearnMore, setShowLearnMore] = useState(false);

    const handleLearnMoreClick = () => {
        setShowLearnMore(!showLearnMore);
    };

    return (
        <div>
            {/* Hero Section */}
            <Card
                className="hero text-center bg-primary text-white"
                style={{
                    padding: '60px 20px',
                    marginBottom: '0',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: 'auto',
                    minHeight: '300px',
                    border: 'none'
                }}
            >
                <CardBody>
                    <CardTitle tag="h1" className="display-4">Welcome to MoneyMinder</CardTitle>
                    <CardText className="lead">Your trusted partner in managing finances and achieving financial goals.</CardText>
                    
                    <Button color="primary" onClick={handleLearnMoreClick}>
                        {showLearnMore ? 'Hide Details' : 'Learn More'}
                    </Button>
                </CardBody>
            </Card>

            {/* Learn More Section */}
            {showLearnMore && (
                <section
                    id="learn-more"
                    style={{
                        backgroundColor: '#e0f4f1',
                        padding: '50px 20px',
                        margin: '0'
                    }}
                >
                    <Container>
                        <h2 className="text-center mb-4">Learn More About MoneyMinder</h2>
                        <Row>
                            <Col xs="12" md="6" className="mb-4">
                                <Card>
                                    <CardBody>
                                        <h4 className="card-title">What We Do</h4>
                                        <p className="card-text">
                                            MoneyMinder provides a comprehensive loan management system to help you handle your loans effortlessly. From application to approval, our platform simplifies every step.
                                        </p>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col xs="12" md="6" className="mb-4">
                                <Card>
                                    <CardBody>
                                        <h4 className="card-title">Why Choose Us?</h4>
                                        <p className="card-text">
                                            Our user-friendly interface, transparent processes, and customer-centric approach make us the ideal choice for managing your financial needs.
                                        </p>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </section>
            )}

            {/* Features Section */}
            <section
                id="features"
                style={{
                    backgroundColor: '#e0f4ff',
                    padding: '80px 20px',
                    margin: '0'
                }}
            >
                <Container>
                    <h2 className="text-center mb-4">Our Features</h2>
                    <Row>
                        <Col xs="12" md="4" className="mb-4">
                            <Card>
                                <CardBody>
                                    <h5 className="card-title">Easy Loan Management</h5>
                                    <p className="card-text">Manage your loans efficiently with our user-friendly interface.</p>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs="12" md="4" className="mb-4">
                            <Card>
                                <CardBody>
                                    <h5 className="card-title">Secure Transactions</h5>
                                    <p className="card-text">Ensure your transactions are secure with our top-notch security features.</p>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs="12" md="4" className="mb-4">
                            <Card>
                                <CardBody>
                                    <h5 className="card-title">24/7 Support</h5>
                                    <p className="card-text">Get support anytime with our dedicated customer service team.</p>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Testimonials Section */}
            <section
                id="testimonials"
                style={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    padding: '50px 20px',
                    margin: '0',
                    minHeight: '300px',
                    boxSizing: 'border-box'
                }}
            >
                <Container>
                    <h2 className="text-center mb-4">What Our Users Say</h2>
                    <Row>
                        <Col xs="12" md="4" className="mb-4">
                            <Card>
                                <CardBody>
                                    <blockquote className="blockquote mb-0">
                                        <p>"MoneyMinder has completely transformed the way I manage my finances. Highly recommend!"</p>
                                        <footer className="blockquote-footer">John Doe</footer>
                                    </blockquote>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs="12" md="4" className="mb-4">
                            <Card>
                                <CardBody>
                                    <blockquote className="blockquote mb-0">
                                        <p>"The loan management features are intuitive and easy to use. It’s a game-changer!"</p>
                                        <footer className="blockquote-footer">Jane Smith</footer>
                                    </blockquote>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs="12" md="4" className="mb-4">
                            <Card>
                                <CardBody>
                                    <blockquote className="blockquote mb-0">
                                        <p>"Excellent customer service and a very secure platform. I feel confident managing my finances here."</p>
                                        <footer className="blockquote-footer">Michael Johnson</footer>
                                    </blockquote>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Contact Section */}
            <section
                id="contact"
                style={{
                    backgroundColor: '#e0f4ff',
                    padding: '50px 20px',
                    margin: '0'
                }}
            >
                <Container>
                    <h2 className="text-center mb-4">Get In Touch</h2>
                    <Row>
                        <Col xs="12" md="6" className="mb-4">
                            <h4>Contact Us</h4>
                            <p>If you have any questions, feel free to reach out to us.</p>
                            <p>Email: support@moneyminder.com</p>
                            <p>Phone: +123 456 7890</p>
                        </Col>
                        <Col xs="12" md="6" className="mb-4">
                            <h4>Visit Us</h4>
                            <p>Our office is located at:</p>
                            <p>123 Financial Street, Suite 100</p>
                            <p>Money City, FC 12345</p>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default Home;


