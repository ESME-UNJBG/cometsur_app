import Colap from "../Fuciones/colaps";
import Bar from "../Fuciones/barra";
import Carr from "../Fuciones/carru";
import Foor from "../Fuciones/footuser";
//import Tarj from "../Fuciones/tarjeta";
import Imagenes from "../Fuciones/imagenes";
/* import Cont from "./Fuciones/Cont"; */
import Tit from "../Fuciones/separ";
import TitD from "../Fuciones/separDia";
import Crono from "../cronograma/crono";
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
          display: "flex",
        }}
      >
        <Colap></Colap>
      </div>
      {/*<Imagen></Imagen>*/}
      <div>
        <Tit></Tit>
      </div>
      <Carr></Carr>
      <TitD></TitD>
      <Crono></Crono>
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
