import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginData } from "../interfaces/login";
import logo from "../Fuciones/imag/cometsur.png";
import "../css/LoginForm.css";

const logo1: string = logo;

const LoginForm: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://cometsur-api.onrender.com/auth/login",
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Inicio de sesión exitoso");

        // 🔹 Extraer datos necesarios
        const id_expot = response.data.user._id;
        const token_expot = response.data.token;
        const role_export = response.data.user.estado; // 👈 rol inicial

        // 🔹 Guardar en localStorage
        localStorage.setItem("userId", id_expot);
        localStorage.setItem("Token", token_expot);
        localStorage.setItem("userRole", role_export);

        // Reset form
        setLoginData({ email: "", password: "" });

        // 👇 Redirección condicional según el rol
        if (role_export === "usuario") {
          navigate("/home");
        } else if (role_export === "moderador") {
          navigate("/moderador");
        } else {
          alert("Rol no reconocido, contacte al administrador");
          navigate("/");
        }
      } else {
        alert("Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error en la petición");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="card">
        <div className="card-body">
          <img src={logo1} className="login-logo" alt="Logo" />
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              className="form-control"
              placeholder="example@email"
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña:</label>
            <input
              className="form-control"
              placeholder="caracter (6-16)"
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <button type="submit" className="btn btn-primary">
              Iniciar Sesión
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
