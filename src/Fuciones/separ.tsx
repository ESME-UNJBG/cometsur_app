import imag from "../Fuciones/imag/sepa1.png";
import "../css/separa.css"; // 👈 crea este archivo

const Imagen = () => {
  return (
    <div className="separa-container">
      <img src={imag} alt="Imagen 1" className="responsive-img" />
    </div>
  );
};

export default Imagen;
