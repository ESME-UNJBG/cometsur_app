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

  const SPECIAL_CELLS = ["1.1", "2.3", "3.3", "3.4"];

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
      subHeader: "8:35 - 9:00",
      header: "DR. PEDRO CAMERO",
      smallText: "UNIVERSIDAD NACIONAL SAN ANTONIO DE ABAD DEL CUSCO",
      text: "LA INGENIERÍA Y EL MEDIO AMBIENTE",
      divided: true,
    },
    {
      id: "1.3",
      subHeader: "9:00 - 9:25",
      header: "DR. KUMARESAN NADESAN",
      smallText: "TÉCNICO EN TECNOLOGÍA ULTRA LIMPIA",
      text: "SÍNTESIS DE FABRICACIÓN DE NANOCOMPUESTOS DE AC CON COS INCORPORADO PARA UNA APLICACIÓN EFICIENTE EN SUPERCONDENSADORES ASIMÉTRICOS",
      divided: true,
    },
    {
      id: "1.4",
      subHeader: "9:25 - 9:50",
      header: "DR. T. CHÁVEZ, L. CASO, I. CHAVEZ, M. VIVAR",
      smallText: "UNIVERSIDAD NACIONAL JORGE BASADRE GROHMANN",
      text: "EXPLORACIÓN GEOLÓGICA, GEOFÍSICA Y GEOQUÍMICA PARA LA EXTRACCIÓN DE LITIO EN EL ARCO MAGMÁTICOMESO - CENOZOICO DE LA REGIÓN TACNA",
      divided: true,
    },

    {
      id: "2.1",
      subHeader: "9:50 - 10:15",
      header: "DR. T. SOTO Y ING. J. ALVAREZ",
      smallText: "UNIVERSIDAD NACIONAL JORGE BASADRE GROHMANN",
      text: "DISEÑO, CONSTRUCCIÓN Y EVALUACIÓN DE CELDAS DE ELECTRODEPOSITACIÓN",
      divided: true,
    },
    {
      id: "2.2",
      subHeader: "10:15 - 10:40",
      header: "MG. HONORATO SANCHEZ",
      smallText: "UNIVERSIDAD NACIONAL SAN ANTONIO DE ABAD DEL CUSCO",
      text: "GAS NATURAL DE CAMISEA: CATALIZADOR PARA LA TRANSICIÓN ENERGÉTICA Y COMPETITIVIDAD EN LOS SISTEMAS METALÚRGICOS DEL CORREDOR ECONÓMICO CUSCO-APURIMAC-MADRE DE DIOS",
      divided: true,
    },
    {
      id: "2.3",
      subHeader: "10:40 - 11:10",
      header: "COFFEE BREAK - NETWORKING ☕",
      smallText: "",
      text: "",
      divided: false,
    },
    {
      id: "2.4",
      subHeader: "11:10 - 12:00",
      header: "ING. ALFONSO MUÑOZ",
      smallText: "DIRECTOR DE PRODUCCIÓN EN MINERA CHINALCO",
      text: "ACELERANDO LA TOMA DE DECISIONES",
      divided: true,
    },

    {
      id: "3.1",
      subHeader: "12:00 - 12:25",
      header: "MG. MARIO NUÑEZ",
      smallText: "UNIVERSIDAD NACIONAL DE SAN AGUSTIN DE AREQUIPA",
      text: "APROVECHAMIENTO DE ESCORIAS METALÚRGICAS MEDIANTE TÉCNICAS DE LIXIVIACIÓN: CONTRIBUCIÓN A LA METALURGIA CIRCULAR",
      divided: true,
    },
    {
      id: "3.2",
      subHeader: "12:25 - 12:50",
      header: "ING. J. JARA, C. ANDRADE, E. VELIZ",
      smallText: "UNIVERSIDAD NACIONAL DE SAN AGUSTIN DE AREQUIPA",
      text: " COMPOSITO DE MATRIZ METÁLICA DE ALUMINIO REFORZADA CON SÍLICE AMORFA",
      divided: true,
    },
    {
      id: "3.3",
      subHeader: "12:50 - 13:50",
      header: "ALMUERZO 🍽️",
      smallText: "",
      text: "",
      divided: false,
    },
    {
      id: "3.4",
      subHeader: "14:00 - 17:00",
      header: "CONCURSO DE PROYECTOS DE INVESTIGACIÓN 🧪",
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
            AUDITORIO “E.P. DE INGENIERÍA CIVIL”
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
