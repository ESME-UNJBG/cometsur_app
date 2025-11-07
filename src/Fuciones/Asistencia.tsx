import { useUserSessionFull } from "../hook/useUserSession";
import { useEffect, useState } from "react";

const Asistencia = () => {
  const token = localStorage.getItem("Token");
  const userId = localStorage.getItem("userId");
  const { userData, loading, error } = useUserSessionFull(token, userId);
  const [localAsistencia, setLocalAsistencia] = useState<number>(0);

  useEffect(() => {
    if (userData?.asistencia !== undefined) {
      setLocalAsistencia(userData.asistencia);
    }
  }, [userData?.asistencia]);

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  const progress = (localAsistencia / 4) * 100;

  return (
    <div className="card p-3 text-center">
      <h5>Asistencia</h5>
      <p className="fw-bold">{localAsistencia}/4</p>
      <div className="progress mt-2" style={{ height: "8px" }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {error && <small className="text-danger mt-1">Error al actualizar</small>}
    </div>
  );
};

export default Asistencia;
