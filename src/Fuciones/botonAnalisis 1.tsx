import React, { useMemo, useState, useEffect } from "react";
import { User } from "../interfaces/user";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "../css/graficos.css";

interface BotonAnalisisRegistrosProps {
  usuarios: User[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#FF6B6B",
  "#4ECDC4",
];

const BotonAnalisisRegistros: React.FC<BotonAnalisisRegistrosProps> = ({
  usuarios,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Estilos en línea para el botón azul
  const buttonStyle = {
    border: "none",
    borderRadius: "20px", // Más redondeado
    padding: "0.5rem 1.5rem",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "0.875rem",
    transition: "all 0.3s ease",
    minWidth: "160px",
    background: isHovered
      ? "linear-gradient(135deg, #004c66, #005f80)"
      : "linear-gradient(135deg, #005f80, #004c66)",
    boxShadow: isHovered
      ? "0 6px 15px rgba(0, 95, 128, 0.4)"
      : "0 4px 12px rgba(0, 0, 0, 0.2)",
    transform: isHovered ? "translateY(-2px)" : "none",
    opacity: usuarios.length === 0 ? 0.6 : 1,
  };

  // Controlar scroll del body
  useEffect(() => {
    if (showModal) {
      document.body.classList.add("ba-modal-open");
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.classList.remove("ba-modal-open");
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.classList.remove("ba-modal-open");
      document.documentElement.style.overflow = "";
    };
  }, [showModal]);

  // === CALCULOS ===
  const totalRegistrados = useMemo(() => usuarios.length, [usuarios]);

  // Agrupar y contar por universidad
  const dataUniversidad = useMemo(() => {
    const counts: Record<string, number> = {};
    usuarios.forEach((user) => {
      const uni = user.university?.trim() || "No especificado";
      counts[uni] = (counts[uni] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value); // Ordenar por cantidad descendente
  }, [usuarios]);

  // Agrupar y contar por profesión
  const dataProfesion = useMemo(() => {
    const counts: Record<string, number> = {};
    usuarios.forEach((user) => {
      const prof = user.profesion?.trim() || "No especificado";
      counts[prof] = (counts[prof] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [usuarios]);

  // Agrupar y contar por categoría
  const dataCategoria = useMemo(() => {
    const counts: Record<string, number> = {};
    usuarios.forEach((user) => {
      const cat = user.category?.trim() || "No especificado";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [usuarios]);

  // Tooltip tipado
  interface TooltipProps {
    active?: boolean;
    payload?: { payload: { name: string; value: number } }[];
  }

  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
      const { name, value } = payload[0].payload;
      return (
        <div className="ba-tooltip">
          <p className="ba-tooltip-title">{name}</p>
          <p className="ba-tooltip-value">{value} usuarios</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <button
        style={buttonStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setShowModal(true)}
        disabled={usuarios.length === 0}
      >
        📋 Análisis de Registros
      </button>

      {showModal && (
        <div className="ba-modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="ba-modal-content ba-modal-registros"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="ba-close-btn"
              onClick={() => setShowModal(false)}
              aria-label="Cerrar modal"
            >
              ×
            </button>

            <h2 className="ba-modal-title">📊 Análisis de Registros</h2>

            {/* CONTENEDOR PRINCIPAL - 4 COLUMNAS */}
            <div className="ba-container-registros">
              {/* COLUMNA 1 - TOTAL */}
              <div className="ba-col-total">
                <div className="ba-tarjeta-total-compact">
                  <h6 className="ba-tarjeta-titulo">Total Registrados</h6>
                  <h3 className="ba-total-value">{totalRegistrados}</h3>
                  <p className="ba-total-label">usuarios</p>
                </div>
              </div>

              {/* COLUMNA 2 - UNIVERSIDAD */}
              <div className="ba-chart-card-registros">
                <h6 className="ba-chart-title">Por Universidad</h6>
                <div className="ba-chart-with-legend">
                  <div className="ba-grafico-container-compact">
                    {dataUniversidad.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dataUniversidad}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            innerRadius={25}
                            paddingAngle={1}
                            dataKey="value"
                          >
                            {dataUniversidad.map((_, index) => (
                              <Cell
                                key={`cell-uni-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="ba-no-data">Sin datos</div>
                    )}
                  </div>
                  <div className="ba-legend-list">
                    {dataUniversidad.map((d, index) => (
                      <div
                        key={`legend-uni-${index}`}
                        className="ba-legend-line"
                      >
                        <div
                          className="ba-legend-color"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <span className="ba-legend-name">{d.name}</span>
                        <span className="ba-legend-count">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* COLUMNA 3 - PROFESIÓN */}
              <div className="ba-chart-card-registros">
                <h6 className="ba-chart-title">Por Profesión</h6>
                <div className="ba-chart-with-legend">
                  <div className="ba-grafico-container-compact">
                    {dataProfesion.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dataProfesion}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            innerRadius={25}
                            paddingAngle={1}
                            dataKey="value"
                          >
                            {dataProfesion.map((_, index) => (
                              <Cell
                                key={`cell-prof-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="ba-no-data">Sin datos</div>
                    )}
                  </div>
                  <div className="ba-legend-list">
                    {dataProfesion.map((d, index) => (
                      <div
                        key={`legend-prof-${index}`}
                        className="ba-legend-line"
                      >
                        <div
                          className="ba-legend-color"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <span className="ba-legend-name">{d.name}</span>
                        <span className="ba-legend-count">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* COLUMNA 4 - CATEGORÍA */}
              <div className="ba-chart-card-registros">
                <h6 className="ba-chart-title">Por Categoría</h6>
                <div className="ba-chart-with-legend">
                  <div className="ba-grafico-container-compact">
                    {dataCategoria.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dataCategoria}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            innerRadius={25}
                            paddingAngle={1}
                            dataKey="value"
                          >
                            {dataCategoria.map((_, index) => (
                              <Cell
                                key={`cell-cat-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="ba-no-data">Sin datos</div>
                    )}
                  </div>
                  <div className="ba-legend-list">
                    {dataCategoria.map((d, index) => (
                      <div
                        key={`legend-cat-${index}`}
                        className="ba-legend-line"
                      >
                        <div
                          className="ba-legend-color"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <span className="ba-legend-name">{d.name}</span>
                        <span className="ba-legend-count">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BotonAnalisisRegistros;
