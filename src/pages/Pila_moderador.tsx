import Bar from "../Fuciones/barra";
import Foor from "../Fuciones/footmod";
import Pil from "../Fuciones/pila";
import Tab from "..//Fuciones/Tabla";
const Pila: React.FC = () => {
  return (
    <>
      <Bar></Bar>
      <div
        style={{
          marginTop: "60px", // Altura de la barra superior
          marginBottom: "50px", // Altura de la barra inferior
        }}
      >
        <Pil></Pil>
        <Tab></Tab>
      </div>

      <Foor></Foor>

      {/* <Cont></Cont> */}
    </>
  );
};

export default Pila;
