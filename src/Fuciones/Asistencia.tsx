import useUserSession from "../hook/useUserSession";

const Asistencia = () => {
  const { asistencia } = useUserSession();

  return (
    <div
      className="card mb-3"
      style={{
        width: "100%",
        fontSize: "15px",
        float: "inherit",
        padding: "1px 15px",
      }}
    >
      <div className="card-body" style={{ padding: "10px" }}>
        <h5
          className="card-title"
          style={{ textAlign: "center", padding: "2px", fontSize: "15px" }}
        >
          Asistencia
        </h5>

        <div
          style={{
            width: "100%",
            height: "40px",
            padding: "0.2rem",
            borderRadius: "5px 5px 0 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p
            className="card-text"
            style={{
              padding: "4px 6px",
              marginBottom: "0",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {asistencia !== null ? `${asistencia}/4` : "0/4"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Asistencia;
