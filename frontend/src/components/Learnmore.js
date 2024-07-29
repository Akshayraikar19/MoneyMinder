import React from 'react';
import { Container, Row, Col, Card } from 'reactstrap';

const LearnMore = () => {
  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Learn More About MoneyMinder</h2>
      <Row>
        <Col md="6">
          <Card body>
            <h4 className="card-title">What We Do</h4>
            <p className="card-text">
              MoneyMinder provides a comprehensive loan management system to help you handle your loans effortlessly. From application to approval, our platform simplifies every step.
            </p>
          </Card>
        </Col>
        <Col md="6">
          <Card body>
            <h4 className="card-title">Why Choose Us?</h4>
            <p className="card-text">
              Our user-friendly interface, transparent processes, and customer-centric approach make us the ideal choice for managing your financial needs.
            </p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LearnMore;
