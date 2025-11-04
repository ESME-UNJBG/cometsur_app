import { useState } from "react";
import VentanaEsc from "../ventanas/vent_Es";
import VentanaRe from "../ventanas/vent_Re";
import VentanaDe from "../ventanas/vent_De";
import VentanaAc from "../ventanas/vent_Ac";
const Boot = () => {
  const [showVentanaEsc, setShowVentanaEsc] = useState(false);
  const [showVentanaRe, setShowVentanaRe] = useState(false);
  const [showVentanaDe, setShowVentanaDe] = useState(false);
  const [showVentanaAc, setShowVentanaAc] = useState(false);

  return (
    <div className="container my-4">
      {/* Ventana De */}
      <VentanaDe show={showVentanaDe} onClose={() => setShowVentanaDe(false)} />
      {/* Ventana Ac */}
      <VentanaAc show={showVentanaAc} onClose={() => setShowVentanaAc(false)} />
      {/* Ventana Re */}
      <VentanaRe show={showVentanaRe} onClose={() => setShowVentanaRe(false)} />
      {/* Ventana Es */}
      <VentanaEsc
        show={showVentanaEsc}
        onClose={() => setShowVentanaEsc(false)}
      />

      <div className="row g-3 justify-content-center text-center">
        {/* 👉 Dos primeros botones */}
        <div className="col-12 col-md-6">
          <div className="row g-3">
            <div className="col-6 d-flex justify-content-center">
              <button
                className="btn btn-light"
                onClick={() => setShowVentanaAc(true)}
                style={{
                  width: "85px",
                  height: "85px",
                  background: "none",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-person-down"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.5 9a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7m.354 5.854 1.5-1.5a.5.5 0 0 0-.708-.708l-.646.647V10.5a.5.5 0 0 0-1 0v2.793l-.646-.647a.5.5 0 0 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                  <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z" />
                </svg>
              </button>
            </div>

            <div className="col-6 d-flex justify-content-center">
              <button
                className="btn btn-light"
                onClick={() => setShowVentanaEsc(true)}
                style={{
                  width: "85px",
                  height: "85px",
                  background: "none",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-person-bounding-box"
                  viewBox="0 0 16 16"
                >
                  <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5" />
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 👉 Botones de la derecha */}
        <div className="col-12 col-md-6">
          <div className="row g-3 justify-content-center">
            <div className="col-6 d-flex justify-content-center">
              <button
                className="btn btn-light"
                onClick={() => setShowVentanaRe(true)}
                style={{
                  width: "85px",
                  height: "85px",
                  background: "none",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-person-fill-add"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                  <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4" />
                </svg>
              </button>
            </div>

            <div className="col-6 d-flex justify-content-center">
              <button
                className="btn btn-light"
                onClick={() => setShowVentanaDe(true)}
                style={{
                  width: "85px",
                  height: "85px",
                  background: "none",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-person-dash"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M11 12h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1m0-7a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                  <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Boot;
