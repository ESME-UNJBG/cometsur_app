import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import ProtectedRoute from "./private/proRuts";
import { useUserSessionFull } from "./hook/useUserSession";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Qr from "./pages/Qr";
import HomeMod from "./pages/Home_moderador";
import QrMod from "./pages/Qr_moderador";
import PilaMod from "./pages/Pila_moderador";

const App: React.FC = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const token = localStorage.getItem("Token");
  const userId = localStorage.getItem("userId");

  useUserSessionFull(token, userId);

  useEffect(() => {
    const timer = setTimeout(() => setIsCheckingAuth(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* ✅ Ruta LOGIN LIBRE - siempre muestra Login */}
        <Route path="/" element={<Login />} />

        {/* ✅ Rutas protegidas para Usuario */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={["usuario"]}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qr"
          element={
            <ProtectedRoute allowedRoles={["usuario"]}>
              <Qr />
            </ProtectedRoute>
          }
        />

        {/* ✅ Rutas protegidas para Moderador */}
        <Route
          path="/moderador"
          element={
            <ProtectedRoute allowedRoles={["moderador"]}>
              <HomeMod />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qrmoderador"
          element={
            <ProtectedRoute allowedRoles={["moderador"]}>
              <QrMod />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pilamoderador"
          element={
            <ProtectedRoute allowedRoles={["moderador"]}>
              <PilaMod />
            </ProtectedRoute>
          }
        />

        {/* ✅ Ruta de fallback */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
