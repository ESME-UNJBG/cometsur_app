// src/Funciones/BotonAnalisis.tsx
import React, { useMemo, useState } from "react";
import { User } from "../interfaces/user";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface BotonAnalisisProps {
  usuarios: User[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A020F0",
  "#FF6384",
];

const BotonAnalisis: React.FC<BotonAnalisisProps> = ({ usuarios }) => {
  const [showModal, setShowModal] = useState(false);

  // Total Importe
  const totalImporte = useMemo(
    () => usuarios.reduce((sum, u) => sum + (parseFloat(u.importe) || 0), 0),
    [usuarios]
  );

  // Datos por categoría
  const dataCategorias: { name: string; value: number }[] = useMemo(() => {
    const conteo: Record<string, number> = {};
    usuarios.forEach((u) => {
      conteo[u.category] = (conteo[u.category] || 0) + 1;
    });
    return Object.entries(conteo).map(([name, value]) => ({ name, value }));
  }, [usuarios]);

  // Datos por universidad
  const dataUniversidades: { name: string; value: number }[] = useMemo(() => {
    const conteo: Record<string, number> = {};
    usuarios.forEach((u) => {
      conteo[u.university] = (conteo[u.university] || 0) + 1;
    });
    return Object.entries(conteo).map(([name, value]) => ({ name, value }));
  }, [usuarios]);

  // Totales para tooltips
  const totalCategorias = dataCategorias.reduce((sum, d) => sum + d.value, 0);
  const totalUniversidades = dataUniversidades.reduce(
    (sum, d) => sum + d.value,
    0
  );

  const dataCategoriasWithTotal = dataCategorias.map((d) => ({
    ...d,
    total: totalCategorias,
  }));
  const dataUniversidadesWithTotal = dataUniversidades.map((d) => ({
    ...d,
    total: totalUniversidades,
  }));

  // Tooltip personalizado
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { payload: { name: string; value: number; total: number } }[];
  }) => {
    if (active && payload && payload.length) {
      const { name, value, total } = payload[0].payload;
      const percentage = ((value ?? 0) / (total ?? 1)) * 100;

      return (
        <div
          style={{
            background: "#fff",
            border: "1px solid #ccc",
            padding: "5px 10px",
            borderRadius: 4,
          }}
        >
          <p style={{ margin: 0, fontSize: 12, fontWeight: "bold" }}>{name}</p>
          <p style={{ margin: 0, fontSize: 12 }}>
            {value} ({percentage.toFixed(1)}%)
          </p>
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
        📊 Análisis
      </button>

      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  📈 Análisis de Asistentes
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>

              <div className="modal-body">
                <div className="row text-center">
                  {/* Total Importe */}
                  <div className="col-md-4 mb-3">
                    <div className="card shadow-sm p-3">
                      <h6 className="fw-bold text-secondary">Total Importe</h6>
                      <h4
                        className="text-success fw-bold"
                        style={{ fontSize: "1.2rem" }}
                      >
                        S/ {totalImporte.toFixed(2)}
                      </h4>
                    </div>
                  </div>

                  {/* Por Categoría */}
                  <div className="col-md-4 mb-3">
                    <div className="card shadow-sm p-2">
                      <h6 className="fw-bold text-secondary">Por Categoría</h6>
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie
                            data={dataCategoriasWithTotal}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            dataKey="value"
                          >
                            {dataCategoriasWithTotal.map((_, index) => (
                              <Cell
                                key={`cat-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Leyenda debajo */}
                      <div className="mt-2 d-flex flex-wrap justify-content-center">
                        {dataCategoriasWithTotal.map((d, index) => (
                          <div
                            key={`legend-cat-${index}`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginRight: 10,
                              fontSize: 12,
                            }}
                          >
                            <div
                              style={{
                                width: 12,
                                height: 12,
                                backgroundColor: COLORS[index % COLORS.length],
                                marginRight: 4,
                              }}
                            />
                            {d.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Por Universidad */}
                  <div className="col-md-4 mb-3">
                    <div className="card shadow-sm p-2">
                      <h6 className="fw-bold text-secondary">
                        Por Universidad
                      </h6>
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie
                            data={dataUniversidadesWithTotal}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            dataKey="value"
                          >
                            {dataUniversidadesWithTotal.map((_, index) => (
                              <Cell
                                key={`uni-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Leyenda debajo */}
                      <div className="mt-2 d-flex flex-wrap justify-content-center">
                        {dataUniversidadesWithTotal.map((d, index) => (
                          <div
                            key={`legend-uni-${index}`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginRight: 10,
                              fontSize: 12,
                            }}
                          >
                            <div
                              style={{
                                width: 12,
                                height: 12,
                                backgroundColor: COLORS[index % COLORS.length],
                                marginRight: 4,
                              }}
                            />
                            {d.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BotonAnalisis;
