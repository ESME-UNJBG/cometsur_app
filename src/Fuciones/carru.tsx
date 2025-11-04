import React, { useState, useEffect } from "react";
import ima2 from "../Fuciones/imag/carru1.png";
import ima1 from "../Fuciones/imag/carru2.png";
import ima3 from "../Fuciones/imag/carru3.png";

const imag: string[] = [ima1, ima2, ima3];

const Carru: React.FC = () => {
  const [index, setIndex] = useState<number>(0);

  // Cambia la imagen cada 7 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % imag.length);
    }, 7000);

    return () => clearInterval(interval); // limpiar intervalo
  }, []);

  const prev = () => {
    setIndex((prevIndex) =>
      prevIndex === 0 ? imag.length - 1 : prevIndex - 1
    );
  };

  const next = () => {
    setIndex((prevIndex) => (prevIndex + 1) % imag.length);
  };

  return (
    <div
      style={{
        width: "70%", // todo el ancho
        height: "100%", // aquí controlas la altura a tu gusto (ej. 400px o 50vh)
        overflow: "hidden", // oculta si la imagen es más grande
        margin: "0 auto", // para centrar horizontalmente
      }}
    >
      <div className="carousel slide" style={{ width: "100%", height: "100%" }}>
        <div
          className="carousel-inner"
          style={{ width: "100%", height: "100%" }}
        >
          <div className="carousel-item active">
            <img
              src={imag[index]}
              alt="carrusel"
              style={{
                width: "100%", // ocupa todo el ancho
                height: "100%", // adapta a la altura definida
                objectFit: "cover", // recorta para que no se deforme
                borderRadius: "0.9rem",
              }}
            />
          </div>
        </div>

        {/* Botón anterior */}
        <button className="carousel-control-prev" type="button" onClick={prev}>
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>

        {/* Botón siguiente */}
        <button className="carousel-control-next" type="button" onClick={next}>
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default Carru;
