import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const Menubar = () => {
    const navigate = useNavigate();
    const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // ✅ Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ✅ Logout Logic
    const handleLogout = async () => {
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.post(`${backendUrl}/logout`);
            if (response.status === 200) {
                setIsLoggedIn(false);
                setUserData(null);
                toast.success("Logged out successfully!");
                navigate("/");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Logout failed. Please try again.");
            console.error("Logout error:", error);
        }
    };

    const sendVerifyEmail = async () => {
        try {
            axios.defaults.withCredentials = true; // if backend needs cookies/auth
            const response = await axios.post(`${backendUrl}/send-verify-otp`);
            if (response.status === 200) {
                toast.success("Verification email sent successfully!");
                navigate("/email-verify");
            } else {
                toast.error("Failed to send verification email.");
            }
        } catch (error) {
            toast.error("An error occurred while sending verification email.");
            console.error("sendVerifyEmail error:", error);
        }
    };

    return (
        <nav
            className="navbar bg-light shadow-sm py-3 px-4 d-flex justify-content-between align-items-center"
            style={{
                borderBottom: "1px solid #e9ecef",
                position: "sticky",
                top: 0,
                zIndex: 1050,
            }}
        >
            {/* 🔹 Logo + Brand */}
            <div
                className="d-flex align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
            >
                <img
                    src={assets.logo}
                    alt="logo"
                    className="img-fluid rounded"
                    width={42}
                    height={42}
                />
                <span className="navbar-brand mb-0 h4 ms-3 fw-semibold text-primary">
          AuthBuilder
        </span>
            </div>

            {/* 🔹 Right Side: User Info or Login */}
            {userData ? (
                <div className="position-relative" ref={dropdownRef}>
                    {/* Avatar */}
                    <div
                        className="bg-primary text-white fw-semibold rounded-circle d-flex justify-content-center align-items-center shadow-sm"
                        style={{
                            width: "42px",
                            height: "42px",
                            cursor: "pointer",
                            transition: "transform 0.2s ease",
                        }}
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        title={userData.name}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                        {userData.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Dropdown */}
                    {dropdownOpen && (
                        <div
                            className="position-absolute end-0 mt-3 bg-white border rounded-4 shadow-sm py-2"
                            style={{ minWidth: "200px", zIndex: 2000 }}
                        >
                            {/* User Info */}
                            <div className="px-3 py-2 border-bottom">
                                <div className="fw-semibold text-dark">{userData.name}</div>
                                <div className="small text-muted">{userData.email}</div>
                            </div>

                            {/* Verify Email Option */}
                            {!userData?.isAccountVerified && (
                                <div
                                    className="dropdown-item py-2 px-3 text-warning fw-medium d-flex align-items-center"
                                    style={{ cursor: "pointer" }}
                                    onClick={sendVerifyEmail}
                                >
                                    <i className="bi bi-shield-exclamation me-2"></i> Verify Email
                                </div>
                            )}

                            {/* Logout Option */}
                            <div
                                className="dropdown-item py-2 px-3 text-danger fw-medium d-flex align-items-center"
                                style={{ cursor: "pointer" }}
                                onClick={handleLogout}
                            >
                                <i className="bi bi-box-arrow-right me-2"></i> Logout
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                // 🔹 Login Button
                <button
                    className="btn btn-outline-dark rounded-pill px-4 py-2 shadow-sm d-flex align-items-center fw-semibold"
                    onClick={() => navigate("/login")}
                    style={{
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#212529";
                        e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#212529";
                    }}
                >
                    Login <i className="bi bi-arrow-right ms-2"></i>
                </button>
            )}
        </nav>
    );
};

export default Menubar;
