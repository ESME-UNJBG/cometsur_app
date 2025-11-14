import React, { useEffect, useState } from "react";
import { User } from "../interfaces/user";
import BotonAnalisis from "./botonAnalisis";
import BotonAnalisisRegistros from "./botonAnalisis 1";
import BotonAnalisisAsistencia from "./botonAnalisis 2";

const AnalisisGrafico: React.FC = () => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar usuarios desde localStorage
  useEffect(() => {
    const cargarUsuarios = () => {
      try {
        const stored = localStorage.getItem("usuarios");
        if (stored) {
          const usuariosData: User[] = JSON.parse(stored);
          setUsuarios(usuariosData);
        } else {
          setUsuarios([]);
        }
      } catch (err) {
        console.error("Error cargando usuarios:", err);
        setError("Error al cargar los datos de usuarios");
        setUsuarios([]);
      } finally {
        setLoading(false);
      }
    };

    cargarUsuarios();
  }, []);

  // Si está cargando
  if (loading) {
    return (
      <div className="card mb-4">
        <div className="card-body text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando análisis...</span>
          </div>
          <p className="mt-2 mb-0">Cargando datos de análisis...</p>
        </div>
      </div>
    );
  }

  // Si hay error
  if (error) {
    return (
      <div className="card mb-4">
        <div className="card-body">
          <div className="alert alert-danger text-center">
            <strong>Error:</strong> {error}
            <br />
            <small>Verifica que hay datos en el sistema</small>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay usuarios
  if (usuarios.length === 0) {
    return (
      <div className="card mb-4">
        <div className="card-body">
          <div className="text-center mb-3">
            <h4 className="card-title fw-bold">📊 Análisis General</h4>
          </div>
          <div className="alert alert-warning text-center mb-0">
            <strong>No hay datos para analizar</strong>
            <br />
            <small>No se encontraron usuarios registrados en el sistema</small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-4">
      <div className="card-body">
        {/* ENCABEZADO */}
        <div className="text-center mb-4 pb-3 border-bottom">
          {/*<h4 className="card-title fw-bold mb-2">📊 Análisis General</h4>*/}
          <p className="card-text text-muted mb-2">
            Estadísticas y métricas de los datos del sistema
          </p>
          {/*<small className="text-muted">
            Total de usuarios: <strong>{usuarios.length}</strong>
          </small>*/}
        </div>

        {/* CONTENEDOR DE BOTONES */}
        <div className="row g-3 justify-content-center">
          {/* BOTÓN 1 - Análisis de Ingresos */}
          <div className="col-sm-6 col-lg-4">
            <div className="d-grid">
              <BotonAnalisis usuarios={usuarios} />
            </div>
          </div>

          {/* BOTÓN 2 - Análisis de Registros */}
          <div className="col-sm-6 col-lg-4">
            <div className="d-grid">
              <BotonAnalisisRegistros usuarios={usuarios} />
            </div>
          </div>

          {/* BOTÓN 3 - Análisis de Asistencia */}
          <div className="col-sm-6 col-lg-4">
            <div className="d-grid">
              <BotonAnalisisAsistencia usuarios={usuarios} />
            </div>
          </div>
        </div>

        {/* DESCRIPCIONES DE LOS BOTONES (opcional) */}
        {/*<div className="row g-3 mt-2">
          <div className="col-sm-6 col-lg-4">
            <small className="text-muted d-block text-center">
              Análisis de ingresos y métodos de pago
            </small>
          </div>
          <div className="col-sm-6 col-lg-4">
            <small className="text-muted d-block text-center">
              Estadísticas de registros por fecha
            </small>
          </div>
          <div className="col-sm-6 col-lg-4">
            <small className="text-muted d-block text-center">
              Control de asistencia y estados
            </small>
          </div>
        </div>*/}
      </div>
    </div>
  );
};

export default AnalisisGrafico;
