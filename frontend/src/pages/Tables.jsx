import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../App.css";
import ConfirmationModal from "../modal/ConfirmationModal";

const AvailableTablesPage = () => {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const { logout, userId } = useAuth();

  useEffect(() => {
    fetch("http://localhost:3001/table")
      .then((response) => response.json())
      .then((data) => setTables(data))
      .catch((error) => console.error("Error fetching tables:", error));

    const handlePopState = () => {
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      navigate("/", { replace: true });
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const handleLogOut = () => {
    logout();
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    navigate("/", { replace: true });
  };

  const handleTableClick = (table) => {
    setSelectedTable(table);
    setShowConfirmation(true);
  };

  const handleConfirm = (tableId) => {
    setShowConfirmation(false);
    console.log(`Table ${tableId} booked`);
    // Here you can handle the booking process, e.g., send the booking request to the server
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handleReservationPage = () => {
    console.log(userId.data._id);
    navigate(`/reservations/${userId.data._id}`);
  };

  return (
    <div className="tables-container">
      <h1>Available Tables</h1>
      <div className="cards-grid">
        {tables.map((table, index) => (
          <div
            key={index}
            className="card"
            onClick={() => handleTableClick(table)} // Navigate on click
          >
            <p className="card-id">Table ID: {table._id}</p>
            <p className="card-number">Number: {table.number}</p>
            <p className="card-seats">Seats: {table.seats}</p>
          </div>
        ))}
      </div>
      <button className="logout-button" onClick={handleLogOut}>
        Logout
      </button>

      {/* Managing user reservation page route using a button*/}

      <button className="reservations-button" onClick={handleReservationPage}>
        View Reservations
      </button>

      {showConfirmation && (
        <ConfirmationModal
          table={selectedTable}
          userId={userId}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default AvailableTablesPage;
