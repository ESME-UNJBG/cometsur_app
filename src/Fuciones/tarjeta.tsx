const tarjeta = () => {
  return (
    <div
      style={{
        marginLeft: "5%",
        marginRight: "5%",
        height: "0%",
        display: "flex",
        justifyContent: "center", // centra horizontal
        alignItems: "center", // centra vertical
        gap: "20px", // espacio entre imágenes
      }}
    >
      <div
        className="card text-bg-secondary mb-3"
        style={{
          width: "100%",
          height: "100%",
          float: "none",
          fontSize: "80%",
          marginTop: "0%",
        }}
      >
        <div className="card-body">
          <h6 className="card-title">MISION</h6>
          <p className="card-text">
            El Segundo Congreso Metalúrgico del Sur nace con el compromiso de
            ser un punto de encuentro para los profesionales, investigadores,
            egresados y estudiantes que impulsan el desarrollo de la metalurgia,
            minería y gestión ambiental en el sur del país y a nivel nacional.
            Su propósito es fomentar el intercambio genuino de experiencias
            reales, innovaciones tecnológicas y conocimientos científicos que
            fortalezcan la competitividad y la sostenibilidad del sector. A
            través de un ambiente colaborativo y educativo, el congreso busca
            inspirar liderazgo, promover la formación continua y conectar a
            todos los actores clave para afrontar los desafíos actuales y
            futuros de la industria metalúrgica con responsabilidad social y
            ambiental.
          </p>
        </div>
      </div>
      <div
        className="card text-bg-secondary mb-3"
        style={{
          width: "100%",
          height: "100%",
          float: "none",
          fontSize: "80%",
          marginTop: "0%",
        }}
      >
        <div className="card-body">
          <h6 className="card-title">VISION</h6>
          <p className="card-text">
            Visualizamos al II COMETSUR como el congreso metalúrgico líder en el
            sur del Perú, reconocido nacional e internacionalmente por su
            excelencia, innovación y compromiso con el desarrollo sostenible.
            Queremos ser un referente que trascienda generaciones, un espacio
            donde las ideas transformadoras y las soluciones tecnológicas
            impulsen un crecimiento inclusivo y respetuoso con el medio
            ambiente. Aspiramos a consolidar alianzas estratégicas con grandes
            empresas, instituciones y expertos, para que este evento sea un
            motor de progreso, inspiración y colaboración que fortalezca la
            industria metalúrgica, potencie el talento local, promueva la
            formación continua y contribuya a un futuro próspero para la región
            y el país, con responsabilidad social y ambiental.
          </p>
        </div>
      </div>
    </div>
  );
};

export default tarjeta;
