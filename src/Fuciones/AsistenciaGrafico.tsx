import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "../css/Asistencia.css";

interface Props {
  asistencias: number[];
  onClose: () => void;
}

const AsistenciaGrafico: React.FC<Props> = ({ asistencias, onClose }) => {
  const totalAsistencias = asistencias.reduce((a, b) => a + b, 0);
  const porcentaje = (totalAsistencias / 6) * 100;

  let color = "#9e9e9e"; // gris
  if (totalAsistencias >= 4 && totalAsistencias < 6) color = "#fbc02d"; // amarillo
  if (totalAsistencias === 6) color = "#4caf50"; // verde

  const data = [
    { name: "Asistencias", value: porcentaje },
    { name: "Faltantes", value: 100 - porcentaje },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content grafico-modal">
        <button className="close-modal-x" onClick={onClose}>
          ✕
        </button>
        <h4 className="modal-title">Progreso General</h4>

        <div className="grafico-container">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={60}
                outerRadius={80}
                startAngle={90}
                endAngle={-270}
              >
                <Cell key="asistencias" fill={color} />
                <Cell key="faltantes" fill="#e0e0e0" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <p className="grafico-porcentaje">{porcentaje.toFixed(0)}%</p>
        </div>

        {porcentaje === 100 && (
          <p className="grafico-completado">
            ✅ Asistencia completada. Acércate a nuestros organizadores para
            reclamar tu certificado.
          </p>
        )}
      </div>
    </div>
  );
};

export default AsistenciaGrafico;
