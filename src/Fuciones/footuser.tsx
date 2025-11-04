import { useNavigate } from "react-router-dom";
const Foot = () => {
  const navigate = useNavigate();
  const home = () => {
    navigate("/home");
  };
  const Qr = () => {
    navigate("/qr");
  };
  return (
    <nav
      className=" navbar fixed-bottom "
      style={{
        width: "100%",
        bottom: "0%",
        height: "45px",
        padding: "0.2rem",
        borderRadius: "5px 5px 0 0", // Bordes redondeados solo arriba
        display: "flex", // Flex para distribuir botones
        justifyContent: "space-between", // Espacio entre botones
        backgroundColor: "#47031dff",
      }}
    >
      <button
        className="text-white"
        aria-label="Toggle navigation"
        onClick={home}
        style={{
          width: "50%",
          border: "none",
          padding: "0.2rem",
          background: "none",
          float: "left",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="currentColor"
          className="bi bi-house"
          viewBox="0 0 16 16"
        >
          <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
        </svg>
      </button>
      <button
        className="text-white"
        onClick={Qr}
        style={{
          width: "50%",
          border: "none",
          padding: "0.2rem",
          background: "none",
          float: "left",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-qr-code"
          viewBox="0 0 16 16"
        >
          <path d="M2 2h2v2H2z" />
          <path d="M6 0v6H0V0zM5 1H1v4h4zM4 12H2v2h2z" />
          <path d="M6 10v6H0v-6zm-5 1v4h4v-4zm11-9h2v2h-2z" />
          <path d="M10 0v6h6V0zm5 1v4h-4V1zM8 1V0h1v2H8v2H7V1zm0 5V4h1v2zM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8zm0 0v1H2V8H1v1H0V7h3v1zm10 1h-1V7h1zm-1 0h-1v2h2v-1h-1zm-4 0h2v1h-1v1h-1zm2 3v-1h-1v1h-1v1H9v1h3v-2zm0 0h3v1h-2v1h-1zm-4-1v1h1v-2H7v1z" />
          <path d="M7 12h1v3h4v1H7zm9 2v2h-3v-1h2v-1z" />
        </svg>
      </button>
    </nav>
  );
};

export default Foot;
