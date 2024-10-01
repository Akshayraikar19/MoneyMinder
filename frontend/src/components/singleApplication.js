import React, { useState, useEffect } from "react";
import axios from "../config/axios";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";


const SingleApplication = () => {
    const { id, appId } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [status, setStatus] = useState("");
    const [rejectedReason, setRejectedReason] = useState("");
    const [hasUpdated, setHasUpdated] = useState(false);
  
    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const response = await axios.get(`/api/loans/${id}/applications/${appId}`, {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                });
                setApplication(response.data);
                setHasUpdated(response.data.status !== 'pending');
            } catch (error) {
                console.error('Error fetching application details:', error);
            }
        };
        fetchApplication();
    }, [id, appId]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            if (hasUpdated) {
                toast.error("You have already updated the status of this application.");
                return;
            }

            const response = await axios.put(`/api/loans/${id}/applications/${appId}/status`, {
                status,
                rejectedReason,
            }, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });

            if (response.data.errors) {
                toast.error(response.data.errors.map(error => error.msg).join("\n"));
                return;
            }

            toast.success('Application status updated successfully.');
            navigate('/my-loans')
            setHasUpdated(true);
        } catch (error) {
            console.error('Error updating application status:', error);
        }
    };

    if (!application) {
        return <div>Loading...</div>;
    }

    const {
        customerProfile: {
            firstName,
            lastName,
            dateOfBirth,
            address,
            pincode,
            profilePic,
            aadhaarNumber,
            panNumber,
            aadhaarPhoto,
            panPhoto,
            isVerified
        },
        status: currentStatus
    } = application;

    return (
        <div className="container" style={{ backgroundColor: "#f0f0f0", padding: "20px" }}>
            <h1 className="my-4 text-center">Application Details</h1>
            <div className="card mb-4">
                <div className="card-body">
                    <h2 className="card-title">Customer Details</h2>
                    <div className="row">
                        <div className="col-md-3">
                            <img     src={profilePic} alt="Profile" className="img-fluid" style={{ maxWidth: '150px', maxHeight: '150px' }}/>
                        </div>
                        <div className="col-md-9">
                            <p><strong>Name:</strong> {firstName} {lastName}</p>
                            <p><strong>Date of Birth:</strong> {format(new Date(dateOfBirth), 'dd/MM/yyyy')}</p>
                            <p><strong>Address:</strong> {address}</p>
                            <p><strong>Pincode:</strong> {pincode}</p>
                            <p><strong>Aadhaar Number:</strong> {aadhaarNumber}</p>
                            <img  src={aadhaarPhoto} alt="Aadhaar"  className="img-fluid" style={{ maxWidth: '150px', maxHeight: '150px' }} />
                            <p><strong>PAN Number:</strong> {panNumber}</p>
                            <img  src={panPhoto} alt="PAN" className="img-fluid" style={{ maxWidth: '150px', maxHeight: '150px' }} />
                            <p><strong>Verified:</strong> {isVerified ? "Yes" : "No"}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card mb-4">
                <div className="card-body">
                    <h2 className="card-title">Application Status</h2>
                    <p><strong>Current Status:</strong> {currentStatus}</p>
                </div>
            </div>
            <div className="card mb-4">
                <div className="card-body">
                    <h2 className="card-title">Update Application Status</h2>
                    <form onSubmit={handleUpdate}>
                        <div className="form-group">
                            <label>Status:</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-control">
                                <option value="">Select Status</option>
                                <option value="approvedByOfficer">Approve</option>
                                <option value="rejected">Reject</option>
                            </select>
                        </div>
                        {status === "rejected" && (
                            <div className="form-group">
                                <label>Reason for Rejection:</label>
                                <textarea
                                    value={rejectedReason}
                                    onChange={(e) => setRejectedReason(e.target.value)}
                                    className="form-control"
                                ></textarea>
                            </div>
                        )}
                        <button type="submit" className="btn btn-primary">Update</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SingleApplication;
