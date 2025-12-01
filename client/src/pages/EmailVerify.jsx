import { assets } from "../assets/assets.js";
import { Link, useNavigate } from "react-router-dom";
import {useContext, useEffect, useRef, useState} from "react";
import { AppContext } from "../context/AppContext.jsx";
import {toast} from "react-toastify";
import axios from "axios";

const EmailVerify = () => {
    const inputRef = useRef([]);
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [loading, setLoading] = useState(false);
    const { getUserData, isLoggedIn, userData, backendUrl } = useContext(AppContext);
    const navigate = useNavigate();

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return; // Only digits or empty allowed
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRef.current[index + 1]?.focus();
        }
    };

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

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('Text').slice(0, 6).split('');
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

    const handleVerify = async () => {
        const enteredOtp = inputRef.current.map(input => input.value).join('');
        if (enteredOtp.length !== 6) {
            toast.error("Please enter a 6-digit OTP.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${backendUrl}/verify-otp`, { otp: enteredOtp });
            if (response.status === 200) {
                toast.success("Verification successful.");
                getUserData();
                navigate("/");
            } else {
                toast.error("OTP verification failed. Please try again.");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "OTP verification failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        isLoggedIn && userData && userData.isAccountVerified && navigate("/");
    }, [isLoggedIn, userData]);


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
                <img
                    src={assets.logo}
                    alt="logo"
                    height={40}
                    width={40}
                    className="me-2"
                />
                <span className="fs-4 fw-semibold">Authfy</span>
            </Link>

            <div
                className="text-center bg-white p-4 rounded shadow-lg"
                style={{ maxWidth: "400px", width: "100%" }}
            >
                <h2 className="mb-3 fw-bold text-primary">Verify Your Email</h2>
                <p className="mb-4 text-muted">
                    Please check your email inbox for the verification link. If you
                    didn't receive it, click below to resend.
                </p>
                <div
                    className="d-flex justify-content-center gap-2 mb-4 text-center"
                    onPaste={handlePaste}
                >
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
                <button
                    className="btn btn-primary w-100 mb-3"
                    onClick={handleVerify}
                    disabled={loading}
                >
                    {loading ? "Verifying..." : "Verify Email"}
                </button>
                <div>
                    <span className="text-muted">Didn't receive the email? </span>
                    <button
                        className="btn btn-link p-0 align-baseline"
                        onClick={() => alert("Resend logic not implemented")}
                    >
                        Resend
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailVerify;
