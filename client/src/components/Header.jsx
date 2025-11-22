import {assets} from "../assets/assets.js";
import {useContext} from "react";
import {AppContext} from "../context/AppContext.jsx";
import {useNavigate} from "react-router-dom";

const Header = () => {
    const { userData } = useContext(AppContext);
    const navigate = useNavigate();

    return (
        <div
            className="text-center d-flex flex-column align-items-center justify-content-center py-5 px-3 bg-light rounded shadow-sm"
            style={{ minHeight: '80vh', maxWidth: '600px', margin: 'auto' }}
        >
            <img src={assets.loginhome} className="mb-4" alt="header" width={140} height={140} />

            <h5 className="fw-semibold mb-3 lh-base">
                Hey {userData ? userData.name : 'Builder'} <span role="img" aria-label="wave">🚀</span>,<br />
                Stop reinventing <span className="text-primary">Authentication</span>.<br />
                <span className="text-muted fs-6">Authfy handles your API keys and security so you can focus on shipping code.</span>
            </h5>

            <h1 className="fw-bold display-5 mb-4">
                Authentication, <span className="text-primary">Solved.</span>
            </h1>

            <p className="mb-4 text-secondary fs-5 px-3">
                Don't waste weeks building auth. Authfy gives you a drop-in secure backend for managing API keys. 
                Focus on your core product while we handle the <strong>cryptography, validation, and security headers</strong>.
            </p>

            <button className="btn btn-outline-dark rounded-pill px-4 py-2 shadow-sm"
             onClick={() => navigate("/login")}>
                Get Started
            </button>
        </div>

    )
}

export default Header;