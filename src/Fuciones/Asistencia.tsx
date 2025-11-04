import { useState, useEffect } from "react";
import useActualizarUsuario from "../hook/useAct"; // 👈 importa tu hook

const Asistencia = () => {
  // Estado para reflejar el valor de asistencia
  const [asistencia, setAsistencia] = useState<string | null>(
    localStorage.getItem("UserAsistencia")
  );

  // ✅ Llama al hook que actualiza el localStorage cada 3s
  useActualizarUsuario();

  // ✅ Cada segundo revisamos si cambió en localStorage y actualizamos estado
  useEffect(() => {
    const interval = setInterval(() => {
      const nuevaAsistencia = localStorage.getItem("UserAsistencia");
      setAsistencia(nuevaAsistencia);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="card mb-3"
      style={{
        width: "100%",
        fontSize: "15px",
        float: "inherit",
        padding: "1px 15px",
      }}
    >
      <div className="card-body" style={{ padding: "10px" }}>
        <h5
          className="card-title"
          style={{ textAlign: "center", padding: "2px", fontSize: "15px" }}
        >
          Asistencia
        </h5>

        <div
          style={{
            width: "100%",
            height: "40px",
            padding: "0.2rem",
            borderRadius: "5px 5px 0 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {asistencia ? (
            <p
              className="card-text"
              style={{
                padding: "4px 6px",
                marginBottom: "0",
                textAlign: "center",
              }}
            >
              {asistencia}/4
            </p>
          ) : (
            <p
              className="card-text"
              style={{
                padding: "5px",
                marginBottom: "0",
                textAlign: "center",
              }}
            >
              asistencia
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Asistencia;
