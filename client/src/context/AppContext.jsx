import { createContext, useEffect, useState } from "react";
import { AppConstants } from "../utils/constent.js";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    axios.defaults.withCredentials = true;

    const backendUrl = AppConstants.BACKEND_URL;

    // Initialize isLoggedIn from localStorage to maintain state on refresh
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem("isLoggedIn") === "true";
    });

    const [userData, setUserData] = useState(null);

    // Sync isLoggedIn state to localStorage on every change
    useEffect(() => {
        if (isLoggedIn) {
            localStorage.setItem("isLoggedIn", "true");
        } else {
            localStorage.removeItem("isLoggedIn");
        }
    }, [isLoggedIn]);

    // Fetch user profile data assuming authenticated session
    const getUserData = async () => {
        try {
            const response = await axios.get(backendUrl + "/profile");
            if (response.status === 200) {
                setUserData(response.data);
                setIsLoggedIn(true);
            } else {
                toast.error("Unable to fetch user data");
            }
        } catch (error) {
            // Don't show error toast for 401 (unauthorized) - user is simply not logged in
            // Only show error toast for actual server/network errors
            if (error.response && error.response.status !== 401) {
                toast.error(error.response.data?.message || "Unable to fetch user data");
            }
            setIsLoggedIn(false);
        }
    };

    // Check authentication status from backend on app start or when needed
    const getAuthState = async () => {
        try {
            const response = await axios.get(`${backendUrl}/is-authenticated`);
            if (response.status === 200) {
                setIsLoggedIn(true);
                await getUserData();
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            // Silently handle authentication errors - user is simply not logged in
            // Don't show any toast messages for auth checks
            setIsLoggedIn(false);
            setUserData(null);
        }
    };

    // On component mount, verify auth status ONLY if user was previously logged in
    useEffect(() => {
        const wasLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        if (wasLoggedIn) {
            getAuthState();
        }
    }, []);

    const contextValue = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};
