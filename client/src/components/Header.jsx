import {assets} from "../assets/assets.js";
import {useContext} from "react";
import {AppContext} from "../context/AppContext.jsx";

const Header = () => {
    const { userData } = useContext(AppContext);

    return (
        <div
            className="text-center d-flex flex-column align-items-center justify-content-center py-5 px-3 bg-light rounded shadow-sm"
            style={{ minHeight: '80vh', maxWidth: '600px', margin: 'auto' }}
        >
            <img src={assets.loginhome} className="mb-4" alt="header" width={140} height={140} />

            <h5 className="fw-semibold mb-3 lh-base">
                Hey {userData ? userData.name : 'Developer'} <span role="img" aria-label="wave">👋</span>,<br />
                Welcome to <span className="text-primary">AuthBuilder</span>!<br />
                Your one-stop solution for seamless authentication integration.
            </h5>

            <h1 className="fw-bold display-5 mb-4">Welcome to our product</h1>

            <p className="mb-4 text-secondary fs-5 px-3">
                Let's start with a quick tour to explore the features and capabilities that will help you build secure and efficient authentication systems with ease.
            </p>

            <button className="btn btn-outline-dark rounded-pill px-4 py-2 shadow-sm">
                Get Started
            </button>
        </div>

    )
}

export default Header;