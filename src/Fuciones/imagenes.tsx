import imag from "../Fuciones/imag/cometsur.png";
import banner from "../Fuciones/imag/ban.png";
import "../css/Imagen.css";

const Imagen = () => {
  return (
    <div className="imagen-container">
      <img src={imag} alt="Imagen 1" style={{ width: "40%", height: "70%" }} />
      <img
        src={banner}
        alt="Imagen 2"
        style={{ width: "60%", height: "70%" }}
      />
    </div>
  );
};

export default Imagen;
