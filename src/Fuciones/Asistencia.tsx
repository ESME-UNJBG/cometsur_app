import { useUserSessionFull } from "../hook/useUserSession";
import { useEffect, useState } from "react";
import "../css/Asistencia.css";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const Asistencia = () => {
  const token = localStorage.getItem("Token");
  const userId = localStorage.getItem("userId");
  const { userData, loading, error } = useUserSessionFull(token, userId);
  const [asistencias, setAsistencias] = useState<number[]>([]);
  const [showModalAsistencia, setShowModalAsistencia] =
    useState<boolean>(false);
  const [showModalGrafico, setShowModalGrafico] = useState<boolean>(false);

  useEffect(() => {
    if (Array.isArray(userData?.asistencia)) {
      setAsistencias(userData.asistencia);
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

  // Dividir el array en días (pares de 2)
  const dias = [
    asistencias.slice(0, 2),
    asistencias.slice(2, 4),
    asistencias.slice(4, 6),
  ];

  // Calcular progreso por día
  const getProgreso = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

  // Colores de barras
  const getProgressClass = (valor: number) => {
    if (valor === 0) return "progress-bar-gray";
    if (valor === 1) return "progress-bar-yellow";
    if (valor === 2) return "progress-bar-green";
  };

  // Calcular progreso general (%)
  const totalAsistencias = asistencias.reduce((a, b) => a + b, 0);
  const porcentajeGeneral = Math.min((totalAsistencias / 6) * 100, 100);

  // Colores del gráfico según porcentaje
  const getColorGrafico = (valor: number) => {
    if (valor <= 50) return "#9e9e9e"; // plomo
    if (valor < 100) return "#fbc02d"; // amarillo
    return "#4caf50"; // verde
  };

  const data = [
    { name: "Asistencia", value: porcentajeGeneral },
    { name: "Faltante", value: 100 - porcentajeGeneral },
  ];

  return (
    <div className="asistencia-card">
      {/* 🔘 Grupo de botones principales */}
      <div className="asistencia-btn-group">
        <button
          className="asistencia-btn"
          onClick={() => setShowModalAsistencia(true)}
        >
          Ver Asistencias
        </button>

        <button
          className="progreso-btn"
          onClick={() => setShowModalGrafico(true)}
        >
          Mi progreso
        </button>
      </div>

      {/* 📅 Modal de Asistencia por Día */}
      {showModalAsistencia && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-modal-x"
              onClick={() => setShowModalAsistencia(false)}
            >
              ×
            </button>
            <h4 className="modal-title">Progreso de Asistencia</h4>

            {dias.map((dia, i) => {
              const progreso = getProgreso(dia);
              const progressClass = getProgressClass(progreso);
              const porcentaje = (progreso / 2) * 100;

              return (
                <div key={i} className="modal-dia">
                  <div className="modal-dia-info">
                    <p className="dia-label">Día {i + 1}</p>
                    <p className="dia-progreso">{progreso}/2</p>
                  </div>
                  {/* Fondo gris siempre visible */}
                  <div className="asistencia-progress">
                    <div
                      className={`asistencia-progress-bar ${progressClass}`}
                      style={{ width: `${Math.max(porcentaje, 4)}%` }} // mínimo 4% para que se vea la base
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 📊 Modal de Progreso General */}
      {showModalGrafico && (
        <div className="modal-overlay">
          <div className="modal-content grafico-modal">
            <button
              className="close-modal-x"
              onClick={() => setShowModalGrafico(false)}
            >
              ×
            </button>

            <h4 className="modal-title">Progreso General</h4>

            <div className="grafico-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                  >
                    <Cell fill={getColorGrafico(porcentajeGeneral)} />
                    <Cell fill="#e0e0e0" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="grafico-porcentaje">
                {porcentajeGeneral.toFixed(0)}%
              </div>
            </div>

            {porcentajeGeneral === 100 ? (
              <p className="grafico-completado">
                🎉 Asistencia completada. Acércate a nuestros organizadores para
                reclamar tu certificado.
              </p>
            ) : (
              <p className="grafico-completado">
                Progreso actual de tus asistencias.
              </p>
            )}
          </div>
        </div>
      )}

      {error && (
        <small className="asistencia-error">Error al cargar datos</small>
      )}
    </div>
  );
};

export default Asistencia;
