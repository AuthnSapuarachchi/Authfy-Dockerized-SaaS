import {assets} from "../assets/assets.js";
import {useContext} from "react";
import {AppContext} from "../context/AppContext.jsx";
import {useNavigate} from "react-router-dom";

const Header = () => {
    const { userData } = useContext(AppContext);
    const navigate = useNavigate();

    return (
        <div className="bg-light py-5">
            <div className="container" style={{ maxWidth: '1200px' }}>
                <div className="row align-items-center py-5">
                    {/* Left Content */}
                    <div className="col-lg-6 mb-4 mb-lg-0">
                        <div className="mb-3">
                            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                                <i className="bi bi-shield-check me-2"></i>
                                Secure Authentication
                            </span>
                        </div>
                        
                        <h1 className="display-4 fw-bold text-dark mb-3">
                            API Key Management<br />
                            <span className="text-primary">Made Simple</span>
                        </h1>
                        
                        <p className="lead text-muted mb-4">
                            Manage your API keys securely. Authfy handles authentication 
                            so you can focus on building your product.
                        </p>

                        <div className="d-flex gap-3 mb-4">
                            <button 
                                className="btn btn-primary btn-lg px-4"
                                onClick={() => navigate("/login")}
                            >
                                Get Started
                            </button>
                            <button 
                                className="btn btn-outline-secondary btn-lg px-4"
                                onClick={() => navigate("/dashboard")}
                            >
                                Dashboard
                            </button>
                        </div>

                        {userData && (
                            <p className="text-muted small">
                                Welcome back, <strong>{userData.name}</strong> 👋
                            </p>
                        )}
                    </div>

                    {/* Right Image */}
                    <div className="col-lg-6 text-center">
                        <div className="bg-white rounded-3 shadow-sm p-5 mx-auto" style={{ maxWidth: '400px' }}>
                            <img 
                                src={assets.loginhome} 
                                className="img-fluid mb-4" 
                                alt="Authfy" 
                                style={{ maxWidth: '180px' }}
                            />
                            <div className="text-start">
                                <div className="bg-light rounded p-3 mb-2">
                                    <small className="text-muted">API Key Example</small>
                                    <div className="mt-2">
                                        <code className="text-dark small">authfy_pk_abc123xyz...</code>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center text-success">
                                    <i className="bi bi-check-circle-fill me-2"></i>
                                    <small>Encrypted & Secure</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;