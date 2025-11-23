import React from "react";
import "../css/ModalDay1.css";

interface ModalDay1Props {
  isOpen: boolean;
  onClose: () => void;
}

const ModalDay1: React.FC<ModalDay1Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const SPECIAL_CELLS = ["1.1", "2.4", "3.4", "4.1"];

  const cellData = [
    {
      id: "1.1",
      subHeader: "8:00 - 8:35",
      header: "REGISTRO Y ENTREGA DE CREDENCIALES 📝",
      smallText: "",
      text: "",
      divided: false,
    },
    {
      id: "1.2",
      subHeader: "8:35 - 9:05",
      header: "ING. RONALD RODRIGUEZ",
      smallText: "JEFE DE CONTROL DE PROCESOS SPCC",
      text: "MAXIMIZACIÓN DE LA RECUPERACIÓN DE AGUA EN EL - ESPESADOR DE RELAVES R5 - MEDIANTE INTELIGENCIA ARTIFICIAL Y CONTROL AVANZADO ADAPTATIVO",
      divided: true,
    },
    {
      id: "1.3",
      subHeader: "9:05 - 9:30",
      header: "ING. PABLO JEQUIER ",
      smallText: "BYMA INSTRUMENTS",
      text: "OPTIMIZACIÓN DEL CONTROL DE CALIDAD METALÚRGICO MEDIANTE ESPECTROMETRÍA XRF PORTÁTIL: CASO PROSPECTOR 3",
      divided: true,
    },
    {
      id: "1.4",
      subHeader: "9:30 - 10:00",
      header: "ING. JOSÉ DÁVILA",
      smallText: "GERENTE DE CONCENTRADORA CUAJONE SPCC",
      text: "PLATAFORMA DE GESTIÓN OPERACIONAL AVANZADA",
      divided: true,
    },

    {
      id: "2.1",
      subHeader: "10:00 - 10:30",
      header: "ING. RENÉ LLERENA",
      smallText: "GERENTE DE CONCENTRADORA TOQUEPALA SPCC",
      text: "OPTIMIZACIÓN DE LA MOLIENDA MEDIANTE LA CONVERSIÓN DE MOLINOS DE BARRAS A MOLINO DE BOLAS",
      divided: true,
    },
    {
      id: "2.2",
      subHeader: "10:30 - 11:00",
      header: "ING. VALERY ARANA",
      smallText: "JEFE DE METALURGIA DE MINERA BOROO MISQUICHILCA",
      text: "USO DE NUEVAS TECNOLOGÍAS EN EL PROCESO DE RECUPERACIÓN DE ORO EN MINERALES AURÍFEROS",
      divided: true,
    },
    {
      id: "2.3",
      subHeader: "11:00 - 11:45",
      header: "ING. JORGE MEZA",
      smallText: "DIRECTOR GENERAL DE OPERACIONES SPCC",
      text: "IMPACTO DE LA MINERÍA EN EL SUR DEL PERÚ",
      divided: true,
    },
    {
      id: "2.4",
      subHeader: "11:45 - 12:30",
      header: "CEREMONIA DE APERTURA ✂️",
      smallText: "",
      text: "",
      divided: false,
    },

    {
      id: "3.1",
      subHeader: "12:30 - 13:15",
      header: "ING. EDGAR CANTA",
      smallText: "GERENTE PLANTA DE MINERA LAS BAMBAS",
      text: "INCREMENTO DEL THROUGPHUT EN MOLINO SAG E INCREMENTO DE PRODUCCIÓN CU FINO SIN CAPEX",
      divided: true,
    },
    {
      id: "3.2",
      subHeader: "13:15 - 13:45",
      header: "ING. FLAVIO BEGAZO",
      smallText: "GERENTE DE REFINERÍA ILO SPCC",
      text: "MODERNIZACIÓN DE LA REFINERÍA DE COBRE DE ILO CON LA TECNOLOGÍA DE CÁTODOS PERMANENTES, PRODUCIENDO LOS CÁTODOS DE MAYOR PESO A NIVEL MUNDIAL",
      divided: true,
    },
    {
      id: "3.3",
      subHeader: "13:45 - 14:15",
      header: "ING. ENRIQUE HERRERA",
      smallText: "GERENTE DE FUNDICIÓN ILO SPCC",
      text: "LA FUNDICIÓN DE ILO, UNA REALIDAD PRESENTE Y SUSTENTABLE",
      divided: true,
    },
    {
      id: "3.4",
      subHeader: "14:40 - 16:00",
      header: "ALMUERZO 🍽️",
      smallText: "",
      text: "",
      divided: false,
    },
    {
      id: "4.1",
      subHeader: "17:00 - 20:00",
      header: "CAMPEONATO DEPORTIVO 🥅⚽",
      smallText: "",
      text: "",
      divided: false,
    },
  ];

  return (
    <div className="ba-day1-overlay" onClick={handleOverlayClick}>
      <div className="ba-day1-modal">
        {/* HEADER FIJO */}
        <div className="ba-day1-header">
          <span className="ba-day1-title">
            AUDITORIO "JUAN FIGUEROA SALGADO"
          </span>
          <button className="ba-day1-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="ba-day1-grid">
          {cellData.map((cell) => {
            const isSpecial = SPECIAL_CELLS.includes(cell.id);

            return (
              <div
                key={cell.id}
                className={`ba-day1-cell ${isSpecial ? "special-cell" : ""}`}
              >
                {/* contenido interior (no contiene tooltip) */}
                <div
                  className={`ba-day1-inner ${isSpecial ? "center-inner" : ""}`}
                >
                  <div className="ba-day1-new-header">{cell.subHeader}</div>

                  <div
                    className={`ba-day1-cell-header ${
                      cell.divided ? "divided" : ""
                    }`}
                  >
                    {cell.header}
                  </div>

                  {!isSpecial && cell.smallText && (
                    <div className="ba-day1-cell-small">{cell.smallText}</div>
                  )}

                  {/* Texto para móvil (si hay) */}
                  {!isSpecial && cell.text && (
                    <div className="ba-day1-cell-text">{cell.text}</div>
                  )}
                </div>

                {/* tooltip RENDERIZADO FUERA del inner para que no se recorte */}
                {!isSpecial && cell.text && (
                  <div className="ba-day1-tooltip" role="tooltip" aria-hidden>
                    {cell.text}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModalDay1;
