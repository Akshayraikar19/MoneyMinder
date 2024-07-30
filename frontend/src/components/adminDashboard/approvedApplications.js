// import {useState, useEffect} from "react"
// import axios from "../../config/axios"
// import {format} from "date-fns"
// import {toast} from "react-toastify"
// import { useNavigate } from "react-router-dom"



// export default function ApprovedApplications() {
//     const navigate = useNavigate()
//     const[applications, setApplications] = useState([])

//     useEffect(() => {
//         const fetchApprovedApplications = async () => {
//             try{
//                 const response = await axios.get('/admin/approved/applications', {
//                     headers: {
//                         Authorization: localStorage.getItem('token')
//                     },
//                 });
//                 console.log(response.data)
//                 setApplications(response.data)
//             }catch(error) {
//                 //console.log('Error fetching approved applications:', error)
//                 toast.error('Failed to fetch approved applications');
//             }
//         };
//         fetchApprovedApplications()
//     },[])


//     const handleViewDetails = (applicationId) => {
//         navigate(`/payments/${applicationId}`);
//     };
    

//     const handleVerifyPayment = (applicationId) => {
//         navigate(`/verify-payment/${applicationId}`);
//     };
    
//     return (
//         <div className="container" style={{ backgroundColor: "#f0f0f0", padding: "20px" }}>
//             <h1 className="my-4 text-center">Approved Applications </h1>
//             {applications.length === 0 ? ( //if there are no applications then,
//                 <p className="text-center">No approved applications found</p>
//             ) : (
//                 <table className="table table-striped">
//                     <thead>
//                         <tr>
//                             <th>Customer Name</th>
//                             <th>Approved Date</th>
//                             <th>Amount</th>
//                             <th>Duration(months)</th>
//                             <th>Next EMi</th>
//                             <th>Payments</th>
//                             <th>OfflinePayment</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {applications.map(application => (
//                             <tr key={application._id}>
//                                 <td>{application.customerProfile.firstName} {application.customerProfile.lastName}</td>
//                                 <td>{format(new Date(application.adminApprovedDate), 'dd/MM/yyyy')}</td>
//                                 <td>{application.amount}</td>
//                                 <td>{application.duration}</td>
//                                 <td>{format(new Date(application.nextEmiDueDate),'dd/MM/yyyy' )}</td>
//                                 <td>
//                                 <button
//                                         className="btn btn-primary"
//                                           onClick={() => handleViewDetails(application._id)}
//                                     >
//                                         View Details
//                                 </button>
//                                 </td>
//                                 <td>
//                                     <button
//                                         className="btn btn-secondary"
//                                         onClick={() => handleVerifyPayment(application._id)}
//                                     >
//                                         Verify Payment
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}
//         </div>
//     );
// };



import { useState, useEffect } from "react";
import axios from "../../config/axios";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ApprovedApplications() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchApprovedApplications = async () => {
            try {
                const response = await axios.get('/admin/approved/applications', {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    },
                });
                console.log(response.data);
                setApplications(response.data);
            } catch (error) {
                toast.error('Failed to fetch approved applications');
            }
        };
        fetchApprovedApplications();
    }, []);

    const handleViewDetails = (applicationId) => {
        navigate(`/payments/${applicationId}`);
    };

    const handleVerifyPayment = (applicationId) => {
        navigate(`/verify-payment/${applicationId}`);
    };

    const formatDate = (date) => {
        if (!date) {
            return 'Date Not Available';
        }
        try {
            return format(new Date(date), 'dd/MM/yyyy');
        } catch (e) {
            console.error('Invalid date:', date);
            return 'Invalid Date';
        }
    };
    
    return (
        <div className="container" style={{ backgroundColor: "#f0f0f0", padding: "20px" }}>
            <h1 className="my-4 text-center">Approved Applications</h1>
            {applications.length === 0 ? (
                <p className="text-center">No approved applications found</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Approved Date</th>
                            <th>Amount</th>
                            <th>Duration (months)</th>
                            <th>Next EMI</th>
                            <th>Payments</th>
                            <th>Offline Payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map(application => (
                            <tr key={application._id}>
                                <td>{application.customerProfile.firstName} {application.customerProfile.lastName}</td>
                                <td>{formatDate(application.adminApprovedDate)}</td>
                                <td>{application.amount}</td>
                                <td>{application.duration}</td>
                                <td>{formatDate(application.nextEmiDueDate)}</td>
                                <td>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleViewDetails(application._id)}
                                    >
                                        View Details
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => handleVerifyPayment(application._id)}
                                    >
                                        Verify Payment
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}


