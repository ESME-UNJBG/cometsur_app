import Colap from "../Fuciones/colaps";
import Bar from "../Fuciones/barra";
import Carr from "../Fuciones/carru";
import Foor from "../Fuciones/footmod";
//import Tarj from "../Fuciones/tarjeta";
import Imagenes from "../Fuciones/imagenes";
/* import Cont from "./Fuciones/Cont"; */
import Imagen from "../Fuciones/separ";
const Home: React.FC = () => {
  return (
    <>
      <Bar></Bar>
      <div
        style={{
          marginTop: "55px", // Altura de la barra superior
          marginBottom: "0", // Altura de la barra inferior
          display: "flex",
        }}
      >
        <Imagenes></Imagenes>
        {/*<Colap></Colap>*/}
      </div>
      <div
        style={{
          marginTop: "0.5px", // Altura de la barra superior
          marginBottom: "0.5px", // Altura de la barra inferior
          display: "flex",
        }}
      >
        <Colap></Colap>
      </div>
      {/*<Imagen></Imagen>*/}
      <div>
        <Imagen></Imagen>
      </div>
      <Carr></Carr>
      <div
        style={{
          marginTop: "", // Altura de la barra superior
          marginBottom: "50px", // Altura de la barra inferior
        }}
      >
        {/*<Tarj></Tarj>*/}
      </div>

      <Foor></Foor>

      {/* <Cont></Cont> */}
    </>
  );
};

export default Home;
