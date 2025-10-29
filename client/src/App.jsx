import './App.css'
import {ToastContainer} from "react-toastify";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import EmailVerify from "./pages/EmailVerify.jsx";
import Login from "./pages/Login.jsx";

function App() {
  return (
      <div>
          <ToastContainer />
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/email-verify" element={<EmailVerify />} />
              <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
      </div>
  )
}

export default App
