import { useUserSessionFull } from "../hook/useUserSession";
import { useEffect, useState } from "react";
import "../css/Asistencia.css"; // Importamos el nuevo CSS

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

  const progress = (localAsistencia / 6) * 100;

  // Determinar clase según la asistencia
  let progressClass = "progress-bar-gray";
  if (localAsistencia >= 3 && localAsistencia < 6)
    progressClass = "progress-bar-yellow";
  else if (localAsistencia >= 6) progressClass = "progress-bar-green";

  return (
    <div className="asistencia-card">
      <h5 className="asistencia-title">Asistencia</h5>
      <p className="asistencia-count">{localAsistencia}/6</p>
      <div className="asistencia-progress">
        <div
          className={`asistencia-progress-bar ${progressClass}`}
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {error && <small className="asistencia-error">Error al actualizar</small>}
    </div>
  );
};

export default Asistencia;
