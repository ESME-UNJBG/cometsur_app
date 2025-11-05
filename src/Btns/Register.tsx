import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { FormData } from "../interfaces/register";
import "../css/Ventana.css";
import { Eye, EyeOff } from "lucide-react";

interface RegisterFormProps {
  onClose: () => void;
  onUsuarioRegistrado?: (usuarioId: string) => void;
  show: boolean;
}

interface RegisterResponse {
  _id?: string;
  id?: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  error?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onClose,
  onUsuarioRegistrado,
  show,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [emailType, setEmailType] = useState<"original" | "temporal">(
    "original"
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredDomains, setFilteredDomains] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const temporalDomains = [
    "tempmail.com",
    "10minutemail.com",
    "mailinator.com",
    "yopmail.com",
    "guerrillamail.com",
    "getnada.com",
    "trashmail.com",
  ];

  const validDomains = [
    "gmail.com",
    "hotmail.com",
    "outlook.com",
    "live.com",
    "yahoo.com",
    "unjbg.edu.pe",
  ];

  const palabrasMinusculas = [
    "de",
    "la",
    "del",
    "los",
    "las",
    "y",
    "e",
    "el",
    "a",
    "al",
    "en",
    "un",
    "una",
    "unos",
    "unas",
    "con",
    "por",
    "para",
    "sin",
    "sobre",
    "entre",
    "hacia",
    "hasta",
    "desde",
    "durante",
    "mediante",
  ];

  const capitalizeWords = (text: string): string => {
    if (!text) return text;
    const words = text.toLowerCase().split(" ");

    const processedWords = words.map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      if (palabrasMinusculas.includes(word)) {
        return word;
      }
      if (word.includes("-")) {
        const parts = word.split("-");
        const processedParts = parts.map((part) => {
          if (palabrasMinusculas.includes(part)) {
            return part;
          }
          return part.charAt(0).toUpperCase() + part.slice(1);
        });
        return processedParts.join("-");
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    });

    return processedWords.join(" ");
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "" });
    setValidated(false);
    setLoading(false);
    setErrorMsg(null);
    setEmailType("original");
    setShowSuggestions(false);
    setShowPassword(false);
  };

  useEffect(() => {
    resetForm();
  }, []);

  useEffect(() => {
    if (show) resetForm();
  }, [show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "name") {
      setFormData((prev) => ({ ...prev, [name]: capitalizeWords(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // 🔹 Sugerencias tanto para Válido como para Temporal
    if (name === "email") {
      if (value.includes("@")) {
        const afterAt = value.split("@")[1] || "";
        const domainList =
          emailType === "temporal" ? temporalDomains : validDomains;
        const filtered = domainList.filter((domain) =>
          domain.startsWith(afterAt)
        );
        setFilteredDomains(filtered);
        setShowSuggestions(filtered.length > 0);
      } else {
        setShowSuggestions(false);
      }
    }
  };

  const handleEmailTypeChange = (value: "original" | "temporal") => {
    setEmailType(value);
    setShowSuggestions(false);
  };

  const handleSelectDomain = (domain: string) => {
    const beforeAt = formData.email.split("@")[0] || "";
    setFormData((prev) => ({ ...prev, email: `${beforeAt}@${domain}` }));
    setShowSuggestions(false);
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    const len = 8;
    for (let i = 0; i < len; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);
    setValidated(true);
    setErrorMsg(null);

    try {
      const response: AxiosResponse<RegisterResponse> = await axios.post(
        "https://cometsur-api.onrender.com/auth/register",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      const usuarioId =
        response.data._id || response.data.id || response.data.user?._id;

      if (usuarioId && onUsuarioRegistrado) {
        onUsuarioRegistrado(usuarioId);
      }

      resetForm();
    } catch (err: unknown) {
      let mensaje = "Error en la petición";
      if (axios.isAxiosError(err)) {
        mensaje = err.response?.data?.error || err.response?.data || mensaje;
      }
      setErrorMsg(mensaje);
    } finally {
      setLoading(false);
      if (!errorMsg) onClose();
    }
  };

  return (
    <div className="login-container card">
      <div className="card-body position-relative">
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={onClose}
            disabled={loading}
          ></button>
        </div>

        <form
          className={`needs-validation ${validated ? "was-validated" : ""}`}
          noValidate
          onSubmit={handleSubmit}
        >
          {errorMsg && (
            <div className="alert alert-danger" role="alert">
              {errorMsg}
            </div>
          )}

          <div className="col-md-12 mb-3">
            <label className="form-label">Nombre y apellido:</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              autoComplete="name"
              placeholder="Ej: Juan Pérez de la Garza"
            />
          </div>

          <div className="col-md-12 mb-3 position-relative">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="example@email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              autoComplete="email"
            />

            <div className="d-flex align-items-center gap-3 mt-2">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="emailType"
                  id="emailTypeOriginal"
                  value="original"
                  checked={emailType === "original"}
                  onChange={() => handleEmailTypeChange("original")}
                  disabled={loading}
                />
                <label className="form-check-label" htmlFor="emailTypeOriginal">
                  Válido
                </label>
              </div>

              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="emailType"
                  id="emailTypeTemporal"
                  value="temporal"
                  checked={emailType === "temporal"}
                  onChange={() => handleEmailTypeChange("temporal")}
                  disabled={loading}
                />
                <label className="form-check-label" htmlFor="emailTypeTemporal">
                  Temporal
                </label>
              </div>
            </div>

            {showSuggestions && filteredDomains.length > 0 && (
              <ul
                className="list-group position-absolute w-100 mt-1 shadow"
                style={{ zIndex: 10, top: "100%" }}
              >
                {filteredDomains.map((domain) => (
                  <li
                    key={domain}
                    className="list-group-item list-group-item-action"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSelectDomain(domain)}
                  >
                    @{domain}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="col-md-12 mb-3">
            <label className="form-label">Contraseña:</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                name="password"
                placeholder="Carácter (6-16)"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                maxLength={16}
                disabled={loading}
                autoComplete="new-password"
              />

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                title={showPassword ? "Ocultar" : "Mostrar"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={generatePassword}
                disabled={loading}
                title="Generar contraseña"
              >
                Generar 🔄
              </button>
            </div>
          </div>

          <div className="mb-3">
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "📤 Registrando..." : "Enviar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
