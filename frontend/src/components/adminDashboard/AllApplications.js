import {useState, useEffect} from "react"
import axios from "../../config/axios"
import {format} from "date-fns"
import {toast} from "react-toastify"
import { useNavigate } from "react-router-dom"



export default function AllApplications() {
    const navigate = useNavigate()
    const[applications, setApplications] = useState([])

    useEffect(() => {
        const fetchApprovedApplications = async () => {
            try{
                const response = await axios.get('/admin/applications', {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    },
                });
                console.log(response.data)
                setApplications(response.data)
            }catch(error) {
                //console.log('Error fetching approved applications:', error)
                toast.error('Failed to fetch approved applications');
            }
        };
        fetchApprovedApplications()
    },[])

    const handleViewDetails = (id) => {
        navigate(`/admin/applications/${id}`);
    };

    return (
        <div className="container" style={{ backgroundColor: "#f0f0f0", padding: "20px" }}>
            <h1 className="my-4 text-center">Approved Applications by Officer</h1>
            {applications.length === 0 ? ( //if there are no applications then,
                <p className="text-center">No approved applications found</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Application Date</th>
                            <th>Loan Type</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map(application => (
                            <tr key={application._id}>
                                <td>{application.customerProfile.firstName} {application.customerProfile.lastName}</td>
                                <td>{format(new Date(application.createdAt), 'dd/MM/yyyy')}</td>
                                <td>{application.loan.type}</td>
                                <td>{application.amount}</td>
                                <td>{application.status}</td>
                                <td>
                                <button
                                        className="btn btn-primary"
                                        onClick={() => handleViewDetails(application._id)}
                                    >
                                        View Details
                                </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
