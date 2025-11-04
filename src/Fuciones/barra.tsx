import React, { useState, useEffect, useCallback } from "react";
import image from "../Fuciones/imag/esme.png";
import { useNavigate } from "react-router-dom";

const Barra: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");
  const navigate = useNavigate();

  const toggleCollapse = (): void => {
    setIsOpen(!isOpen);
  };

  // 🔹 Memorizar handleLogout para evitar advertencia
  const handleLogout = useCallback(() => {
    localStorage.clear();
    console.clear();
    navigate("/");
  }, [navigate]);

  // 🔹 Cerrar sesión automáticamente cada 2 horas
  useEffect(() => {
    const dosHoras = 2 * 60 * 60 * 1000; // 2 horas en ms

    const timeoutId = setTimeout(() => {
      handleLogout();
    }, dosHoras);

    return () => clearTimeout(timeoutId); // limpiar si se desmonta
  }, [handleLogout]);

  return (
    <nav
      className="navbar fixed-top"
      style={{
        fontSize: "80%",
        width: "100%",
        height: "55px",
        padding: "0.02rem",
        backgroundColor: "#47031dff",
        justifyContent: "space-between",
      }}
    >
      {/* Botón para desplegar el menú lateral */}
      <button
        className="text-white"
        type="button"
        onClick={toggleCollapse}
        style={{
          float: "left",
          background: "none",
          borderColor: "#e6dce0ff",
          border: "50px",
          borderRadius: "7px",
          marginLeft: "2%",
        }}
        aria-label="Toggle navigation"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="19"
          fill="currentColor"
          className="bi bi-list"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
          />
        </svg>
      </button>

      {/* Logo */}
      <a href="#" className="navbar-brand" style={{ float: "left" }}>
        <img src={image} alt="Logo" style={{ width: "100%", height: "50px" }} />
      </a>

      {/* Menú deslizable */}
      <div
        className={`offcanvas offcanvas-start ${isOpen ? "show" : ""}`}
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease-in-out",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "200px",
          backgroundColor: "#4d0522ff",
          zIndex: 1040,
        }}
      >
        <div className="offcanvas-header">
          <h6 className="offcanvas-title text-white">Menú</h6>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={toggleCollapse}
            aria-label="Cerrar"
          ></button>
        </div>
        <div className="offcanvas-header">
          <ul className="navbar-nav">
            <li className="nav-item">
              <label className="nav-link text-white">Datos:</label>
              <label
                className="nav-link text-white"
                style={{ padding: "4px 8px 8px 10px" }}
              >
                {userName}
              </label>
            </li>
            <li className="nav-item">
              <label className="nav-link text-white">Estado:</label>
              <label
                className="nav-link text-white"
                style={{ padding: "4px 8px 8px 10px" }}
              >
                {userRole}
              </label>
            </li>
            <li className="nav-item">
              <div>
                <button
                  className="text-white"
                  onClick={handleLogout}
                  style={{
                    border: "none",
                    background: "none",
                    padding: "12.8px 40px",
                    width: "100%",
                  }}
                >
                  Cerrar sesión
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Barra;
