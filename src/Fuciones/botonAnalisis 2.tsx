import React, { useMemo, useState, useEffect } from "react";
import { User } from "../interfaces/user";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "../css/graficos.css";

interface BotonAnalisisAsistenciaProps {
  usuarios: User[];
}

const COLORS = {
  dia1: "#0088FE",
  dia2: "#00C49F",
  dia3: "#FFBB28",
  general: "#FF8042",
  incompleto: "#e0e0e0",
};

const BotonAnalisisAsistencia: React.FC<BotonAnalisisAsistenciaProps> = ({
  usuarios,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Estilos en línea para el botón verde esmeralda
  const buttonStyle = {
    border: "none",
    borderRadius: "20px", // Igual de redondeado
    padding: "0.5rem 1.5rem",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "0.875rem",
    transition: "all 0.3s ease",
    minWidth: "160px",
    background: isHovered
      ? "linear-gradient(135deg, #1e7e34, #2D8C00)"
      : "linear-gradient(135deg, #28a745, #1e7e34)",
    boxShadow: isHovered
      ? "0 6px 15px rgba(40, 167, 69, 0.4)"
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

  // Asistencia Día 1 (posiciones 0,1)
  const asistenciaDia1 = useMemo(() => {
    const completos = usuarios.filter(
      (user) =>
        user.asistencia && user.asistencia[0] === 1 && user.asistencia[1] === 1
    ).length;

    const porcentaje =
      totalRegistrados > 0 ? (completos / totalRegistrados) * 100 : 0;

    return {
      completos,
      incompletos: totalRegistrados - completos,
      porcentaje,
    };
  }, [usuarios, totalRegistrados]);

  // Asistencia Día 2 (posiciones 2,3)
  const asistenciaDia2 = useMemo(() => {
    const completos = usuarios.filter(
      (user) =>
        user.asistencia && user.asistencia[2] === 1 && user.asistencia[3] === 1
    ).length;

    const porcentaje =
      totalRegistrados > 0 ? (completos / totalRegistrados) * 100 : 0;

    return {
      completos,
      incompletos: totalRegistrados - completos,
      porcentaje,
    };
  }, [usuarios, totalRegistrados]);

  // Asistencia Día 3 (posiciones 4,5)
  const asistenciaDia3 = useMemo(() => {
    const completos = usuarios.filter(
      (user) =>
        user.asistencia && user.asistencia[4] === 1 && user.asistencia[5] === 1
    ).length;

    const porcentaje =
      totalRegistrados > 0 ? (completos / totalRegistrados) * 100 : 0;

    return {
      completos,
      incompletos: totalRegistrados - completos,
      porcentaje,
    };
  }, [usuarios, totalRegistrados]);

  // Asistencia General (CORREGIDO: los TRES días completos)
  const asistenciaGeneral = useMemo(() => {
    const completos = usuarios.filter(
      (user) =>
        user.asistencia &&
        user.asistencia[0] === 1 &&
        user.asistencia[1] === 1 && // Día 1 completo
        user.asistencia[2] === 1 &&
        user.asistencia[3] === 1 && // Día 2 completo
        user.asistencia[4] === 1 &&
        user.asistencia[5] === 1 // Día 3 completo
    ).length;

    const porcentaje =
      totalRegistrados > 0 ? (completos / totalRegistrados) * 100 : 0;

    return {
      completos,
      incompletos: totalRegistrados - completos,
      porcentaje,
    };
  }, [usuarios, totalRegistrados]);

  // Tooltip tipado
  interface TooltipProps {
    active?: boolean;
    payload?: { payload: { name: string; value: number } }[];
  }

  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
      const { name, value } = payload[0].payload;
      const porcentaje =
        totalRegistrados > 0
          ? ((value / totalRegistrados) * 100).toFixed(1)
          : "0";

      return (
        <div className="ba-tooltip">
          <p className="ba-tooltip-title">{name}</p>
          <p className="ba-tooltip-value">
            {value} usuarios ({porcentaje}%)
          </p>
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
        📅 Análisis de Asistencia
      </button>

      {showModal && (
        <div className="ba-modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="ba-modal-content ba-modal-asistencia"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="ba-close-btn"
              onClick={() => setShowModal(false)}
              aria-label="Cerrar modal"
            >
              ×
            </button>

            <h2 className="ba-modal-title">📊 Análisis de Asistencia</h2>

            {/* CONTENEDOR PRINCIPAL - 5 COLUMNAS CORREGIDAS */}
            <div className="ba-container-asistencia">
              {/* COLUMNA 1 - TOTAL SOLO */}
              <div className="ba-col-total-solo">
                <div className="ba-tarjeta-total-compact bg-warning">
                  <h6 className="ba-tarjeta-titulo">Total Registrados</h6>
                  <h3 className="ba-total-value">{totalRegistrados}</h3>
                  <p className="ba-total-label">usuarios</p>
                </div>
              </div>

              {/* COLUMNA 2 - DÍA 1 */}
              <div className="ba-chart-card-asistencia">
                <h6 className="ba-chart-title">Día 1</h6>
                <div
                  className="ba-porcentaje-badge"
                  style={{ backgroundColor: COLORS.dia1 }}
                >
                  {asistenciaDia1.porcentaje.toFixed(1)}%
                </div>
                <div className="ba-chart-content">
                  <div className="ba-grafico-container-large">
                    {totalRegistrados > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              {
                                name: "Completo",
                                value: asistenciaDia1.completos,
                              },
                              {
                                name: "Incompleto",
                                value: asistenciaDia1.incompletos,
                              },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={75}
                            innerRadius={30}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            <Cell key="completo" fill={COLORS.dia1} />
                            <Cell key="incompleto" fill={COLORS.incompleto} />
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="ba-no-data">Sin datos</div>
                    )}
                  </div>
                  <div className="ba-legend-simple">
                    <div className="ba-legend-item-simple">
                      <div
                        className="ba-legend-color"
                        style={{ backgroundColor: COLORS.dia1 }}
                      />
                      <span className="ba-legend-text">
                        Completos: {asistenciaDia1.completos}
                      </span>
                    </div>
                    <div className="ba-legend-item-simple">
                      <div
                        className="ba-legend-color"
                        style={{ backgroundColor: COLORS.incompleto }}
                      />
                      <span className="ba-legend-text">
                        Incompletos: {asistenciaDia1.incompletos}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUMNA 3 - DÍA 2 */}
              <div className="ba-chart-card-asistencia">
                <h6 className="ba-chart-title">Día 2</h6>
                <div
                  className="ba-porcentaje-badge"
                  style={{ backgroundColor: COLORS.dia2 }}
                >
                  {asistenciaDia2.porcentaje.toFixed(1)}%
                </div>
                <div className="ba-chart-content">
                  <div className="ba-grafico-container-large">
                    {totalRegistrados > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              {
                                name: "Completo",
                                value: asistenciaDia2.completos,
                              },
                              {
                                name: "Incompleto",
                                value: asistenciaDia2.incompletos,
                              },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={75}
                            innerRadius={30}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            <Cell key="completo" fill={COLORS.dia2} />
                            <Cell key="incompleto" fill={COLORS.incompleto} />
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="ba-no-data">Sin datos</div>
                    )}
                  </div>
                  <div className="ba-legend-simple">
                    <div className="ba-legend-item-simple">
                      <div
                        className="ba-legend-color"
                        style={{ backgroundColor: COLORS.dia2 }}
                      />
                      <span className="ba-legend-text">
                        Completos: {asistenciaDia2.completos}
                      </span>
                    </div>
                    <div className="ba-legend-item-simple">
                      <div
                        className="ba-legend-color"
                        style={{ backgroundColor: COLORS.incompleto }}
                      />
                      <span className="ba-legend-text">
                        Incompletos: {asistenciaDia2.incompletos}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUMNA 4 - DÍA 3 */}
              <div className="ba-chart-card-asistencia">
                <h6 className="ba-chart-title">Día 3</h6>
                <div
                  className="ba-porcentaje-badge"
                  style={{ backgroundColor: COLORS.dia3 }}
                >
                  {asistenciaDia3.porcentaje.toFixed(1)}%
                </div>
                <div className="ba-chart-content">
                  <div className="ba-grafico-container-large">
                    {totalRegistrados > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              {
                                name: "Completo",
                                value: asistenciaDia3.completos,
                              },
                              {
                                name: "Incompleto",
                                value: asistenciaDia3.incompletos,
                              },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={75}
                            innerRadius={30}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            <Cell key="completo" fill={COLORS.dia3} />
                            <Cell key="incompleto" fill={COLORS.incompleto} />
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="ba-no-data">Sin datos</div>
                    )}
                  </div>
                  <div className="ba-legend-simple">
                    <div className="ba-legend-item-simple">
                      <div
                        className="ba-legend-color"
                        style={{ backgroundColor: COLORS.dia3 }}
                      />
                      <span className="ba-legend-text">
                        Completos: {asistenciaDia3.completos}
                      </span>
                    </div>
                    <div className="ba-legend-item-simple">
                      <div
                        className="ba-legend-color"
                        style={{ backgroundColor: COLORS.incompleto }}
                      />
                      <span className="ba-legend-text">
                        Incompletos: {asistenciaDia3.incompletos}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUMNA 5 - GENERAL (CORREGIDO: TRES DÍAS COMPLETOS) */}
              <div className="ba-chart-card-asistencia">
                <h6 className="ba-chart-title">GENERAL</h6>
                <div
                  className="ba-porcentaje-badge"
                  style={{ backgroundColor: COLORS.general }}
                >
                  {asistenciaGeneral.porcentaje.toFixed(1)}%
                </div>
                <div className="ba-chart-content">
                  <div className="ba-grafico-container-large">
                    {totalRegistrados > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              {
                                name: "Completo",
                                value: asistenciaGeneral.completos,
                              },
                              {
                                name: "Incompleto",
                                value: asistenciaGeneral.incompletos,
                              },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={75}
                            innerRadius={30}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            <Cell key="completo" fill={COLORS.general} />
                            <Cell key="incompleto" fill={COLORS.incompleto} />
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="ba-no-data">Sin datos</div>
                    )}
                  </div>
                  <div className="ba-legend-simple">
                    <div className="ba-legend-item-simple">
                      <div
                        className="ba-legend-color"
                        style={{ backgroundColor: COLORS.general }}
                      />
                      <span className="ba-legend-text">
                        3 días completos: {asistenciaGeneral.completos}
                      </span>
                    </div>
                    <div className="ba-legend-item-simple">
                      <div
                        className="ba-legend-color"
                        style={{ backgroundColor: COLORS.incompleto }}
                      />
                      <span className="ba-legend-text">
                        No completaron: {asistenciaGeneral.incompletos}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* EXPLICACIÓN DE LAS COLUMNAS */}
          </div>
        </div>
      )}
    </>
  );
};

export default BotonAnalisisAsistencia;
