import React, { useState, useEffect } from "react";
import ima1 from "../Fuciones/imag/carru1.png";
import ima2 from "../Fuciones/imag/carru2.png";
import ima3 from "../Fuciones/imag/carru3.png";
import "../css/Carru.css"; // 👈 Importamos los estilos personalizados

const imag: string[] = [ima1, ima2, ima3];

const Carru: React.FC = () => {
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % imag.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const handleIndicatorClick = (i: number) => {
    setIndex(i);
  };

  return (
    <div className="mi-carrusel-container">
      <div className="mi-carrusel">
        <img
          src={imag[index]}
          alt={`Imagen ${index + 1}`}
          className="mi-carrusel-img"
        />
      </div>

      {/* Indicadores inferiores */}
      <div className="mi-carrusel-indicadores">
        {imag.map((_, i) => (
          <div
            key={i}
            className={`indicador ${i === index ? "activo" : ""}`}
            onClick={() => handleIndicatorClick(i)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Carru;
