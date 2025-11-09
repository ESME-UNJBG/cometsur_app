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

interface User {
  _id: string;
  email: string;
  baucher: string;
  name: string;
  university: string;
  // otras propiedades según tu API
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
    university: "",
    importe: "",
    category: "",
    pago: "",
    profesion: "",
    baucher: "",
  });

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<"email" | "baucher" | null>(
    null
  );
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

  const UNIVERSITY_OPTIONS = [
    "UNJBG",
    "UNSAAC",
    "UNSA",
    "UNI",
    "UNMSM",
    "UNT",
    "UNDAC",
    "Otra universidad",
  ];

  const CATEGORY_OPTIONS = [
    "Estudiante",
    "Egresado",
    "Docente",
    "Profesional",
    "Externo",
  ];
  const PAGO_OPTIONS = ["Yape", "Físico", "Otro"];
  const PROFESION_OPTIONS = [
    "ESMI",
    "ESME",
    "ESGEO",
    "ESIQ",
    "ESMC",
    "ESAM",
    "Otro",
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
    return words
      .map((word, index) => {
        if (index === 0) return word.charAt(0).toUpperCase() + word.slice(1);
        if (palabrasMinusculas.includes(word)) return word;
        if (word.includes("-")) {
          return word
            .split("-")
            .map((part) =>
              palabrasMinusculas.includes(part)
                ? part
                : part.charAt(0).toUpperCase() + part.slice(1)
            )
            .join("-");
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      university: "",
      importe: "",
      category: "",
      pago: "",
      profesion: "",
      baucher: "",
    });
    setValidated(false);
    setLoading(false);
    setErrorMsg(null);
    setErrorField(null);
    setEmailType("original");
    setShowSuggestions(false);
    setShowPassword(false);
  };

  useEffect(() => {
    if (show) resetForm();
  }, [show]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Limpiar errores cuando el usuario modifica el campo
    if (
      (name === "email" && errorField === "email") ||
      (name === "baucher" && errorField === "baucher")
    ) {
      setErrorField(null);
      setErrorMsg(null);
    }

    if (name === "name")
      setFormData((prev) => ({ ...prev, name: capitalizeWords(value) }));
    else if (name === "baucher")
      setFormData((prev) => ({ ...prev, baucher: value.toUpperCase() }));
    else if (name === "email") {
      const lower = value.toLowerCase();
      setFormData((prev) => ({ ...prev, email: lower }));
      if (lower.includes("@")) {
        const afterAt = lower.split("@")[1] || "";
        const list = emailType === "temporal" ? temporalDomains : validDomains;
        const filtered = list.filter((d) => d.startsWith(afterAt));
        setFilteredDomains(filtered);
        setShowSuggestions(filtered.length > 0);
      } else setShowSuggestions(false);
    } else setFormData((prev) => ({ ...prev, [name]: value }));
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
    for (let i = 0; i < 8; i++)
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    setFormData((prev) => ({ ...prev, password }));
  };

  const checkDuplicates = async (): Promise<{
    emailDuplicado: boolean;
    baucherDuplicado: boolean;
  }> => {
    const token = localStorage.getItem("Token");
    if (!token) {
      console.error("❌ Falta el token en localStorage");
      return { emailDuplicado: false, baucherDuplicado: false };
    }

    try {
      const response = await fetch(`https://cometsur-api.onrender.com/users/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const users: User[] = await response.json();

      // Verificar si existe el email o baucher
      const emailDuplicado = users.some(
        (user) => user.email.toLowerCase() === formData.email.toLowerCase()
      );

      const baucherDuplicado = users.some(
        (user) => user.baucher.toUpperCase() === formData.baucher.toUpperCase()
      );

      return { emailDuplicado, baucherDuplicado };
    } catch (error) {
      console.error("Error checking duplicates:", error);
      return { emailDuplicado: false, baucherDuplicado: false };
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidated(true);

    // Validación básica del formulario
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setErrorField(null);

    // Verificar duplicados
    const { emailDuplicado, baucherDuplicado } = await checkDuplicates();

    if (emailDuplicado || baucherDuplicado) {
      if (emailDuplicado) {
        setErrorField("email");
        setErrorMsg("El email ya fue registrado.");
      } else {
        setErrorField("baucher");
        setErrorMsg("El baucher ya fue registrado.");
      }
      setLoading(false);
      return; // Modal permanece abierto
    }

    try {
      const response: AxiosResponse<RegisterResponse> = await axios.post(
        "https://cometsur-api.onrender.com/auth/register",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      const usuarioId =
        response.data._id || response.data.id || response.data.user?._id;
      if (usuarioId) {
        if (onUsuarioRegistrado) onUsuarioRegistrado(usuarioId);
        resetForm();
        onClose();
      }
    } catch (err) {
      let mensaje = "Error en la petición";
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as {
          code?: number;
          keyPattern?: { email?: number; baucher?: number };
          error?: string;
        };
        if (data?.code === 11000) {
          if (data.keyPattern?.email) {
            mensaje = "El email ya fue registrado.";
            setErrorField("email");
          } else if (data.keyPattern?.baucher) {
            mensaje = "El baucher ya fue registrado.";
            setErrorField("baucher");
          }
        } else {
          mensaje = data?.error || mensaje;
        }
      }
      setErrorMsg(mensaje);
    } finally {
      setLoading(false);
    }
  };

  // Función para determinar clases de los campos
  const getFieldClassName = (fieldName: "email" | "baucher"): string => {
    const baseClass = "form-control";
    // Si hay error en este campo, aplicar clase personalizada
    if (errorField === fieldName) {
      return `${baseClass} field-with-error`;
    }
    return baseClass;
  };

  return (
    <div className="login-container ventana-content">
      <div className="ventana-header">
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onClose}
          disabled={loading}
        ></button>
      </div>
      <div className="ventana-body">
        <form
          className={`needs-validation ${validated ? "was-validated" : ""}`}
          noValidate
          onSubmit={handleSubmit}
        >
          {/* Mensaje general */}
          {errorMsg && !errorField && (
            <div className="alert alert-danger">{errorMsg}</div>
          )}

          {/* Nombre */}
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
              placeholder="Ej: Juan Pérez de la Garza"
            />
            <div className="invalid-feedback">
              Por favor ingresa tu nombre y apellido.
            </div>
          </div>

          {/* Email */}
          <div className="col-md-12 mb-3 position-relative">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className={getFieldClassName("email")}
              name="email"
              placeholder="example@email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
            {errorField === "email" && (
              <div className="error-feedback">{errorMsg}</div>
            )}
            <div className="invalid-feedback">
              Por favor ingresa un email válido.
            </div>

            {/* Tipo de email */}
            <div className="d-flex align-items-center gap-3 mt-2">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="emailType"
                  value="original"
                  checked={emailType === "original"}
                  onChange={() => handleEmailTypeChange("original")}
                  disabled={loading}
                />
                <label className="form-check-label">Válido</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="emailType"
                  value="temporal"
                  checked={emailType === "temporal"}
                  onChange={() => handleEmailTypeChange("temporal")}
                  disabled={loading}
                />
                <label className="form-check-label">Temporal</label>
              </div>
            </div>

            {/* Sugerencias */}
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

          {/* Universidad, Importe, Categoría */}
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label">Universidad:</label>
              <select
                className="form-select"
                name="university"
                value={formData.university}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Selecc. universidad</option>
                {UNIVERSITY_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">
                Por favor selecciona una universidad.
              </div>
            </div>
            <div className="col-md-4">
              <label className="form-label">Importe:</label>
              <input
                type="number"
                className="form-control"
                name="importe"
                value={formData.importe}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Ej: 30"
                min="0"
              />
              <div className="invalid-feedback">
                Por favor ingresa el importe.
              </div>
            </div>
            <div className="col-md-4">
              <label className="form-label">Categoría:</label>
              <select
                className="form-select"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Selecc. categoría</option>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">
                Por favor selecciona una categoría.
              </div>
            </div>
          </div>

          {/* Pago, Profesión, Baucher */}
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label">Pago:</label>
              <select
                className="form-select"
                name="pago"
                value={formData.pago}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Seleccione método</option>
                {PAGO_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">
                Por favor selecciona un método de pago.
              </div>
            </div>
            <div className="col-md-4">
              <label className="form-label">Profesión:</label>
              <select
                className="form-select"
                name="profesion"
                value={formData.profesion}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Seleccione profesión</option>
                {PROFESION_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">
                Por favor selecciona una profesión.
              </div>
            </div>
            <div className="col-md-4">
              <label className="form-label">Baucher:</label>
              <input
                type="text"
                className={getFieldClassName("baucher")}
                name="baucher"
                value={formData.baucher}
                onChange={handleChange}
                placeholder="Ej: A1"
                required
                disabled={loading}
                autoComplete="off"
              />
              {errorField === "baucher" && (
                <div className="error-feedback">{errorMsg}</div>
              )}
              <div className="invalid-feedback">
                Por favor ingresa el número de baucher.
              </div>
            </div>
          </div>

          {/* Contraseña */}
          <div className="col-md-12 mb-3">
            <label className="form-label">Contraseña:</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                maxLength={16}
                disabled={loading}
                autoComplete="new-password"
                placeholder="Carácter (6-16)"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={generatePassword}
                disabled={loading}
              >
                Generar 🔄
              </button>
            </div>
            <div className="invalid-feedback">
              La contraseña debe tener entre 6 y 16 caracteres.
            </div>
          </div>

          {/* Botón enviar */}
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
