import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../App.css"; // Import the CSS file

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const API_URL = "http://localhost:3001";

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (name.trim() && email.trim()) {
      try {
        const response = await axios.post(`${API_URL}/users/`, { name, email });
        console.log(response.data);
        login();
        navigate("/tables", { replace: true });
      } catch (err) {
        setError("Failed to sign up. Please try again.");
        console.error(err);
      }
    } else {
      setError("Please enter both name and email.");
    }
  };

  const handleLoginRedirect = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="signup-container">
      <div className="signup-form-wrapper">
        <h1 className="signup-header">Sign Up</h1>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="form-control"
            />
          </div>
          <button type="submit" className="submit-button">
            Sign Up
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <p className="login-link">
          If already registered,{" "}
          <span onClick={handleLoginRedirect} className="login-link-text">
            login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
