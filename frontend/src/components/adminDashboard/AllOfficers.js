// import React, { useState, useEffect } from "react";
// import axios from "../../config/axios";
// import { toast } from "react-toastify";
// import { Line, Bar, Pie } from "react-chartjs-2";
// import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, ArcElement } from "chart.js";
// ChartJS.register(Title, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale,ArcElement );

// const UnverifiedOfficers = () => {
//     const [unverifiedOfficers, setUnverifiedOfficers] = useState([]);
//     const [verifiedOfficers, setVerifiedOfficers] = useState([]);
//     const [sanctions, setSanctions] = useState([]);
//     const [retentionRate, setRetentionRate] = useState(null);


//     useEffect(() => {
//         const fetchUnverifiedOfficers = async () => {
//             try {
//                 const response = await axios.get('/unverified-officers', {
//                     headers: {
//                         Authorization: localStorage.getItem('token'),
//                     },
//                 });
//                 setUnverifiedOfficers(response.data);
//             } catch (error) {
//                 console.error('Error fetching unverified officers:', error);
//             }
//         };

//         const fetchVerifiedOfficers = async () => {
//             try {
//                 const response = await axios.get('/verifiedOfficers', {
//                     headers: {
//                         Authorization: localStorage.getItem('token'),
//                     },
//                 });
//                 setVerifiedOfficers(response.data);
//             } catch (error) {
//                 console.error('Error fetching verified officers:', error);
//             }
//         };

//         const fetchLoanSanctions = async () => {
//             try {
//                 const response = await axios.get('/loans-sanctions', {
//                     headers: {
//                         Authorization: localStorage.getItem('token'),
//                     },
//                 });
//                 setSanctions(response.data);
//             } catch (error) {
//                 console.error('Error fetching loan sanctions:', error);
//             }
//         };

//         const fetchLoanRetentions = async () => {
//             try {
//                 const response = await axios.get('/loans-retentions', {
//                     headers: {
//                         Authorization: localStorage.getItem('token'),
//                     },
//                 });
//                 setRetentionRate(response.data.retentionRate);
//             } catch (error) {
//                 console.error('Error fetching loan retentions:', error);
//             }
//         };

//         fetchUnverifiedOfficers();
//         fetchVerifiedOfficers();
//         fetchLoanSanctions();
//         fetchLoanRetentions();
//     }, []);


//     const sanctionsChartData = {
//         labels: sanctions.map(sanction => `Month ${sanction._id.month}/${sanction._id.year}`),
//         datasets: [
//             {
//                 label: 'Loan Sanctions',
//                 data: sanctions.map(sanction => sanction.count),
//                 backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                 borderColor: 'rgba(75, 192, 192, 1)',
//                 borderWidth: 1,
//             },
//         ],
//     };

//     const retentionChartData = {
//         labels: ['Retention Rate'],
//         datasets: [
//             {
//                 label: 'Retention Rate (%)',
//                 data: [retentionRate || 0],
//                 backgroundColor: 'rgba(153, 102, 255, 0.2)',
//                 borderColor: 'rgba(153, 102, 255, 1)',
//                 borderWidth: 1,
//             },
//         ],
//     };


//     const handleVerify = async (userId) => {
//         try {
//             await axios.post('/verify-officer', { userId }, {
//                 headers: {
//                     Authorization: localStorage.getItem('token'),
//                 },
//             });
//             toast.success('Officer verified successfully');
//             setUnverifiedOfficers(unverifiedOfficers.filter(officer => officer._id !== userId));
//             setVerifiedOfficers([...verifiedOfficers, unverifiedOfficers.find(officer => officer._id === userId)]);
//         } catch (error) {
//             console.error('Error verifying officer:', error);
//             toast.error('Failed to verify officer');
//         }
//     };

//     const handleReject = async (userId) => {
//         try {
//             await axios.post('/reject-officer', { userId }, {
//                 headers: {
//                     Authorization: localStorage.getItem('token'),
//                 },
//             });
//             toast.success('Officer rejected successfully');
//             setUnverifiedOfficers(unverifiedOfficers.filter(officer => officer._id !== userId));
//         } catch (error) {
//             console.error('Error rejecting officer:', error);
//             toast.error('Failed to reject officer');
//         }
//     };

//     return (
//         <div className="container" style={{ backgroundColor: "#f0f0f0", padding: "20px" }}>
//             <h1 className="my-4 text-center">Officers Management</h1>
            
//             <div className="mb-4">
//                 <h2 className="text-center">Unverified Officers</h2>
//                 {unverifiedOfficers.length === 0 ? (
//                     <p className="text-center">No unverified officers found</p>
//                 ) : (
//                     <table className="table table-striped">
//                         <thead>
//                             <tr>
//                                 <th>Username</th>
//                                 <th>Email</th>
//                                 <th>PhoneNumber</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {unverifiedOfficers.map(officer => (
//                                 <tr key={officer._id}>
//                                     <td>{officer.username} </td>
//                                     <td>{officer.email}</td>
//                                     <td>{officer.phone}</td>
//                                     <td>
//                                         <button className="btn btn-success mr-2" onClick={() => handleVerify(officer._id)}>Verify</button>
//                                         <button className="btn btn-danger" onClick={() => handleReject(officer._id)}>Reject</button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>

//             <div>
//                 <h2 className="text-center">Verified Officers</h2>
//                 {verifiedOfficers.length === 0 ? (
//                     <p className="text-center">No verified officers found</p>
//                 ) : (
//                     <table className="table table-striped">
//                         <thead>
//                             <tr>
//                                 <th>Username</th>
//                                 <th>Email</th>
//                                 <th>PhoneNumber</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {verifiedOfficers.map(officer => (
//                                 <tr key={officer._id}>
//                                     <td>{officer.username} </td>
//                                     <td>{officer.email}</td>
//                                     <td>{officer.phone}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>

//             <div className="mb-4">
//                 <h2 className="text-center">Loan Sanctions</h2>
//                 <div style={{ width: "80%", margin: "0 auto" }}>
//                     <Bar data={sanctionsChartData} options={{ responsive: true }} />
//                 </div>
//             </div>

//             <div>
//                 <h2 className="text-center">Loan Retention Rate</h2>
//                 <div style={{ width: "80%", margin: "0 auto" }}>
//                     <Pie data={retentionChartData} options={{ responsive: true }} />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UnverifiedOfficers;



import React, { useState, useEffect } from "react";
import axios from "../../config/axios";
import { toast } from "react-toastify";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, ArcElement);

const UnverifiedOfficers = () => {
    const [unverifiedOfficers, setUnverifiedOfficers] = useState([]);
    const [verifiedOfficers, setVerifiedOfficers] = useState([]);
    const [sanctions, setSanctions] = useState([]);
    const [retentionRate, setRetentionRate] = useState(null);

    useEffect(() => {
        const fetchUnverifiedOfficers = async () => {
            try {
                const response = await axios.get('/unverified-officers', {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                });
                setUnverifiedOfficers(response.data);
            } catch (error) {
                console.error('Error fetching unverified officers:', error);
            }
        };

        const fetchVerifiedOfficers = async () => {
            try {
                const response = await axios.get('/verifiedOfficers', {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                });
                setVerifiedOfficers(response.data);
            } catch (error) {
                console.error('Error fetching verified officers:', error);
            }
        };

        const fetchLoanSanctions = async () => {
            try {
                const response = await axios.get('/loans-sanctions', {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                });
                setSanctions(response.data);
            } catch (error) {
                console.error('Error fetching loan sanctions:', error);
            }
        };

        const fetchLoanRetentions = async () => {
            try {
                const response = await axios.get('/loans-retentions', {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                });
                setRetentionRate(response.data.retentionRate);
            } catch (error) {
                console.error('Error fetching loan retentions:', error);
            }
        };

        fetchUnverifiedOfficers();
        fetchVerifiedOfficers();
        fetchLoanSanctions();
        fetchLoanRetentions();
    }, []);

    const sanctionsChartData = {
        labels: sanctions.map(sanction => `Month ${sanction._id.month}/${sanction._id.year}`),
        datasets: [
            {
                label: 'Loan Sanctions',
                data: sanctions.map(sanction => sanction.count),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const retentionChartData = {
        labels: ['Retention Rate'],
        datasets: [
            {
                label: 'Retention Rate (%)',
                data: [retentionRate || 0],
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    const handleVerify = async (userId) => {
        try {
            await axios.post('/verify-officer', { userId }, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            toast.success('Officer verified successfully');
            setUnverifiedOfficers(unverifiedOfficers.filter(officer => officer._id !== userId));
            setVerifiedOfficers([...verifiedOfficers, unverifiedOfficers.find(officer => officer._id === userId)]);
        } catch (error) {
            console.error('Error verifying officer:', error);
            toast.error('Failed to verify officer');
        }
    };

    const handleReject = async (userId) => {
        try {
            await axios.post('/reject-officer', { userId }, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            toast.success('Officer rejected successfully');
            setUnverifiedOfficers(unverifiedOfficers.filter(officer => officer._id !== userId));
        } catch (error) {
            console.error('Error rejecting officer:', error);
            toast.error('Failed to reject officer');
        }
    };

    return (
        <div className="container" style={{ backgroundColor: "#f0f0f0", padding: "20px" }}>
            <h1 className="my-4 text-center">Officers Management</h1>
            
            <div className="mb-4">
                <h2 className="text-center">Unverified Officers</h2>
                {unverifiedOfficers.length === 0 ? (
                    <p className="text-center">No unverified officers found</p>
                ) : (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>PhoneNumber</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unverifiedOfficers.map(officer => (
                                <tr key={officer._id}>
                                    <td>{officer.username} </td>
                                    <td>{officer.email}</td>
                                    <td>{officer.phone}</td>
                                    <td>
                                        <button className="btn btn-success mr-2" onClick={() => handleVerify(officer._id)}>Verify</button>
                                        <button className="btn btn-danger" onClick={() => handleReject(officer._id)}>Reject</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div>
                <h2 className="text-center">Verified Officers</h2>
                {verifiedOfficers.length === 0 ? (
                    <p className="text-center">No verified officers found</p>
                ) : (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>PhoneNumber</th>
                            </tr>
                        </thead>
                        <tbody>
                            {verifiedOfficers.map(officer => (
                                <tr key={officer._id}>
                                    <td>{officer.username} </td>
                                    <td>{officer.email}</td>
                                    <td>{officer.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="mb-4">
                <h2 className="text-center">Loan Sanctions</h2>
                <div style={{ width: "80%", margin: "0 auto" }}>
                    <Bar data={sanctionsChartData} options={{ responsive: true }} />
                </div>
            </div>

            <div>
                <h2 className="text-center">Loan Retention Rate</h2>
                {/* <div style={{ width: "80%", maxWidth: "500px", margin: "0 auto" }}> */}
                <div style={{ width: "80%", maxWidth: "600px", height: "400px", margin: "0 auto" }}>
                    <Pie data={retentionChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
            </div>
        </div>
    );
};

export default UnverifiedOfficers;
