// import React, { useState, useEffect } from 'react';
// import { useAuth } from "../context/AuthContext";
//  import bg11 from '../assets/images/bg11.jpg';

// import bg6 from '../assets/images/bg6.jpg'
//  import bg8 from '../assets/images/bg8.jpeg'
//  import bg7 from '../assets/images/bg7.jpg'
//  import bg9 from '../assets/images/bg9.jpg'
//  import bg12 from '../assets/images/bg12.jpg'
//  import bg1 from '../assets/images/bg1.jpg'
 

// import { useNavigate } from 'react-router-dom';
// import Footer from './Footer';

// const backgrounds =[bg11,bg7, bg8,bg6,bg1, bg12, bg9];

// const Home = () => {
//     const { user } = useAuth();
//     const navigate = useNavigate();
//     const [activeIndex, setActiveIndex] = useState(0);

//     const handleRegisterClick = () => {
//         if (!user) {
//             navigate('/register');
//         }
//     };

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setActiveIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
//         }, 4000); // Change background every 4 seconds

//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <div className="min-h-screen flex flex-col items-center justify-center">
//             <main
//                 className="flex-grow flex flex-col items-center justify-center bg-cover bg-center mt-16 p-4 rounded-lg"
//                 style={{
//                     backgroundImage: `url(${backgrounds[activeIndex]})`,
//                     minHeight: '100vh',
//                     backgroundSize: 'cover',
//                     backgroundRepeat: 'no-repeat',
//                     backgroundPosition: 'center center',
//                     display: 'flex',
//                     alignItems: 'center',
//                     textAlign: 'center'
//                 }}
//             >
//                 <div className="bg-black bg-opacity-50 p-6 rounded-lg text-center text-white max-w-2xl md:p-10">
//                     <h1 className="text-3xl font-bold mb-4 md:text-5xl">Empowering Your Financial Future</h1>
//                     <p className="text-sm mb-8 md:text-lg">
//                         Welcome to our platform where you can manage your financial goals and apply for loans with ease.
//                          Whether you need a personal loan, mortgage, or funding for your business, we're here to make financial services accessible and straightforward for everyone.
//                     </p>
//                     <button
//                         onClick={handleRegisterClick}
//                         disabled={user}
//                         className={`btn btn-primary ${user ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} md:px-6 md:py-2`}
//                     >
//                         {user ? 'Registered' : 'Apply Now'}
//                     </button>
//                     <Footer />
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default Home;

// import React from 'react';
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from 'react-router-dom';
// import Footer from './Footer';

// const Home = () => {
//     const { user } = useAuth();
//     const navigate = useNavigate();

//     const handleRegisterClick = () => {
//         if (!user) {
//             navigate('/register');
//         }
//     };

//     return (
//         <div className="min-h-screen flex flex-col">
//             {/* Hero Section */}
//             <section className="relative bg-gradient-to-r from-blue-500 to-teal-500 text-white text-center py-20 px-4">
//                 <div className="absolute inset-0 bg-opacity-30" style={{ backgroundImage: 'url(/path/to/your/hero-image.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
//                 <div className="relative z-10">
//                     <h1 className="text-4xl font-bold mb-4 md:text-5xl">Empowering Your Financial Future</h1>
//                     <p className="text-lg mb-8 md:text-xl">
//                         Discover our comprehensive range of loan solutions designed to help you achieve your financial goals. Whether it's for personal, home, or business needs, we offer tailored services to fit your requirements.
//                     </p>
//                     <button
//                         onClick={handleRegisterClick}
//                         disabled={user}
//                         className={`btn ${user ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'} text-white px-6 py-3 rounded-lg text-lg font-semibold`}
//                     >
//                         {user ? 'Registered' : 'Apply Now'}
//                     </button>
//                 </div>
//             </section>

//             {/* Features Section */}
//             <section className="py-16 px-4 bg-white text-gray-800">
//                 <div className="container mx-auto text-center">
//                     <h2 className="text-3xl font-semibold mb-8">Why Choose MoneyMinder?</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                         <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
//                             <h3 className="text-xl font-semibold mb-4">Fast Approval</h3>
//                             <p>Experience quick and efficient loan approval processes, so you can get the funds you need without unnecessary delays.</p>
//                         </div>
//                         <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
//                             <h3 className="text-xl font-semibold mb-4">Competitive Rates</h3>
//                             <p>We offer some of the most competitive interest rates in the market to ensure you get the best deal possible.</p>
//                         </div>
//                         <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
//                             <h3 className="text-xl font-semibold mb-4">Flexible Terms</h3>
//                             <p>Choose from a range of flexible loan terms to suit your financial situation and repayment preferences.</p>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* Call to Action */}
//             <section className="py-16 px-4 bg-gray-100 text-center">
//                 <h2 className="text-2xl font-semibold mb-4 text-gray-800">Ready to Get Started?</h2>
//                 <p className="text-lg mb-6 text-gray-600">
//                     Take the first step towards achieving your financial goals with MoneyMinder. Apply now or contact us for more information.
//                 </p>
//                 <button
//                     onClick={() => navigate('/loans')}
//                     className="btn bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-semibold"
//                 >
//                     View Loans
//                 </button>
//             </section>

//             {/* Footer */}
//             <Footer />
//         </div>
//     );
// };

// export default Home;





// import React, { useState } from 'react';
// import {
//   Container,
//   Row,
//   Col,
//   Button,
//   Card,
//   CardBody,
//   CardTitle,
//   CardText,
//   Carousel,
//   CarouselItem,
//   CarouselControl,
//   CarouselIndicators,
//   Nav,
//   NavItem,
//   NavLink,
// } from 'reactstrap';
// import { FaClock, FaWallet, FaCheck } from 'react-icons/fa';

// const items = [
//   {
//     src: '/placeholder-user.jpg',
//     altText: 'John Doe',
//     caption: 'Satisfied Customer',
//     header: 'John Doe',
//     text: "MoneyMinder made getting a loan so easy. The application process was a breeze and I got approved in no time. Highly recommend!",
//   },
//   {
//     src: '/placeholder-user.jpg',
//     altText: 'Jane Smith',
//     caption: 'Satisfied Customer',
//     header: 'Jane Smith',
//     text: "I was hesitant to use a loan app at first, but MoneyMinder exceeded my expectations. The flexible repayment options made it easy to manage my finances.",
//   },
//   {
//     src: '/placeholder-user.jpg',
//     altText: 'Michael Johnson',
//     caption: 'Satisfied Customer',
//     header: 'Michael Johnson',
//     text: "I needed a loan quickly and MoneyMinder delivered. The fast approval process was a game-changer for me. I highly recommend this app to anyone in need of financial assistance.",
//   }
// ];

// export default function Component() {
//   const [activeIndex, setActiveIndex] = useState(0);

//   const next = () => {
//     const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
//     setActiveIndex(nextIndex);
//   };

//   const previous = () => {
//     const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
//     setActiveIndex(nextIndex);
//   };

//   const goToIndex = (newIndex) => {
//     setActiveIndex(newIndex);
//   };

//   return (
//     <div className="d-flex flex-column min-vh-100 bg-dark text-light">
//       <header className="bg-primary text-light py-3">
//       </header>
//       <main className="flex-fill">
//         <section className="py-5">
//           <Container>
//             <Row>
//               <Col md="6" className="d-flex flex-column justify-content-center">
//                 <h1 className="display-2 font-weight-bold">Take Control of Your Finances with MoneyMinder</h1>
//                 <p className="lead text-muted">
//                   Get the loan you need quickly and easily with our user-friendly app. Flexible repayment options and fast approvals make managing your money a breeze.
//                 </p>
//                 <Button color="primary" href="#" size="lg">
//                   Apply for a Loan
//                 </Button>
//               </Col>
//               <Col md="6">
//                 {/* Removed the image */}
//               </Col>
//             </Row>
//           </Container>
//         </section>
//         <section className="py-5 bg-secondary">
//           <Container>
//             <Row>
//               <Col md="4" className="text-center">
//                 <FaClock className="h1 text-primary" />
//                 <h3 className="h4 font-weight-bold">Fast Approval</h3>
//                 <p className="text-muted">
//                   Get approved for a loan in as little as 24 hours. No lengthy paperwork or delays.
//                 </p>
//               </Col>
//               <Col md="4" className="text-center">
//                 <FaWallet className="h1 text-primary" />
//                 <h3 className="h4 font-weight-bold">Flexible Repayment</h3>
//                 <p className="text-muted">
//                   Choose from a variety of repayment plans that fit your budget and lifestyle.
//                 </p>
//               </Col>
//               <Col md="4" className="text-center">
//                 <FaCheck className="h1 text-primary" />
//                 <h3 className="h4 font-weight-bold">Easy Application</h3>
//                 <p className="text-muted">
//                   Our simple, user-friendly application process makes getting a loan a breeze.
//                 </p>
//               </Col>
//             </Row>
//           </Container>
//         </section>
//         <section className="py-5">
//           <Container>
//             <Row>
//               <Col md="6">
//                 <div className="bg-secondary p-4 rounded">
//                   <h2 className="h3 font-weight-bold">What Our Customers Say</h2>
//                   <p className="text-muted">
//                     Hear from real people who have used MoneyMinder to take control of their finances.
//                   </p>
//                 </div>
//               </Col>
//               <Col md="6">
//                 <Carousel activeIndex={activeIndex} next={next} previous={previous}>
//                   <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
//                   {items.map((item, index) => (
//                     <CarouselItem key={index}>
//                       <Card className="bg-dark text-light">
//                         <CardBody className="d-flex flex-column align-items-start">
//                           <img src={item.src} alt={item.altText} className="rounded-circle" width="70" height="70" />
//                           <CardTitle tag="h5">{item.header}</CardTitle>
//                           <CardText>{item.text}</CardText>
//                         </CardBody>
//                       </Card>
//                     </CarouselItem>
//                   ))}
//                   <CarouselControl direction="prev" onClickHandler={previous} />
//                   <CarouselControl direction="next" onClickHandler={next} />
//                 </Carousel>
//               </Col>
//             </Row>
//           </Container>
//         </section>
//       </main>
//       <footer className="bg-dark py-3 border-top">
//         <Container>
//           <Row className="align-items-center">
//             <Col>
//               <p className="text-center text-muted mb-0">&copy; 2024 MoneyMinder. All rights reserved.</p>
//             </Col>
//             <Col className="d-flex justify-content-center">
//               <Nav className="d-flex">
//                 <NavItem>
//                   <NavLink href="#" className="text-light">Terms of Service</NavLink>
//                 </NavItem>
//                 <NavItem>
//                   <NavLink href="#" className="text-light">Privacy</NavLink>
//                 </NavItem>
//               </Nav>
//             </Col>
//           </Row>
//         </Container>
//       </footer>
//     </div>
//   );
// }
// import React, { useState } from 'react';
// import { Container, Row, Col, Button, Card, CardBody, CardTitle, CardText } from 'reactstrap';

// const Home = () => {
//     const [showLearnMore, setShowLearnMore] = useState(false);

//     const handleLearnMoreClick = () => {
//         setShowLearnMore(!showLearnMore);
//     };

//     return (
//         <div>
//             {/* Hero Section */}
//             <Card
//                 className="hero text-center bg-primary text-white"
//                 style={{
//                     padding: '60px 20px', // Adjust padding for size
//                     marginBottom: '30px',
//                     backgroundSize: 'cover',
//                     backgroundPosition: 'center',
//                     height: '400px', // Adjust height for size
//                 }}
//             >
//                 <CardBody>
//                     <CardTitle tag="h1" className="display-4">Welcome to MoneyMinder</CardTitle>
//                     <CardText className="lead">Your trusted partner in managing finances and achieving financial goals.</CardText>
                    
//                     <Button color="primary" onClick={handleLearnMoreClick}>
//                         {showLearnMore ? 'Hide Details' : 'Learn More'}
//                     </Button>
//                 </CardBody>
//             </Card>

//             {/* Learn More Section */}
//             {showLearnMore && (
//                 <section
//                     id="learn-more"
//                     style={{
//                         backgroundColor: '#f8f9fa',
//                         padding: '50px 0'
//                     }}
//                 >
//                     <Container>
//                         <h2 className="text-center mb-4">Learn More About MoneyMinder</h2>
//                         <Row>
//                             <Col md="6" className="mb-4">
//                                 <Card>
//                                     <CardBody>
//                                         <h4 className="card-title">What We Do</h4>
//                                         <p className="card-text">
//                                             MoneyMinder provides a comprehensive loan management system to help you handle your loans effortlessly. From application to approval, our platform simplifies every step.
//                                         </p>
//                                     </CardBody>
//                                 </Card>
//                             </Col>
//                             <Col md="6" className="mb-4">
//                                 <Card>
//                                     <CardBody>
//                                         <h4 className="card-title">Why Choose Us?</h4>
//                                         <p className="card-text">
//                                             Our user-friendly interface, transparent processes, and customer-centric approach make us the ideal choice for managing your financial needs.
//                                         </p>
//                                     </CardBody>
//                                 </Card>
//                             </Col>
//                         </Row>
//                     </Container>
//                 </section>
//             )}

//               {/* Features Section */}
//               <section
//                 id="features"
//                 style={{
//                     backgroundColor: '#ffffff',
//                     padding: '50px 0'
//                 }}
//             >
//                 <Container>
//                     <h2 className="text-center mb-4">Our Features</h2>
//                     <Row>
//                         <Col md="4" className="mb-4">
//                             <Card>
//                                 <CardBody>
//                                     <h5 className="card-title">Easy Loan Management</h5>
//                                     <p className="card-text">Manage your loans efficiently with our user-friendly interface.</p>
//                                 </CardBody>
//                             </Card>
//                         </Col>
//                         <Col md="4" className="mb-4">
//                             <Card>
//                                 <CardBody>
//                                     <h5 className="card-title">Secure Transactions</h5>
//                                     <p className="card-text">Ensure your transactions are secure with our top-notch security features.</p>
//                                 </CardBody>
//                             </Card>
//                         </Col>
//                         <Col md="4" className="mb-4">
//                             <Card>
//                                 <CardBody>
//                                     <h5 className="card-title">24/7 Support</h5>
//                                     <p className="card-text">Get support anytime with our dedicated customer service team.</p>
//                                 </CardBody>
//                             </Card>
//                         </Col>
//                     </Row>
//                 </Container>
//             </section>

            
//            {/* Testimonials Section */}
// {/* Testimonials Section */}

// {/* Testimonials Section */}
// <section
//     id="testimonials"
//     style={{
//         backgroundColor: '#007bff', // Background color for the section
//         color: '#fff', // Text color
//         padding: '50px 0', // Padding to create space inside the section
//         minHeight: '400px', // Minimum height of the section
//         width: '100%', // Ensure the section spans full width
//         boxSizing: 'border-box', // Include padding and border in the element's total width and height
//         display: 'flex', // Flexbox to center content
//         alignItems: 'center', // Center items vertically
//         justifyContent: 'center' // Center items horizontally
//     }}
// >
//     <Container>
//         <h2 className="text-center mb-4">What Our Users Say</h2>
//         <Row>
//             <Col md="4" className="mb-4">
//                 <Card>
//                     <CardBody>
//                         <blockquote className="blockquote mb-0">
//                             <p>"MoneyMinder has completely transformed the way I manage my finances. Highly recommend!"</p>
//                             <footer className="blockquote-footer">John Doe</footer>
//                         </blockquote>
//                     </CardBody>
//                 </Card>
//             </Col>
//             <Col md="4" className="mb-4">
//                 <Card>
//                     <CardBody>
//                         <blockquote className="blockquote mb-0">
//                             <p>"The loan management features are intuitive and easy to use. It’s a game-changer!"</p>
//                             <footer className="blockquote-footer">Jane Smith</footer>
//                         </blockquote>
//                     </CardBody>
//                 </Card>
//             </Col>
//             <Col md="4" className="mb-4">
//                 <Card>
//                     <CardBody>
//                         <blockquote className="blockquote mb-0">
//                             <p>"Excellent customer service and a very secure platform. I feel confident managing my finances here."</p>
//                             <footer className="blockquote-footer">Michael Johnson</footer>
//                         </blockquote>
//                     </CardBody>
//                 </Card>
//             </Col>
//         </Row>
//     </Container>
// </section>

//             {/* Contact Section */}
//             <section
//                 id="contact"
//                 style={{
//                     backgroundColor: '#f1f1f1',
//                     padding: '50px 0'
//                 }}
//             >
//                 <Container>
//                     <h2 className="text-center mb-4">Get In Touch</h2>
//                     <Row>
//                         <Col md="6">
//                             <h4>Contact Us</h4>
//                             <p>If you have any questions, feel free to reach out to us.</p>
//                             <p>Email: support@moneyminder.com</p>
//                             <p>Phone: +123 456 7890</p>
//                         </Col>
//                         <Col md="6">
//                             <h4>Visit Us</h4>
//                             <p>Our office is located at:</p>
//                             <p>123 Financial Street, Suite 100</p>
//                             <p>Money City, FC 12345</p>
//                         </Col>
//                     </Row>
//                 </Container>
//             </section>
//         </div>
//     );
// };

// export default Home


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
                    marginBottom: '0', // Ensure there's no extra margin
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '400px',
                    border: 'none' // Ensure no border adds extra spacing
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
                        padding: '50px 20px', // Ensure padding is consistent
                        margin: '0' // Remove default margins
                    }}
                >
                    <Container>
                        <h2 className="text-center mb-4">Learn More About MoneyMinder</h2>
                        <Row>
                            <Col md="6" className="mb-4">
                                <Card>
                                    <CardBody>
                                        <h4 className="card-title">What We Do</h4>
                                        <p className="card-text">
                                            MoneyMinder provides a comprehensive loan management system to help you handle your loans effortlessly. From application to approval, our platform simplifies every step.
                                        </p>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md="6" className="mb-4">
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
                    padding: '80px 20px', // Ensure padding is consistent
                    margin: '0' // Remove default margins
                }}
            >
                <Container>
                    <h2 className="text-center mb-4">Our Features</h2>
                    <Row>
                        <Col md="4" className="mb-4">
                            <Card>
                                <CardBody>
                                    <h5 className="card-title">Easy Loan Management</h5>
                                    <p className="card-text">Manage your loans efficiently with our user-friendly interface.</p>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md="4" className="mb-4">
                            <Card>
                                <CardBody>
                                    <h5 className="card-title">Secure Transactions</h5>
                                    <p className="card-text">Ensure your transactions are secure with our top-notch security features.</p>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md="4" className="mb-4">
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
                    padding: '50px 20px', // Ensure padding is consistent
                    margin: '0', // Remove default margins
                    minHeight: '400px',
                    width: '100%',
                    boxSizing: 'border-box'
                }}
            >
                <Container>
                    <h2 className="text-center mb-4">What Our Users Say</h2>
                    <Row>
                        <Col md="4" className="mb-4">
                            <Card>
                                <CardBody>
                                    <blockquote className="blockquote mb-0">
                                        <p>"MoneyMinder has completely transformed the way I manage my finances. Highly recommend!"</p>
                                        <footer className="blockquote-footer">John Doe</footer>
                                    </blockquote>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md="4" className="mb-4">
                            <Card>
                                <CardBody>
                                    <blockquote className="blockquote mb-0">
                                        <p>"The loan management features are intuitive and easy to use. It’s a game-changer!"</p>
                                        <footer className="blockquote-footer">Jane Smith</footer>
                                    </blockquote>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md="4" className="mb-4">
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
                    padding: '50px 20px', // Ensure padding is consistent
                    margin: '0' // Remove default margins
                }}
            >
                <Container>
                    <h2 className="text-center mb-4">Get In Touch</h2>
                    <Row>
                        <Col md="6">
                            <h4>Contact Us</h4>
                            <p>If you have any questions, feel free to reach out to us.</p>
                            <p>Email: support@moneyminder.com</p>
                            <p>Phone: +123 456 7890</p>
                        </Col>
                        <Col md="6">
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
