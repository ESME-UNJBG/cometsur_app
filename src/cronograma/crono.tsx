import React, { useState } from "react";
import "../css/CardButtons.css";
import day1Image from "../Fuciones/imag/btn3.png";
import day2Image from "../Fuciones/imag/btn1.png";
import day3Image from "../Fuciones/imag/btn2.png";
import ModalDay1 from "../cronograma/ModalDay1";
import ModalDay2 from "../cronograma/ModalDay2";
import ModalDay3 from "../cronograma/ModalDay3";
interface DayCard {
  id: number;
  label: string;
  image: string;
}

const CardButtons: React.FC = () => {
  const [activeModal, setActiveModal] = useState<number | null>(null);

  const daysData: DayCard[] = [
    { id: 1, label: "Día 1", image: day1Image },
    { id: 2, label: "Día 2", image: day2Image },
    { id: 3, label: "Día 3", image: day3Image },
  ];

  const openModal = (dayId: number) => {
    setActiveModal(dayId);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <div className="card-buttons-container">
        {daysData.map((day) => (
          <button
            key={day.id}
            className={`card-button ${
              day.id === 1 || day.id === 2 || day.id === 3 ? "clickable" : ""
            }`}
            onClick={() => openModal(day.id)}
            type="button"
            //disabled={day.id === 3} // Solo el día 3 está deshabilitado por ahora
          >
            <div className="card-image-container">
              <img src={day.image} alt={day.label} className="card-image" />
            </div>
            <span className="card-label">{day.label}</span>
          </button>
        ))}
      </div>

      <ModalDay1 isOpen={activeModal === 1} onClose={closeModal} />
      <ModalDay2 isOpen={activeModal === 2} onClose={closeModal} />
      <ModalDay3 isOpen={activeModal === 3} onClose={closeModal} />
    </>
  );
};

export default CardButtons;
