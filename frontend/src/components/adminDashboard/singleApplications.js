import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

export default function SingleApplicationAdmin() {
    const { appId } = useParams();
    const [application, setApplication] = useState(null);
    const [action, setAction] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [statusUpdated, setStatusUpdated] = useState(false); // State to track status update
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const response = await axios.get(`/admin/applications/${appId}`, {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                });
                setApplication(response.data);
            } catch (error) {
                console.error('Error fetching application details:', error);
            }
        };
        fetchApplication();
    }, [appId]);

    const handleUpdate = async () => {
        // Check if action is not set
        if (!action) {
            toast.error('Please select an action (approve/reject)');
            return;
        }

        // Check if status is already updated
        if (statusUpdated) {
            toast.error('Application status already updated');
            return;
        }

        try {
            const updateResponse = await axios.put(
                `/admin/applications/${appId}/approve`,
                { action, reason: rejectionReason },
                {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                }
            );

            if (updateResponse.status === 200) {
                toast.success('Application updated successfully');
                setStatusUpdated(true); //status updated to true after successful update
                navigate('/admin/applications');
            } else {
                toast.error('Failed to update application');
            }
        } catch (error) {
            toast.error('Failed to update application');
        }
    };

    if (!application) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container" style={{ backgroundColor: "#f0f0f0", padding: "20px" }}>
            <h1 className="my-4 text-center">Application Details</h1>
            <table className="table table-striped">
                <tbody>
                    {application.customerProfile && (
                        <tr>
                            <th>Customer Name</th>
                            <td>{application.customerProfile.firstName} {application.customerProfile.lastName}</td>
                        </tr>
                    )}
                    {application.officer && (
                        <tr>
                            <th>Officer Name</th>
                            <td>{application.officer.firstName} {application.officer.lastName}</td>
                        </tr>
                    )}
                    <tr>
                        <th>Application Date</th>
                        <td>{format(new Date(application.createdAt), 'dd/MM/yyyy')}</td>
                    </tr>
                    <tr>
                        <th>Loan Type</th>
                        <td>{application.loan.type}</td>
                    </tr>
                    <tr>
                        <th>Amount</th>
                        <td>{application.amount}</td>
                    </tr>
                    <tr>
                        <th>Status</th>
                        <td>{application.status}</td>
                    </tr>
                    {application.status === 'rejectedByAdmin' && (
                        <tr>
                            <th>Rejection Reason</th>
                            <td>{application.rejectionReason}</td>
                        </tr>
                    )}
                    <tr>
                        <th>Aadhaar Photo</th>
                        <td>
                            <img src={application.customerProfile.aadhaarPhoto} alt="Aadhaar" style={{ width: "100px" }} />
                        </td>
                    </tr>
                    <tr>
                        <th>Pan Photo</th>
                        <td>
                            <img src={application.customerProfile.panPhoto} alt="PAN" style={{ width: "100px" }} />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="my-4">
                <label htmlFor="action">Action:</label>
                <select
                    id="action"
                    className="form-control"
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                >
                    <option value="">Select Action</option>
                    <option value="approve">Approve</option>
                    <option value="reject">Reject</option>
                </select>
            </div>
            {action === 'reject' && (
                <div className="my-4">
                    <label htmlFor="rejectionReason">Rejection Reason:</label>
                    <textarea
                        id="rejectionReason"
                        className="form-control"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                    />
                </div>
            )}
            <button className="btn btn-primary" onClick={handleUpdate}>Update Application</button>
        </div>
    );
}
