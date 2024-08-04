import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { useAuth } from "../context/AuthContext";
import {toast} from "react-toastify"

export default function LoanDetails() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const [loan, setLoan] = useState(null);
    const [hasApplied, setHasApplied] = useState(false);
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showApplicationStatus, setShowApplicationStatus] = useState(false);
    const [rejectedReason, setRejectedReason] = useState('');
    const [nextEmiDueDate, setNextEmiDueDate] = useState('');

    useEffect(() => {
        const fetchLoanDetails = async () => {
            try {
                const response = await axios.get(`/api/loans/${id}`);
                setLoan(response.data);
            } catch (err) {
                alert("Error fetching loan details");
            } finally {
                setLoading(false);
            }
        };
        fetchLoanDetails();
    }, [id]);

    useEffect(() => {
        const checkApplicationStatus = async () => {
            try {
                const response = await axios.get(`/api/loans/check/${id}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                if (response.data.applied) {
                    setHasApplied(true);
                    setApplication(response.data.application);
                    if (response.data.application.status === 'rejected') {
                        setRejectedReason(response.data.application.rejectedReason);
                    }
                    if (response.data.application.nextEmiDueDate) {
                        setNextEmiDueDate(response.data.application.nextEmiDueDate);
                    }
                }
            } catch (err) {
                console.error("Error checking application status:", err);
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            checkApplicationStatus();
        } else {
            setLoading(false);
        }
    }, [id, user]);

    const handleApply = () => {
        navigate(`/apply/${id}`);
    };

    const handleCheckStatus = async () => {
        try {
            const response = await axios.get(`/api/loans/check/${id}`, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            if (response.data) {
                setApplication(response.data.application);
                setShowApplicationStatus(true);
                if (response.data.application.status === 'rejected') {
                    setRejectedReason(response.data.application.rejectedReason);
                }
                if (response.data.application.nextEmiDueDate) {
                    setNextEmiDueDate(response.data.application.nextEmiDueDate);
                }
            }
        } catch (err) {
            console.error("Error checking application status:", err);
        }
    };

    const handleSetEmiDueDate = async () => {
        if (!nextEmiDueDate) {
            toast.error('please select a valid dueDate')
            return;
        }
    
        try {
            const response = await axios.post(`/setEmiDueDate/${application._id}`, {
                nextEmiDueDate,
            }, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            // alert(response.data.message);
            toast.success('Duedate successfully set')
             setApplication(response.data.application);
        } catch (err) {
            console.error("Error setting EMI due date:", err);
            alert("Failed to set EMI due date");
        }
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    {loan ? (
                        <div className="card shadow-sm">
                            <div className="card-body text-center">
                                <h2 className="card-title">{loan.type}</h2>
                                <p className="card-text"><strong>Description:</strong> {loan.description}</p>
                                <p className="card-text"><strong>Rate Of Interest(%):</strong> {loan.interestRate}</p>
                                {user ? (
                                    user.role === 'customer' ? (
                                        hasApplied ? (
                                            <div>
                                                <p className="card-text">You have already applied for this loan.</p>
                                                {showApplicationStatus && application && (
                                                    <div className="mt-4 border p-3">
                                                        <h5 className="mb-3">Application Status:</h5>
                                                        <p><strong>Status:</strong> {application.status}</p>
                                                        {application.status === 'rejected' && (
                                                            <div>
                                                                <p className="mt-2"><strong>Rejected Reason:</strong> {rejectedReason}</p>
                                                            </div>
                                                        )}
                                                        <p><strong>Amount:</strong> {application.amount}</p>
                                                        <p><strong>Duration:</strong> {application.duration} months</p>
                                                        <p><strong>EMI:</strong> {application.emi}</p>
                                                        {application.status === 'approvedByAdmin' && !application.nextEmiDueDate && (
                                                            <div>
                                                                <label htmlFor="nextEmiDueDate">Select EMI Due Date:</label>
                                                                <input type="date" id="nextEmiDueDate" value={nextEmiDueDate} onChange={(e) => setNextEmiDueDate(e.target.value)} />
                                                                <button className="btn btn-primary mt-3" onClick={handleSetEmiDueDate}>Set EMI Due Date</button>
                                                            </div>
                                                        )}
                                                        {application.status === 'approvedByAdmin' && application.nextEmiDueDate && (
                                                            <div>
                                                                <p><strong>Next EMI Due Date:</strong> {new Date(application.nextEmiDueDate).toLocaleDateString()}</p>
                                                                <p className="text-info">Please pay the EMI by {new Date(application.nextEmiDueDate).toLocaleDateString()} to avoid late fees.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {!showApplicationStatus && (
                                                    <button className="btn btn-primary" onClick={handleCheckStatus}>Check Application Status</button>
                                                )}
                                            </div>
                                        ) : (
                                            <button className="btn btn-primary" onClick={handleApply}>Apply Now</button>
                                        )
                                    ) : (
                                        <p className="card-text">Please log in as a customer to apply for this loan.</p>
                                    )
                                ) : (
                                    <p className="card-text">Please log in to apply for this loan.</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
        </div>
    );
}
