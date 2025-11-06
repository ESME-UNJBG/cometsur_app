// pages/Login.tsx
import React, { useState } from "react";
import useLogin from "../hook/useLogin";
import logo from "../Fuciones/imag/cometsur.png";
import "../css/LoginForm.css";

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, loading, error } = useLogin();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(formData);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="card">
        <div className="card-body">
          <img src={logo} className="login-logo" alt="Logo CometSur" />

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              className="form-control"
              placeholder="example@email.com"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
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
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="mb-3">
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
