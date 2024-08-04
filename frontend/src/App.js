import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Routes, Route, Link } from 'react-router-dom';
import { Navbar, NavbarToggler, Collapse, Nav, NavItem, NavLink } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useSelector } from 'react-redux';
import axios from "./config/axios"
import { useAuth } from './context/AuthContext';

import Home from './components/Home';
import LearnMore from './components/Learnmore';
import Register from './components/Register';
import Login from './components/Login';
import Account from './components/Account';
import CustomerProfile from './components/CustomerProfile';
import OfficerProfile from './components/OfficerProfile';
import AddLoan from './components/AddLoan';
import ListLoan from './components/ListLoans';
import LoanDetails from './components/loanDetails';
import MyLoans from './components/Myloans';
import EditLoan from './components/EditLoan';
import LoanApplications from './components/loanApplications';
import ApplicationForm from './components/ApplicationForm';
import SingleApplication from './components/singleApplication';
import ResetPassword from './components/ResetPassword';
import PrivateRoute from './components/PrivateRoute';
import VerificationProgress from './components/VerificationProgress';
import UnverifiedOfficers from './components/adminDashboard/AllOfficers';
import AllApplications from './components/adminDashboard/AllApplications';
import SingleApplicationAdmin from './components/adminDashboard/singleApplications';
import PaymentLink from './components/payments/paymentLink';
import Success from './components/payments/success';
import Cancel from './components/payments/cancel';
import OfflinePayment from './components/payments/offlinePayment';
import ApprovedApplications from './components/adminDashboard/approvedApplications';
import PaymentDetails from './components/adminDashboard/payments';
import VerifyOfflinePayment from './components/adminDashboard/offlinePayment';



function App() {
  console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL); // Log to verify the value
  const { user, handleLogin, handleLogout } = useAuth();
  const email = useSelector((state) => state.forgot.email);
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      (async () => {
        const response = await axios.get('/users/account', {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        });
        handleLogin(response.data);
      })();
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>MoneyMinder</title>
        <link rel="icon" type="image/png" href={`${process.env.PUBLIC_URL}/life-line.ico`} sizes="16x16" />
      </Helmet>

      <Navbar 
        color="primary" 
        light 
        expand="md"
        style={{
          padding: '10px 20px', // Adjust padding for size
          height: '80px', // Adjust height for size
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/">Home</NavLink>
            </NavItem>

            {/* <NavItem>
              <NavLink tag={Link} to="/learn-more">Learn More</NavLink> 
            </NavItem> */}

            <NavItem>
              <NavLink tag={Link} to="/loan-list">Loans</NavLink>
            </NavItem>

            {!user ? (
              <>
                <NavItem>
                  <NavLink tag={Link} to="/register">Register</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/login">Login</NavLink>
                </NavItem>
              </>
            ) : (
              <>
                {user.role === 'customer' && (
                  <>
                    <NavItem>
                      <NavLink tag={Link} to="/account">Account</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} to="/customer-profile">Profile</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} to="/payments">Payment</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} to="/offlinePayment">Offline-Payment</NavLink>
                    </NavItem>
                  </>
                )}

                {user.role === 'officer' && (
                  <>
                    <NavItem>
                      <NavLink tag={Link} to="/account">Account</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} to="/officer-profile">Profile</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} to="/add-loan">Add Loan</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} to="/my-loans">My Loans</NavLink>
                    </NavItem>
                  </>
                )}

                {user.role === 'admin' && (
                  <>
                    <NavItem>
                      <NavLink tag={Link} to="/officers-list">Dashboard</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} to="/applications">Applications</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} to="/approved-applications">Payments</NavLink>
                    </NavItem>
                  </>
                )}

                <NavItem>
                  <NavLink
                    tag={Link}
                    to="/"
                    onClick={() => {
                      localStorage.removeItem('token');
                      handleLogout();
                    }}
                  >
                    Logout
                  </NavLink>
                </NavItem>
              </>
            )}
          </Nav>
        </Collapse>
      </Navbar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="/customer-profile" element={<PrivateRoute permittedRoles={['customer']}><CustomerProfile /></PrivateRoute>} />
        <Route path="/officer-profile" element={<PrivateRoute permittedRoles={['officer']}><OfficerProfile /></PrivateRoute>} />
        <Route path="/add-loan" element={<PrivateRoute permittedRoles={['officer']}><AddLoan /></PrivateRoute>} />
        <Route path="/loan-list" element={<ListLoan />} />
        <Route path="/loan-detail/:id" element={<LoanDetails />} />
        <Route path="/apply/:id" element={<ApplicationForm />} />
        <Route path="/my-loans" element={<PrivateRoute permittedRoles={['officer']}><MyLoans /></PrivateRoute>} />
        <Route path="/api/loan/:loanId/edit" element={<EditLoan />} />
        <Route path="/api/loans/:id/view-applications" element={<LoanApplications />} />
       
        <Route path="/api/loans/:id/applications/:appId" element={<SingleApplication />} />

        <Route path="/officers-list" element={<PrivateRoute permittedRoles={['admin']}><UnverifiedOfficers /></PrivateRoute>} />
        <Route path="/applications" element={<PrivateRoute permittedRoles={['admin']}><AllApplications /></PrivateRoute>} />
        <Route path="/admin/applications/:appId" element={<PrivateRoute permittedRoles={['admin']}><SingleApplicationAdmin /></PrivateRoute>} />

        <Route path="/approved-applications" element={<PrivateRoute permittedRoles={['admin']}><ApprovedApplications/></PrivateRoute>} />
        <Route path= "/payments/:applicationId" element={<PrivateRoute permittedRoles={['admin']}><PaymentDetails/></PrivateRoute>}/>
        
        <Route path="/verify-payment/:applicationId" element={<PrivateRoute permittedRoles={['admin']}><VerifyOfflinePayment/></PrivateRoute>}/>
        
        <Route path="/payments" element={<PrivateRoute permittedRoles={['customer']}><PaymentLink /></PrivateRoute>} />
        <Route path="/offlinePayment" element={<PrivateRoute permittedRoles={['customer']}><OfflinePayment/></PrivateRoute>} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel/>} />
        <Route path="/verification-progress" element={<VerificationProgress />} />
        {email.length > 0 && <Route path="/reset-password" element={<ResetPassword />} />}
      </Routes>
    </>
  );
}

export default App;

// import React, { useState, useEffect } from 'react';
// import { Helmet } from 'react-helmet';
// import { Routes, Route, Link } from 'react-router-dom';
// import { Navbar, NavbarToggler, Collapse, Nav, NavItem, NavLink } from 'reactstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';
// import { useSelector } from 'react-redux';
// import axios from './config/axios';
// import { useAuth } from './context/AuthContext';

// import Home from './components/Home';
// import Register from './components/Register';
// import Login from './components/Login';
// import Account from './components/Account';
// import CustomerProfile from './components/CustomerProfile';
// import OfficerProfile from './components/OfficerProfile';
// import AddLoan from './components/AddLoan';
// import ListLoan from './components/ListLoans';
// import LoanDetails from './components/loanDetails';
// import MyLoans from './components/Myloans';
// import EditLoan from './components/EditLoan';
// import LoanApplications from './components/loanApplications';
// import ApplicationForm from './components/ApplicationForm';
// import SingleApplication from './components/singleApplication';
// import ResetPassword from './components/ResetPassword';
// import PrivateRoute from './components/PrivateRoute';
// import VerificationProgress from './components/VerificationProgress';
// import UnverifiedOfficers from './components/adminDashboard/AllOfficers';
// import AllApplications from './components/adminDashboard/AllApplications';
// import SingleApplicationAdmin from './components/adminDashboard/singleApplications';
// import PaymentLink from './components/payments/paymentLink';
// import Success from './components/payments/success';
// import Cancel from './components/payments/cancel';
// import OfflinePayment from './components/payments/offlinePayment';
// import ApprovedApplications from './components/adminDashboard/approvedApplications';
// import PaymentDetails from './components/adminDashboard/payments';
// import VerifyOfflinePayment from './components/adminDashboard/offlinePayment';
// import Unauthorized from './components/Unauthorized';


// function App() {
//   const { user, handleLogin, handleLogout } = useAuth();
//   const email = useSelector((state) => state.forgot.email);
//   const [isOpen, setIsOpen] = useState(false);

//   const toggle = () => setIsOpen(!isOpen);

//   useEffect(() => {
//     if (localStorage.getItem('token')) {
//       (async () => {
//         const response = await axios.get('/users/account', {
//           headers: {
//             Authorization: localStorage.getItem('token')
//           }
//         });
//         handleLogin(response.data);
//       })();
//     }
//   }, []);

//   return (
//     <>
//       <Helmet>
//         <title>MoneyMinder</title>
//         <link rel="icon" type="image/png" href={`${process.env.PUBLIC_URL}/life-line.ico`} sizes="16x16" />
//       </Helmet>

//       <Navbar color="primary" light expand="md" >
//         <NavbarToggler onClick={toggle} />
//         <Collapse isOpen={isOpen} navbar>
//           <Nav className="mr-auto" navbar>
//             <NavItem>
//               <NavLink tag={Link} to="/">Home</NavLink>
//             </NavItem>

//             <NavItem>
//               <NavLink tag={Link} to="/loan-list">Loans</NavLink>
//             </NavItem>

//             {!user ? (
//               <>
//                 <NavItem>
//                   <NavLink tag={Link} to="/register">Register</NavLink>
//                 </NavItem>
//                 <NavItem>
//                   <NavLink tag={Link} to="/login">Login</NavLink>
//                 </NavItem>
//               </>
//             ) : (
//               <>
//                 {user.role === 'customer' && (
//                   <>
//                     <NavItem>
//                       <NavLink tag={Link} to="/account">Account</NavLink>
//                     </NavItem>
//                     <NavItem>
//                       <NavLink tag={Link} to="/customer-profile">Profile</NavLink>
//                     </NavItem>
//                     <NavItem>
//                       <NavLink tag={Link} to="/payments">Payment</NavLink>
//                     </NavItem>
//                     <NavItem>
//                       <NavLink tag={Link} to="/offlinePayment">Offline-Payment</NavLink>
//                     </NavItem>
//                   </>
//                 )}

//                 {user.role === 'officer' && (
//                   <>
//                     <NavItem>
//                       <NavLink tag={Link} to="/account">Account</NavLink>
//                     </NavItem>
//                     <NavItem>
//                       <NavLink tag={Link} to="/officer-profile">Profile</NavLink>
//                     </NavItem>
//                     <NavItem>
//                       <NavLink tag={Link} to="/add-loan">Add Loan</NavLink>
//                     </NavItem>
//                     <NavItem>
//                       <NavLink tag={Link} to="/my-loans">My Loans</NavLink>
//                     </NavItem>
//                   </>
//                 )}

//                 {user.role === 'admin' && (
//                   <>
//                     <NavItem>
//                       <NavLink tag={Link} to="/officers-list">Dashboard</NavLink>
//                     </NavItem>
//                     <NavItem>
//                       <NavLink tag={Link} to="/applications">Applications</NavLink>
//                     </NavItem>
//                     <NavItem>
//                       <NavLink tag={Link} to="/approved-applications">Payments</NavLink>
//                     </NavItem>
//                   </>
//                 )}

//                 <NavItem>
//                   <NavLink
//                     tag={Link}
//                     to="/"
//                     onClick={() => {
//                       localStorage.removeItem('token');
//                       handleLogout();
//                     }}
//                   >
//                     Logout
//                   </NavLink>
//                 </NavItem>
//               </>
//             )}
//           </Nav>
//         </Collapse>
//       </Navbar>

//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/account" element={<Account />} />
//         <Route path="/customer-profile" element={<PrivateRoute permittedRoles={['customer']}><CustomerProfile /></PrivateRoute>} />
//         <Route path="/officer-profile" element={<PrivateRoute permittedRoles={['officer']}><OfficerProfile /></PrivateRoute>} />
//         <Route path="/add-loan" element={<PrivateRoute permittedRoles={['officer']}><AddLoan /></PrivateRoute>} />
//         <Route path="/loan-list" element={<ListLoan />} />
//         <Route path="/loan-detail/:id" element={<LoanDetails />} />
//         <Route path="/apply/:id" element={<ApplicationForm />} />
//         <Route path="/my-loans" element={<PrivateRoute permittedRoles={['officer']}><MyLoans /></PrivateRoute>} />
//         <Route path="/api/loan/:loanId/edit" element={<EditLoan />} />
//         <Route path="/api/loans/:id/view-applications" element={<LoanApplications />} />
//         <Route path="/unauthorized" element={<Unauthorized />} />
//         <Route path="/api/loans/:id/applications/:appId" element={<SingleApplication />} />

//         <Route path="/officers-list" element={<PrivateRoute permittedRoles={['admin']}><UnverifiedOfficers /></PrivateRoute>} />
//         <Route path="/applications" element={<PrivateRoute permittedRoles={['admin']}><AllApplications /></PrivateRoute>} />
//         <Route path="/admin/applications/:appId" element={<PrivateRoute permittedRoles={['admin']}><SingleApplicationAdmin /></PrivateRoute>} />

//         <Route path="/approved-applications" element={<PrivateRoute permittedRoles={['admin']}><ApprovedApplications/></PrivateRoute>} />
//         <Route path= "/payments/:applicationId" element={<PrivateRoute permittedRoles={['admin']}><PaymentDetails/></PrivateRoute>}/>
        
//         <Route path="/verify-payment/:applicationId" element={<PrivateRoute permittedRoles={['admin']}><VerifyOfflinePayment/></PrivateRoute>}/>
        
//         <Route path="/payments" element={<PrivateRoute permittedRoles={['customer']}><PaymentLink /></PrivateRoute>} />
//         <Route path="/offlinePayment" element={<PrivateRoute permittedRoles={['customer']}><OfflinePayment/></PrivateRoute>} />
//         <Route path="/success" element={<Success />} />
//         <Route path="/cancel" element={<Cancel/>} />
//         <Route path="/verification-progress" element={<VerificationProgress />} />
//         {email.length > 0 && <Route path="/reset-password" element={<ResetPassword />} />}
//       </Routes>
//     </>
//   );
// }

// export default App;
