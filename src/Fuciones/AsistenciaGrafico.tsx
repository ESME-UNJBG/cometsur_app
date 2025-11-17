import { useUsuarios } from "../hook/useUsuarios";
import BotonAnalisis from "./botonAnalisis";
import BotonAnalisisRegistros from "./botonAnalisis 1";
import BotonAnalisisAsistencia from "./botonAnalisis 2";
import "../css/asistenciaGrafico.css";
const AnalisisGrafico: React.FC = () => {
  const { usuarios, cargando, error } = useUsuarios();

  if (cargando) {
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
    <div className="row g-3 justify-content-center contenedor-botones-analisis">
      <div className="col-sm-6 col-lg-4">
        <div className="d-grid">
          <BotonAnalisis usuarios={usuarios} />
        </div>
      </div>

      <div className="col-sm-6 col-lg-4">
        <div className="d-grid">
          <BotonAnalisisRegistros usuarios={usuarios} />
        </div>
      </div>

      <div className="col-sm-6 col-lg-4">
        <div className="d-grid">
          <BotonAnalisisAsistencia usuarios={usuarios} />
        </div>
      </div>
    </div>
  );
};

export default AnalisisGrafico;
