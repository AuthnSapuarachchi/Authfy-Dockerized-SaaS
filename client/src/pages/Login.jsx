import React, { useContext, useState } from 'react';
import Menubar from '../components/Menubar.jsx';
import axios from 'axios';
import { AppContext } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
    const [isCreateAccount, setIsCreateAccount] = useState(false);
    const [validated, setValidated] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { backendUrl , getUserData } = useContext(AppContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidated(true);

        // Simple frontend validation
        if (!email || !password || (isCreateAccount && !name)) {
            toast.error("Please fill all required fields.");
            return;
        }

        axios.defaults.withCredentials = true;
        setLoading(true);

        try {
            if (isCreateAccount) {
                // ✅ Registration logic
                const response = await axios.post(`${backendUrl}/register`, {
                    name,
                    email,
                    password,
                });

                if (response.status === 201 || response.status === 200) {
                    toast.success("Account created successfully!");
                    setIsCreateAccount(false); // Switch to login mode
                    setName('');
                    setEmail('');
                    setPassword('');
                } else {
                    toast.error(response.data.message || "Registration failed.");
                }
            } else {
                // ✅ Login logic
                const response = await axios.post(`${backendUrl}/login`, {
                    email,
                    password,
                });

                if (response.status === 200) {
                    toast.success("Login successful!");
                    getUserData();
                    navigate('/'); // redirect to home/dashboard
                } else {
                    toast.error(response.data.message || "Login failed.");
                }
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Something went wrong.";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                minHeight: '100vh',
            }}
        >
            <Menubar />
            <div className="d-flex align-items-center justify-content-center py-5 px-3">
                <div
                    className="card shadow-sm p-4"
                    style={{ maxWidth: '400px', width: '100%', backgroundColor: 'white' }}
                >
                    <h2 className="text-center mb-4 fw-bold text-primary">
                        {isCreateAccount ? 'Create Account' : 'Login'}
                    </h2>

                    <form
                        noValidate
                        className={validated ? 'was-validated' : ''}
                        onSubmit={handleSubmit}
                    >
                        {isCreateAccount && (
                            <div className="mb-3">
                                <label htmlFor="fullName" className="form-label">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="fullName"
                                    placeholder="Enter Full Name"
                                    required
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                />
                                <div className="invalid-feedback">
                                    Please provide your full name.
                                </div>
                            </div>
                        )}

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email or Username
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter email or username"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                            <div className="invalid-feedback">
                                Please provide a valid email or username.
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter password"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                            <div className="invalid-feedback">
                                Please enter your password.
                            </div>
                        </div>

                        {!isCreateAccount && (
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="rememberMe"
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="rememberMe"
                                    >
                                        Remember me
                                    </label>
                                </div>
                                <a href="#!" className="small text-decoration-none">
                                    Forgot password?
                                </a>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary w-100 mb-3 rounded-pill"
                            disabled={loading}
                        >
                            {loading
                                ? 'Please wait...'
                                : isCreateAccount
                                    ? 'Create Account'
                                    : 'Sign In'}
                        </button>

                        <div className="text-center">
                            <p className="mb-0">
                                {isCreateAccount
                                    ? 'Already have an account? '
                                    : "Don’t have an account? "}
                                <button
                                    type="button"
                                    className="btn btn-link text-primary text-decoration-none p-0"
                                    onClick={() => setIsCreateAccount(!isCreateAccount)}
                                    disabled={loading}
                                >
                                    {isCreateAccount ? 'Login' : 'Sign Up'}
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
