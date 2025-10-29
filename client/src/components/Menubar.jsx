import {assets} from "../assets/assets.js";
import {useNavigate} from "react-router-dom";

const Menubar = () => {

    const navigate =  useNavigate();

    return (
        <nav className="navbar bg-light shadow-sm d-flex justify-content-between align-items-center px-4 py-3">
            {/* Logo and Brand Name */}
            <div className="d-flex align-items-center" onClick={() => navigate('/') } style={{cursor: 'pointer'}}>
                <img src={assets.logo} className="img-fluid rounded" alt="logo" width={40} height={40} />
                <span className="navbar-brand mb-0 h4 ms-3 text-primary fw-semibold">AuthBuilder</span>
            </div>
            {/* Login Button */}
            <button className="btn btn-primary rounded-pill px-4 py-2 shadow-sm d-flex align-items-center"
            onClick={() => navigate('/login')}>
                Login <i className="bi bi-arrow-right ms-2"></i>
            </button>
        </nav>
    )
}

export default Menubar