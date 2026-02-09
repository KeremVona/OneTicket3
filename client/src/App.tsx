import { BrowserRouter, Route, Routes, Navigate } from "react-router";

import "./App.css";

import ProtectedRoute from "./ProtectedRoute";
import Register from "./pages/authentication/Register";
import Login from "./pages/authentication/Login";
import Home from "./pages/Home";
import TechnicianHome from "./pages/technician/TechnicianHome";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<ProtectedRoute content={<Home />} />} />
          <Route
            path="/technician"
            element={<ProtectedRoute content={<TechnicianHome />} />}
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
