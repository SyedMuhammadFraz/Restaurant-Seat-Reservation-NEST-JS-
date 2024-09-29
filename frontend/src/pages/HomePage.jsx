import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";
import "../App.css"; // Import the CSS file

const HomePage = () => {
  const [email, setEmail] = useState("");
  const { login } = useAuth();
  const API_URL = "http://localhost:3001";
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/users/byemail?email=${email}`
      );
      console.log(response.data._id);
      const responseId = await axios.get(
        `${API_URL}/users/${response.data._id}`
      );
      if (response.status === 200) {
        console.log(response.data);
        login(responseId);
        navigate("/tables", { replace: true });
      } else {
        navigate("/signup");
      }
    } catch (error) {
      console.log("Error fetching data:", error);
      navigate("/signup");
    }
  };

  const handleSubmit = async () => {
    if (email.trim()) {
      await fetchData();
    } else {
      console.log("Please enter an email.");
    }
  };

  return (
    <div className="homepage-container">
      <div className="homepage-form-wrapper">
        <h1 className="homepage-header">Enter your email:</h1>
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="form-control"
          />
        </div>
        <button onClick={handleSubmit} className="submit-button">
          Submit
        </button>
      </div>
    </div>
  );
};

export default HomePage;
