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

  const SPECIAL_CELLS = ["2.1", "3.1", "3.2", "3.3", "3.4"];

  const cellData = [
    {
      id: "1.1",
      subHeader: "8:35 - 9:05",
      header: "ING. JORGE MEDINA",
      smallText: "GERENTE PROGRAMA DE SEGURIDAD SPCC",
      text: "RESULTADOS QUE TRANSFORMAN, EN LA NUEVA ERA DE LA SEGURIDAD",
      divided: true,
    },
    {
      id: "1.2",
      subHeader: "9:05 - 9:40",
      header: "PSICOL. ALMENDRA PINTO",
      smallText:
        "GESTORA DE PROYECTOS DE INNOVACIÓN Y ARTICULACIÓN MINERA ISE LATAM",
      text: "BOOST YOUR FUTURE: TALLER DE EMPLEABILIDAD",
      divided: true,
    },
    {
      id: "1.3",
      subHeader: "9:40 - 10:15",
      header: "ING. PERCY DEXTRE",
      smallText:
        "INGENIERO QUIMICO DE LA UNIVERSIDAD NACIONAL MAYOR DE SAN MARCOS",
      text: "ESPECTROMETRÍA DE ABSORCIÓN ATÓMICA: UNA TÉCNICA MULTIELEMENTO PARA LA COMPRENSIÓN DE LA COMPOSICIÓN QUÍMICA Y LAS CARACTERÍSTICAS DE LOS MATERIALES",
      divided: true,
    },
    {
      id: "1.4",
      subHeader: "10:15 - 11:00",
      header: "ING. ADRIÁN DEL CARPIO TORRES",
      smallText: "RESPONSABLE LESDE TIA MARIA SPCC",
      text: "VISIÓN Y GESTIÓN DE LA PILA DINÁMICA DE LIXIVIACIÓN PARA LA MINERÍA DEL FUTURO",
      divided: true,
    },

    {
      id: "2.1",
      subHeader: "11:00 - 11:40",
      header: "COFFEE BREAK - NETWORKING ☕",
      smallText: "",
      text: "",
      divided: false,
    },
    {
      id: "2.2",
      subHeader: "11:40 - 12:15",
      header: "ING. GINO HERRERA",
      smallText: "ESPECIALISTA TECNICO EN FLOTACION EN SYENSQO",
      text: "REACTIVOS QUÍMICOS COLECTORES Y ESPUMANTES PARA FLOTACIÓN DE MINERALE",
      divided: true,
    },
    {
      id: "2.3",
      subHeader: "12:15 - 12:45",
      header: "ING. ERLAND ZEGARRA",
      smallText: "SUPERINTENDENTE DE OPERACIONES CONCENTRADORA CUAJONE SPCC",
      text: "OPTIMIZACIÓN DE LA PRODUCCIÓN DE COBRE Y MOLIBDENO POR LA REDUCCIÓN DE LA GRANULOMETRÍA DE ALIMENTACIÓN A MOLIENDA A TRAVÉS DE LA MODIFICACIÓN DEL “HPGR” COMO CIRCUITO DE TRITURACIÓN CUATERNARIO",
      divided: true,
    },
    {
      id: "2.4",
      subHeader: "12:45 - 13:30",
      header: "ING. ISMAEL RAMIREZ ",
      smallText: "GERENTE DE SINERGIA Y NUEVOS PROCESOS SPCC",
      text: "PROYECTOS DE INVESTIGACIÓN COLABORATIVOS ENTRE SPCC Y UNJBG",
      divided: true,
    },

    {
      id: "3.1",
      subHeader: "13:30 - 14:00",
      header: "CEREMONIA DE CLAUSURA 🎉",
      smallText: "",
      text: "",
      divided: false,
    },
    {
      id: "3.2",
      subHeader: "14:00 - 14:30",
      header: "CEREMONIA DE CLAUSURA 🎉",
      smallText: "",
      text: " ",
      divided: false,
    },
    {
      id: "3.3",
      subHeader: "14:40 - 16:30",
      header: "ALMUERZO 🍽️",
      smallText: "",
      text: "",
      divided: false,
    },
    {
      id: "3.4",
      subHeader: "17:30 - 22:00",
      header: "VERBENA COMETSUR 🎶🕺💃",
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
