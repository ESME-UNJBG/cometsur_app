import React, { useState } from "react";
import "../css/collapse.css"; // 👈 archivo de estilos personalizado

type ItemProps = {
  title: string;
  children: React.ReactNode;
};

const AccordionItem: React.FC<ItemProps> = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="accordion-item custom-accordion-item">
      <h2 className="accordion-header">
        <button
          className={`accordion-button custom-accordion-button ${
            open ? "" : "collapsed"
          }`}
          type="button"
          onClick={() => setOpen(!open)}
        >
          {title}
        </button>
      </h2>
      <div className={`accordion-collapse collapse ${open ? "show" : ""}`}>
        <div className="accordion-body custom-accordion-body">{children}</div>
      </div>
    </div>
  );
};

const Collapse: React.FC = () => {
  return (
    <div className="container my-5">
      <div className="row g-4 justify-content-center">
        {/* MISION */}
        <div className="col-12 col-md-6">
          <div className="accordion" id="accordionMission">
            <AccordionItem title="MISIÓN">
              <strong>Nuestra misión:</strong> El Segundo Congreso Metalúrgico
              del Sur nace con el compromiso de ser un punto de encuentro para
              los profesionales, investigadores, egresados y estudiantes que
              impulsan el desarrollo de la metalurgia, minería y gestión
              ambiental en el sur del país y a nivel nacional. Su propósito es
              fomentar el intercambio genuino de experiencias reales,
              innovaciones tecnológicas y conocimientos científicos que
              fortalezcan la competitividad y la sostenibilidad del sector. A
              través de un ambiente colaborativo y educativo, el congreso busca
              inspirar liderazgo, promover la formación continua y conectar a
              todos los actores clave para afrontar los desafíos actuales y
              futuros de la industria metalúrgica con responsabilidad social y
              ambiental.
            </AccordionItem>
          </div>
        </div>

        {/* VISION */}
        <div className="col-12 col-md-6">
          <div className="accordion" id="accordionVision">
            <AccordionItem title="VISIÓN">
              <strong>Nuestra visión:</strong> Visualizamos al II COMETSUR como
              el congreso metalúrgico líder en el sur del Perú, reconocido
              nacional e internacionalmente por su excelencia, innovación y
              compromiso con el desarrollo sostenible. Queremos ser un referente
              que trascienda generaciones, un espacio donde las ideas
              transformadoras y las soluciones tecnológicas impulsen un
              crecimiento inclusivo y respetuoso con el medio ambiente.
              Aspiramos a consolidar alianzas estratégicas con grandes empresas,
              instituciones y expertos, para que este evento sea un motor de
              progreso, inspiración y colaboración que fortalezca la industria
              metalúrgica, potencie el talento local, promueva la formación
              continua y contribuya a un futuro próspero para la región y el
              país, con responsabilidad social y ambiental.
            </AccordionItem>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collapse;
