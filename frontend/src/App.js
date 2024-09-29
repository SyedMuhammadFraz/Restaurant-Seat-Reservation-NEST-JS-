import logo from "./logo.svg";
import "./App.css";
import HomePage from "./pages/HomePage";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AvailableTablesPage from "./pages/Tables";
import SignupPage from "./pages/SignUpPage";
import { AuthProvider, useAuth } from "./pages/AuthContext";
import PrivateRoute from "./pages/PrivateRoute";
import UserReservations from "./pages/UserReservations";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reservations/:userId" element={<UserReservations />} />
          <Route
            path="/tables"
            element={
              <PrivateRoute>
                <AvailableTablesPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
