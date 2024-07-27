// // import React, { useState, useEffect } from 'react';
// // import axios from '../config/axios';
// // import { useAuth } from '../context/AuthContext';

// // const Account = () => {
// //     const { user } = useAuth();
// //     const [profile, setProfile] = useState(null);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState(null);

// //     useEffect(() => {
// //         const fetchProfile = async () => {
// //             try {
// //                 const token = localStorage.getItem('token');
// //                 let response;

// //                 if (user.role === 'customer') {
// //                     response = await axios.get('/api/customers/profile', {
// //                         headers: { Authorization: token },
// //                         withCredentials: true  // Include credentials if needed
// //                     });
// //                 } else if (user.role === 'officer') {
// //                     response = await axios.get('/api/officers/profile', {
// //                         headers: { Authorization: token },
// //                         withCredentials: true  // Include credentials if needed
// //                     });
// //                 }

// //                 if (response && response.data) {
// //                     setProfile(response.data);
// //                 }
// //             } catch (err) {
// //                 setError(err.message || 'Error fetching profile');
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         if (user && user.role) {
// //             fetchProfile();
// //         }
// //     }, [user]);

// //     if (loading) {
// //         return <p>Loading...</p>;
// //     }

// //     if (error) {
// //         return <p>Error: {error}</p>;
// //     }

// //     if (!profile) {
// //         return <p>No profile created</p>;
// //     }

// //     return (
// //         <div>
// //             <h2>{`${profile.firstName} ${profile.lastName}`}</h2>
// //             {/* <p>Role: {user.role}</p> */}
// //             <p>Email: {user.email}</p>
// //             <p>Phone: {user.phone}</p>
// //             {user.role === 'customer' && (
// //                 <>
// //                     <p>Date of Birth: {profile.dateOfBirth}</p>
// //                     <p>Address: {profile.address}</p>
// //                     <p>Pincode: {profile.pincode}</p>
// //                     <p>Aadhaar Number: {profile.aadhaarNumber}</p>
// //                     <p>PAN Number: {profile.panNumber}</p>

// //                     <h4>Aadhaar:</h4>
// //                     <img src={`http://localhost:4444/${profile.aadhaarPhotoUrl}`} alt="Aadhaar" 
// //                     style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
                  
// //                     <h4>PAN:</h4>
// //                     <img src={`http://localhost:4444/${profile.panPhotoUrl}`} alt="PAN"
// //                      style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
                  
// //                 </>
// //             )}
// //             {user.role === 'officer' && (
// //                 <>
// //                     <p>Department: {profile.department}</p>
// //                     <p>Branch Location: {profile.branchLocation}</p>

// //                     <h4>Profile Picture:</h4>
// //                     <img
// //                         src={`http://localhost:4444/${profile.profilePic}`}
// //                         alt="Profile"
// //                         style={{ width: '150px', height: '150px', objectFit: 'cover' }}
// //                     />
// //                 </>
// //             )}
// //         </div>
// //     );
// // };

// // export default Account;


// // // import React, { useState, useEffect } from 'react';
// // // import axios from '../config/axios';
// // // import {useAuth} from '../context/AuthContext'

// // // const Account = () => {
// // //     const [profile, setProfile] = useState(null);
// // //     const [loading, setLoading] = useState(true);
// // //     const [error, setError] = useState(null);
// // //     const {user} = useAuth()

// // //     useEffect(() => {
// // //         const fetchProfile = async () => {
// // //             try {
// // //                 const token = localStorage.getItem('token');
// // //                 const response = await axios.get('/api/officers/profile', {
// // //                     headers: { Authorization: token },
// // //                     withCredentials: true
// // //                 });
// // //                 // Handle successful response
// // //                 console.log('Profile data:', response.data);
// // //                 setProfile(response.data);
// // //             } catch (error) {
// // //                 console.error('Error fetching profile:', error.message);
// // //                 setError('Failed to fetch profile');
// // //             } finally {
// // //                 setLoading(false);
// // //             }
// // //         };

// // //         fetchProfile(); // Call the fetchProfile function when component mounts

// // //     }, [user]); // Empty dependency array ensures this effect runs only once on mount

// // //     if (loading) {
// // //         return <p>Loading...</p>;
// // //     }

// // //     if (error) {
// // //         return <p>Error: {error}</p>;
// // //     }

// // //     return (
// // //         <div>
// // //             <h2>{`${profile.firstName} ${profile.lastName}`}</h2>
// // //             <p>Department: {profile.department}</p>
// // //             <p>Branch Location: {profile.branchLocation}</p>
// // //             {profile.profilePic ? (
// // //                 <div>
// // //                     <h4>Profile Picture:</h4>
// // //                     <img
// // //     src={`http://localhost:4444/${profile.profilePic}`} // Assuming '/uploads' is the correct path on the server
// // //     alt="Profile"
// // //     style={{ width: '150px', height: '150px', objectFit: 'cover' }}
// // // />


// // //                 </div>
// // //             ) : (
// // //                 <p>No profile picture found.</p>
// // //             )}
// // //         </div>
// // //     );
// // // };

// // // export default Account;






// import React, { useState, useEffect } from 'react';
// import axios from '../config/axios';
// import images from '../assets/images/images.jpg'
// import { useAuth } from '../context/AuthContext';
// import { Container, Row, Col, Card, CardBody, CardImg, CardText, CardTitle } from 'reactstrap';

// const Account = () => {
//   const { user } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         let response;

//         if (user.role === 'customer') {
//           response = await axios.get('/api/customers/profile', {
//             headers: { Authorization: token },
//             withCredentials: true // Include credentials if needed
//           });
//         } else if (user.role === 'officer') {
//           response = await axios.get('/api/officers/profile', {
//             headers: { Authorization: token },
//             withCredentials: true // Include credentials if needed
//           });
//         }

//         if (response && response.data) {
//           setProfile(response.data);
//         }
//       } catch (err) {
//         setError(err.message || 'Error fetching profile');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user && user.role) {
//       fetchProfile();
//     }
//   }, [user]);

//   return (
//     <section className="vh-100 d-flex align-items-center" style={{
//       backgroundImage: `url(${images})`,
//       backgroundColor: '#f4f5f7',
//       backgroundSize: 'cover',
//       backgroundPosition: 'center center',
//       padding: '100px 50px',
//     }}>
//       <Container className="py-5">
//         <Row className="justify-content-center">
//           <Col lg="8" md="10" className="mb-4">
//             {loading ? (
//               <p>Loading...</p>
//             ) : profile ? (
//               <Card className="mb-4" style={{ borderRadius: '.5rem' }}>
//                 <Row className="g-0">
//                   <Col md="4" className="gradient-custom text-center text-white"
//                     style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
//                     <CardImg
//                       src={`http://localhost:4444/${profile.profilePic || profile.aadhaarPhoto || profile.panPhoto}`}
//                       alt="Avatar"
//                       className="my-5 img-fluid"
//                       style={{ width: '120px', borderRadius: '50%' }}
//                     />
//                     <CardTitle tag="h5">{`${profile.firstName} ${profile.lastName}`}</CardTitle>
//                     <CardText>{user.role}</CardText>
//                   </Col>

//                   <Col md="8">
//                     <CardBody className="p-4">
//                       <CardTitle tag="h6">Information</CardTitle>
//                       <hr className="mt-0 mb-4" />
//                       <Row className="pt-1">
//                         <Col sm="6" className="mb-3">
//                           <CardTitle tag="h6">First Name</CardTitle>
//                           <CardText className="text-muted">{profile.firstName}</CardText>
//                         </Col>
//                         <Col sm="6" className="mb-3">
//                           <CardTitle tag="h6">Last Name</CardTitle>
//                           <CardText className="text-muted">{profile.lastName}</CardText>
//                         </Col>
//                         <Col sm="6" className="mb-3">
//                           <CardTitle tag="h6">Email</CardTitle>
//                           <CardText className="text-muted">{user.email}</CardText>
//                         </Col>
//                         <Col sm="6" className="mb-3">
//                           <CardTitle tag="h6">Phone</CardTitle>
//                           <CardText className="text-muted">{user.phone}</CardText>
//                         </Col>
//                       </Row>
//                       {user.role === 'customer' && (
//                         <>
//                           <CardTitle tag="h6">Customer Details</CardTitle>
//                           <hr className="mt-0 mb-4" />
//                           <Row className="pt-1">
//                             <Col sm="6" className="mb-3">
//                               <CardTitle tag="h6">Date of Birth</CardTitle>
//                               <CardText className="text-muted">{profile.dateOfBirth}</CardText>
//                             </Col>
//                             <Col sm="6" className="mb-3">
//                               <CardTitle tag="h6">Address</CardTitle>
//                               <CardText className="text-muted">{profile.address}</CardText>
//                             </Col>
//                             <Col sm="6" className="mb-3">
//                               <CardTitle tag="h6">Pincode</CardTitle>
//                               <CardText className="text-muted">{profile.pincode}</CardText>
//                             </Col>
//                             <Col sm="6" className="mb-3">
//                               <CardTitle tag="h6">Aadhaar Number</CardTitle>
//                               <CardText className="text-muted">{profile.aadhaarNumber}</CardText>
//                             </Col>
//                             <Col sm="6" className="mb-3">
//                               <CardTitle tag="h6">PAN Number</CardTitle>
//                               <CardText className="text-muted">{profile.panNumber}</CardText>
//                             </Col>
//                             <Col sm="6" className="mb-3">
//                               <CardTitle tag="h6">Aadhaar Photo</CardTitle>
//                               <CardImg
//                                 src={`http://localhost:4444/${profile.aadhaarPhoto}`}
//                                 alt="Aadhaar"
//                                 style={{ width: '120px', height: '120px', objectFit: 'cover' }}
//                               />
//                             </Col>
//                             <Col sm="6" className="mb-3">
//                               <CardTitle tag="h6">PAN Photo</CardTitle>
//                               <CardImg
//                                 src={`http://localhost:4444/${profile.panPhoto}`}
//                                 alt="PAN"
//                                 style={{ width: '120px', height: '120px', objectFit: 'cover' }}
//                               />
//                             </Col>
//                           </Row>
//                         </>
//                       )}
//                       {user.role === 'officer' && (
//                         <>
//                           <CardTitle tag="h6">Work Information</CardTitle>
//                           <hr className="mt-0 mb-4" />
//                           <Row className="pt-1">
//                             <Col sm="6" className="mb-3">
//                               <CardTitle tag="h6">Department</CardTitle>
//                               <CardText className="text-muted">{profile.department}</CardText>
//                             </Col>
//                             <Col sm="6" className="mb-3">
//                               <CardTitle tag="h6">Branch Location</CardTitle>
//                               <CardText className="text-muted">{profile.branchLocation}</CardText>
//                             </Col>
//                           </Row>
//                         </>
//                       )}
//                     </CardBody>
//                   </Col>
//                 </Row>
//               </Card>
//             ) : (
//               <p>No profile created.</p>
//             )}
//           </Col>
//         </Row>
//       </Container>
//     </section>
//   );
// };

// export default Account;



import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import images from '../assets/images/images.jpg'
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, CardBody, CardImg, CardText, CardTitle } from 'reactstrap';
import { format } from 'date-fns';

const Account = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        let response;

        if (user.role === 'customer') {
          response = await axios.get('/api/customers/profile', {
            headers: { Authorization: token },
            withCredentials: true // Include credentials if needed
          });
        } else if (user.role === 'officer') {
          response = await axios.get('/api/officers/profile', {
            headers: { Authorization: token },
            withCredentials: true // Include credentials if needed
          });
        }

        if (response && response.data) {
          setProfile(response.data);
        }
      } catch (err) {
        setError(err.message || 'Error fetching profile');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role) {
      fetchProfile();
    }
  }, [user]);

  return (
    <section className="vh-100 d-flex align-items-center" style={{
      backgroundImage: `url(${images})`,
      backgroundColor: '#f4f5f7',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      padding: '100px 50px',
    }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg="8" md="10" className="mb-4">
            {loading ? (
              <p>Loading...</p>
            ) : profile ? (
              <Card className="mb-4" style={{ borderRadius: '.5rem' }}>
                <Row className="g-0">
                  <Col md="4" className="gradient-custom text-center text-white"
                    style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                    <CardImg
                      src={profile.profilePic} alt="Profile" 
                      className="my-5 img-fluid"
                      style={{ width: '120px', borderRadius: '50%' }}
                    />
                    <CardTitle tag="h5">{`${profile.firstName} ${profile.lastName}`}</CardTitle>
                    <CardText>{user.role}</CardText>
                  </Col>

                  <Col md="8">
                    <CardBody className="p-4">
                      <CardTitle tag="h6">Information</CardTitle>
                      <hr className="mt-0 mb-4" />
                      <Row className="pt-1">
                        <Col sm="6" className="mb-3">
                          <CardTitle tag="h6">First Name</CardTitle>
                          <CardText className="text-muted">{profile.firstName}</CardText>
                        </Col>
                        <Col sm="6" className="mb-3">
                          <CardTitle tag="h6">Last Name</CardTitle>
                          <CardText className="text-muted">{profile.lastName}</CardText>
                        </Col>
                        <Col sm="6" className="mb-3">
                          <CardTitle tag="h6">Email</CardTitle>
                          <CardText className="text-muted">{user.email}</CardText>
                        </Col>
                        <Col sm="6" className="mb-3">
                          <CardTitle tag="h6">Phone</CardTitle>
                          <CardText className="text-muted">{user.phone}</CardText>
                        </Col>
                      </Row>
                      {user.role === 'customer' && (
                        <>
                          <CardTitle tag="h6">Customer Details</CardTitle>
                          <hr className="mt-0 mb-4" />
                          <Row className="pt-1">
                            <Col sm="6" className="mb-3">
                              <CardTitle tag="h6">Date of Birth</CardTitle>
                              <CardText className="text-muted">{format(new Date(profile.dateOfBirth), 'MMMM dd, yyyy')}</CardText>
                            </Col>
                            <Col sm="6" className="mb-3">
                              <CardTitle tag="h6">Address</CardTitle>
                              <CardText className="text-muted">{profile.address}</CardText>
                            </Col>
                            <Col sm="6" className="mb-3">
                              <CardTitle tag="h6">Pincode</CardTitle>
                              <CardText className="text-muted">{profile.pincode}</CardText>
                            </Col>
                            <Col sm="6" className="mb-3">
                              <CardTitle tag="h6">Aadhaar Number</CardTitle>
                              <CardText className="text-muted">{profile.aadhaarNumber}</CardText>
                            </Col>
                            <Col sm="6" className="mb-3">
                              <CardTitle tag="h6">PAN Number</CardTitle>
                              <CardText className="text-muted">{profile.panNumber}</CardText>
                            </Col>
                            <Col sm="6" className="mb-3">
                              <CardTitle tag="h6">Aadhaar Photo</CardTitle>
                              <CardImg
                                  src={profile.aadhaarPhoto} alt="Aadhaar" 
                                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                              />
                            </Col>
                            <Col sm="6" className="mb-3">
                              <CardTitle tag="h6">PAN Photo</CardTitle>
                              <CardImg
                                src={profile.panPhoto} alt="PAN"
                                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                              />
                            </Col>
                          </Row>
                        </>
                      )}
                      {user.role === 'officer' && (
                        <>
                          <CardTitle tag="h6">Officer Details</CardTitle>
                          <hr className="mt-0 mb-4" />
                          <Row className="pt-1">
                            <Col sm="6" className="mb-3">
                              <CardTitle tag="h6">Department</CardTitle>
                              <CardText className="text-muted">{profile.department}</CardText>
                            </Col>
                            <Col sm="6" className="mb-3">
                              <CardTitle tag="h6">Branch Location</CardTitle>
                              <CardText className="text-muted">{profile.branchLocation}</CardText>
                            </Col>
                            <Col sm="6" className="mb-3">
                              <CardTitle tag="h6">Aadhaar Photo</CardTitle>
                              <CardImg
                                  src={profile.aadhaarPhoto} alt="Aadhaar" 
                                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                              />
                            </Col>
                            <Col sm="6" className="mb-3">
                              <CardTitle tag="h6">PAN Photo</CardTitle>
                              <CardImg
                                src={profile.panPhoto} alt="PAN"
                                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                              />
                            </Col>
                          </Row>
                        </>
                      )}
                    </CardBody>
                  </Col>
                </Row>
              </Card>
            ) : (
              <p>No profile created.</p>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Account;
