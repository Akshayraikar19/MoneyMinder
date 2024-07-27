import React, { useState, useEffect } from "react";
import axios from "../config/axios";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function LoanApplications() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loanApplications, setLoanApplications] = useState([]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get(`/api/loans/${id}/applications`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                setLoanApplications(response.data);
            } catch (error) {
                console.error("Error fetching loan applications:", error);
            }
        };
        fetchApplications();
    }, [id]);

    const handleClick = (loanId, appId) => {
        navigate(`/api/loans/${loanId}/applications/${appId}`);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Loan Applications</h2>
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loanApplications.map((application) => (
                            <tr key={application._id}>
                                <td>
                                    <Link to={`/api/loans/${application.loan}/applications/${application._id}`}>
                                        {application?.customer.username}
                                    </Link>
                                </td>
                                <td>{application.amount}</td>
                                <td>{application.status}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handleClick(application.loan, application._id)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {loanApplications.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center">No applications found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
