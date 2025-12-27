import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { useContext, useRef, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";

const ResetPassword = () => {
    const inputRef = useRef([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
    const { backendUrl } = useContext(AppContext);

    axios.defaults.withCredentials = true;

    // ✅ Handle OTP input changes
    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return; // Allow only digits or empty
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRef.current[index + 1]?.focus();
        }
    };

    // ✅ Handle Backspace key
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            const newOtp = [...otp];
            if (newOtp[index]) {
                newOtp[index] = "";
                setOtp(newOtp);
            } else if (index > 0) {
                inputRef.current[index - 1]?.focus();
                newOtp[index - 1] = "";
                setOtp(newOtp);
            }
        }
    };

    // ✅ Handle paste event
    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("Text").slice(0, 6).split("");
        const newOtp = [...otp];
        pasteData.forEach((digit, i) => {
            if (/^\d$/.test(digit) && i < 6) {
                newOtp[i] = digit;
                if (inputRef.current[i]) {
                    inputRef.current[i].value = digit;
                }
            }
        });
        setOtp(newOtp);
        const nextIndex = pasteData.length < 6 ? pasteData.length : 5;
        inputRef.current[nextIndex]?.focus();
    };

    // ✅ Step 1: Send Reset OTP
    const onSubmitEmail = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post(`${backendUrl}/send-reset-otp`, { email });
            if (response.status === 200) {
                toast.success("Reset password OTP sent. Please check your inbox.");
                setIsEmailSent(true);
            } else {
                toast.error("Failed to send OTP. Please try again.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Step 2: Verify OTP
    const onSubmitOtp = async (e) => {
        e.preventDefault();
        const enteredOtp = otp.join("");
        if (enteredOtp.length !== 6) {
            toast.warn("Please enter a valid 6-digit OTP.");
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post(`${backendUrl}/verify-reset-otp`, { email, otp: enteredOtp });
            if (response.status === 200) {
                toast.success("OTP verified successfully!");
                setIsOtpSubmitted(true);
            } else {
                toast.error("Invalid OTP. Please try again.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "OTP verification failed.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Step 3: Submit new password
    const onSubmitNewPassword = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post(`${backendUrl}/reset-password`, { email, newPassword });
            if (response.status === 200) {
                toast.success("Password reset successfully!");
                navigate("/login");
            } else {
                toast.error("Failed to reset password.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="email-verify-container d-flex flex-column align-items-center justify-content-center vh-100 p-4"
            style={{
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                minHeight: "100vh",
                position: "relative",
            }}
        >
            <Link
                to="/"
                className="position-absolute top-0 start-0 m-3 d-flex align-items-center text-decoration-none text-light"
                style={{ zIndex: 1000 }}
            >
                <img src={assets.logo} alt="logo" height={40} width={40} className="me-2" />
                <span className="fs-4 fw-semibold">Authfy</span>
            </Link>

            {/* STEP 1: EMAIL FORM */}
            {!isEmailSent && (
                <div className="rounded-4 p-5 text-center" style={{ width: "100%", maxWidth: "400px", backgroundColor: "white" }}>
                    <h2 className="mb-2">Reset Password</h2>
                    <p className="mb-4">Enter your registered email address</p>
                    <form onSubmit={onSubmitEmail}>
                        <div className="input-group mb-4 bg-secondary bg-opacity-10 rounded-pill">
              <span className="input-group-text bg-transparent border-0 ps-4">
                <i className="bi bi-envelope-fill text-secondary"></i>
              </span>
                            <input
                                type="email"
                                className="form-control bg-transparent border-0 rounded-pill"
                                placeholder="Enter Email Address"
                                style={{ height: "50px" }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                            {loading ? "Loading..." : "Submit"}
                        </button>
                    </form>
                </div>
            )}

            {/* STEP 2: OTP VERIFICATION */}
            {!isOtpSubmitted && isEmailSent && (
                <div className="text-center bg-white p-4 rounded shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
                    <h2 className="mb-3 fw-bold text-primary">Verify OTP</h2>
                    <p className="mb-4 text-muted">Enter the 6-digit OTP sent to your email</p>
                    <form onSubmit={onSubmitOtp}>
                        <div className="d-flex justify-content-center gap-2 mb-4 text-center" onPaste={handlePaste}>
                            {otp.map((value, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    value={value}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="form-control text-center fs-4 otp-input"
                                    style={{ width: "3rem", height: "3rem" }}
                                    ref={(el) => (inputRef.current[index] = el)}
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                />
                            ))}
                        </div>
                        <button className="btn btn-primary w-100 mb-3" type="submit" disabled={loading}>
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </form>
                    <div>
                        <span className="text-muted">Didn't receive the OTP? </span>
                        <button className="btn btn-link p-0 align-baseline" onClick={onSubmitEmail}>
                            Resend
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3: NEW PASSWORD FORM */}
            {isOtpSubmitted && isEmailSent && (
                <div className="rounded-4 p-4 text-center bg-white" style={{ width: "100%", maxWidth: "400px" }}>
                    <h4>Set New Password</h4>
                    <p className="mb-4 text-muted">Enter your new password below</p>
                    <form onSubmit={onSubmitNewPassword}>
                        <div className="input-group mb-4 bg-secondary bg-opacity-10 rounded-pill">
              <span className="input-group-text bg-transparent border-0 ps-4">
                <i className="bi bi-lock-fill text-secondary"></i>
              </span>
                            <input
                                type="password"
                                className="form-control bg-transparent border-0 ps-1 pe-4 rounded-end"
                                placeholder="New Password"
                                style={{ height: "50px" }}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ResetPassword;
