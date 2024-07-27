import axios from '../config/axios';
import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import {toast} from "react-toastify"


export default function MyJob() {
    const [loans, setLoans] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchLoans() {
            try {
                const response = await axios.get('/api/loans/my', {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                setLoans(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchLoans();
    }, []);

    const handleRemove = async (id) => {
        try {
            await axios.delete(`/api/loans/${id}`, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            const newArr = loans.filter(loan => loan._id !== id);
            toast.success("successfully loan removed")
            setLoans(newArr);
        } catch (err) {
            console.log(err.response.data);
        }
    };

    const handleClick = (id) => {
        navigate(`/api/loans/${id}/view-applications`);
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">My Loans</h2>
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>Loan Type</th>
                            <th>Description</th>
                            <th>Interest Rate (%)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map(loan => (
                            <tr key={loan._id}>
                                <td><Link to={`/api/loans/${loan._id}/view-applications`}>{loan.type}</Link></td>
                                <td>{loan.description}</td>
                                <td>{loan.interestRate}</td>
                                <td>
                                    <button 
                                        className="btn btn-danger btn-sm mr-2" 
                                        onClick={() => handleRemove(loan._id)}
                                    >
                                        Delete
                                    </button>
                                    <button 
                                        className="btn btn-info btn-sm mr-2" 
                                        onClick={() => handleClick(loan._id)}
                                    >
                                        View Applications
                                    </button>
                                    <Link to={`/api/loan/${loan._id}/edit`}>
                                        <button className="btn btn-primary btn-sm">Edit</button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
