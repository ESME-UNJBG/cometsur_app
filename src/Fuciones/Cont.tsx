import React, { useState } from "react";
const Cont: React.FC = () => {
  const [isOpen, setIsOpen] = useState<number>(0);

  // Función para alternar el colapso
  const resta = (): void => {
    const newResta = isOpen - 1;

    if (isOpen <= 0) {
      const newwResta = 3;
      setIsOpen(newwResta);
    } else {
      setIsOpen(newResta);
    }
  };
  const suma = (): void => {
    const newResta = isOpen + 1;
    if (isOpen >= 3) {
      const newwResta = 0;
      setIsOpen(newwResta);
    } else {
      setIsOpen(newResta);
    }
  };
  return (
    <>
      <h1>{isOpen}</h1>
      <button onClick={suma}>suma</button>
      <button onClick={resta}>resta</button>
    </>
  );
};

export default Cont;
