import Bar from "../Fuciones/barra";
import Foor from "../Fuciones/footuser";
import Qr from "../Fuciones/Qr";
import Asistencia from "../Fuciones/Asistencia";
import Foro from "../Btns/foro";
/* import Cont from "./Fuciones/Cont"; */
const Qrcode: React.FC = () => {
  return (
    <>
      <Bar></Bar>
      <div
        style={{
          marginTop: "58px", // Altura de la barra superior
          marginBottom: "", // Altura de la barra inferior
          marginLeft: "20%", //izquierda
          marginRight: "20%", //derecha
        }}
      >
        <Asistencia></Asistencia>
        <Foro></Foro>
      </div>
      <div
        style={{
          marginTop: "10px", // Altura de la barra superior
          marginBottom: "40px", // Altura de la barra inferior
        }}
      >
        <Qr></Qr>
      </div>

      <Foor></Foor>

      {/* <Cont></Cont> */}
    </>
  );
};

export default Qrcode;
