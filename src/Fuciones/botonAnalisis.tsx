import React, { useMemo, useState } from "react";
import { User } from "../interfaces/user";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "../css/graficos.css";

interface BotonAnalisisProps {
  usuarios: User[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const BotonAnalisis: React.FC<BotonAnalisisProps> = ({ usuarios }) => {
  const [showModal, setShowModal] = useState(false);

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
      return (
        <div className="graf-tooltip">
          <p className="graf-tooltip-title">{name}</p>
          <p className="graf-tooltip-value">{value} pagos</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <button
        className="btn btn-primary btn-sm"
        onClick={() => setShowModal(true)}
        disabled={usuarios.length === 0}
      >
        📊 Análisis de Ingresos
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content graf-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-modal-x"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>

            <h2 className="graf-modal-title">📈 Análisis de Ingresos</h2>

            <div className="graf-container-main">
              {/* COLUMNA IZQUIERDA - TARJETAS */}
              <div className="graf-tarjetas-section">
                <div className="graf-tarjeta">
                  <h6 className="graf-tarjeta-titulo">Total Recaudado</h6>
                  <h4 className="graf-tarjeta-valor text-success">
                    S/ {totalImporte.toFixed(2)}
                  </h4>
                </div>

                <div className="graf-tarjeta">
                  <h6 className="graf-tarjeta-titulo">Ingreso Yape</h6>
                  <h4 className="graf-tarjeta-valor text-primary">
                    S/ {ingresoYape.toFixed(2)}
                  </h4>
                </div>

                <div className="graf-tarjeta">
                  <h6 className="graf-tarjeta-titulo">Ingreso Físico</h6>
                  <h4 className="graf-tarjeta-valor text-warning">
                    S/ {ingresoFisico.toFixed(2)}
                  </h4>
                </div>

                <div className="graf-tarjeta">
                  <h6 className="graf-tarjeta-titulo">Otros Métodos</h6>
                  <h4 className="graf-tarjeta-valor text-info">
                    S/ {ingresoOtros.toFixed(2)}
                  </h4>
                </div>
              </div>

              {/* COLUMNA DERECHA - GRÁFICO */}
              <div className="graf-chart-section">
                <div className="graf-chart-card">
                  <h6 className="graf-chart-title">Métodos de Pago</h6>

                  {/* CONTENEDOR DEL GRÁFICO - VISIBLE SOLO EN ESCRITORIO */}
                  <div className="grafico-container-desktop">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={dataPagos}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          innerRadius={50}
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
                  </div>

                  {/* CONTENEDOR DEL GRÁFICO - VISIBLE SOLO EN MÓVILES */}
                  <div className="grafico-container-mobile">
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={dataPagos}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={40}
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
                  </div>

                  <div className="graf-legend-container">
                    {dataPagos.map((d, index) => (
                      <div key={`legend-${index}`} className="graf-legend-item">
                        <div
                          className="graf-legend-color"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <span className="graf-legend-text">
                          {d.name} ({d.value})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ELIMINAMOS EL FOOTER CON EL BOTÓN CERRAR */}
          </div>
        </div>
      )}
    </>
  );
};

export default BotonAnalisis;
