import React, { useMemo, useState, useEffect } from "react";
import { User } from "../interfaces/user";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "../css/graficos.css";

interface BotonAnalisisProps {
  usuarios: User[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const BotonAnalisis: React.FC<BotonAnalisisProps> = ({ usuarios }) => {
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Estilos en línea para el botón vino
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
      ? "linear-gradient(135deg, #5a0825, #47031d)"
      : "linear-gradient(135deg, #722f37, #5a0825)",
    boxShadow: isHovered
      ? "0 6px 15px rgba(114, 47, 55, 0.4)"
      : "0 4px 12px rgba(0, 0, 0, 0.2)",
    transform: isHovered ? "translateY(-2px)" : "none",
    opacity: usuarios.length === 0 ? 0.6 : 1,
  };

  // Controlar scroll del body de manera más robusta
  useEffect(() => {
    if (showModal) {
      document.body.classList.add("ba-modal-open");
      // Prevenir cualquier scroll del parent
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
  const totalImporte = useMemo(
    () => usuarios.reduce((sum, u) => sum + (parseFloat(u.importe) || 0), 0),
    [usuarios]
  );

  const ingresoYape = useMemo(
    () =>
      usuarios
        .filter((u) => u.pago === "Yape")
        .reduce((sum, u) => sum + (parseFloat(u.importe) || 0), 0),
    [usuarios]
  );

  const ingresoFisico = useMemo(
    () =>
      usuarios
        .filter((u) => u.pago === "Físico")
        .reduce((sum, u) => sum + (parseFloat(u.importe) || 0), 0),
    [usuarios]
  );

  const ingresoOtros = useMemo(
    () =>
      usuarios
        .filter((u) => u.pago === "Otro")
        .reduce((sum, u) => sum + (parseFloat(u.importe) || 0), 0),
    [usuarios]
  );

  // === GRAFICO ===
  const dataPagos = useMemo(
    () => [
      { name: "Yape", value: usuarios.filter((u) => u.pago === "Yape").length },
      {
        name: "Físico",
        value: usuarios.filter((u) => u.pago === "Físico").length,
      },
      { name: "Otro", value: usuarios.filter((u) => u.pago === "Otro").length },
    ],
    [usuarios]
  );

  // Tooltip tipado
  interface TooltipProps {
    active?: boolean;
    payload?: { payload: { name: string; value: number } }[];
  }

  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
      const { name, value } = payload[0].payload;
      const total = dataPagos.reduce((sum, item) => sum + item.value, 0);
      const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;

      return (
        <div className="ba-tooltip">
          <p className="ba-tooltip-title">{name}</p>
          <p className="ba-tooltip-value">
            {value} pagos ({percentage}%)
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
        📊 Análisis de Ingresos
      </button>

      {showModal && (
        <div className="ba-modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="ba-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="ba-close-btn"
              onClick={() => setShowModal(false)}
              aria-label="Cerrar modal"
            >
              ×
            </button>

            <h2 className="ba-modal-title">📈 Análisis de Ingresos</h2>

            <div className="ba-container-main">
              {/* COLUMNA IZQUIERDA - TARJETAS */}
              <div className="ba-tarjetas-section">
                <div className="ba-tarjeta">
                  <h6 className="ba-tarjeta-titulo">Total Recaudado</h6>
                  <h4 className="ba-tarjeta-valor text-success">
                    S/ {totalImporte.toFixed(2)}
                  </h4>
                </div>

                <div className="ba-tarjeta">
                  <h6 className="ba-tarjeta-titulo">Ingreso Yape</h6>
                  <h4 className="ba-tarjeta-valor text-primary">
                    S/ {ingresoYape.toFixed(2)}
                  </h4>
                </div>

                <div className="ba-tarjeta">
                  <h6 className="ba-tarjeta-titulo">Ingreso Físico</h6>
                  <h4 className="ba-tarjeta-valor text-warning">
                    S/ {ingresoFisico.toFixed(2)}
                  </h4>
                </div>

                <div className="ba-tarjeta">
                  <h6 className="ba-tarjeta-titulo">Otros Métodos</h6>
                  <h4 className="ba-tarjeta-valor text-info">
                    S/ {ingresoOtros.toFixed(2)}
                  </h4>
                </div>
              </div>

              {/* COLUMNA DERECHA - GRÁFICO */}
              <div className="ba-chart-section">
                <div className="ba-chart-card">
                  <h6 className="ba-chart-title">Métodos de Pago</h6>

                  <div className="ba-grafico-container">
                    {dataPagos.some((item) => item.value > 0) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dataPagos}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            innerRadius={35}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {dataPagos.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="ba-no-data">
                        No hay datos para mostrar el gráfico
                      </div>
                    )}
                  </div>

                  <div className="ba-legend-container">
                    {dataPagos.map((d, index) => (
                      <div key={`legend-${index}`} className="ba-legend-item">
                        <div
                          className="ba-legend-color"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <span className="ba-legend-text">
                          {d.name} ({d.value})
                        </span>
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

export default BotonAnalisis;
