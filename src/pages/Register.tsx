import React, { useState } from "react";
import axios from "axios";
import { FormData } from "../interfaces/register";
import "../css/Ventana.css";

interface RegisterFormProps {
  onClose: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);
    setValidated(true);

    try {
      const response = await axios.post(
        "https://cometsur-api.onrender.com/auth/register",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        onClose(); // ✅ SE CIERRA Y SALE INMEDIATAMENTE
        return; // 🚨 IMPORTANTE: Salir de la función
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error en la petición");
      setLoading(false); // ✅ Solo si hay error
    }
    // ❌ NO USAR finally - eso causa el error
  };

  return (
    <div className="login-container card">
      <div className="card-body">
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>

        <form
          className={`needs-validation ${validated ? "was-validated" : ""}`}
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="col-md-12 mb-3">
            <label className="form-label">Nombre y apellido:</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">
              Por favor ingresa tu nombre completo.
            </div>
          </div>

          <div className="col-md-12 mb-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="example@email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">
              Por favor ingresa un correo válido.
            </div>
          </div>

          <div className="col-md-12 mb-3">
            <label className="form-label">Contraseña:</label>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="caracter (6-16)"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              maxLength={16}
            />
            <div className="invalid-feedback">
              La contraseña debe tener entre 6 y 16 caracteres.
            </div>
          </div>

          <div className="mb-3">
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Enviar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
