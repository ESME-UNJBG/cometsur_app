// components/SmartUpdateIndicator.tsx
import { useEffect, useState } from "react";
import useUserSession from "../hook/useUserSession";

const SmartUpdateIndicator = () => {
  const { changeDetection } = useUserSession();
  const [isVisible, setIsVisible] = useState(false);

  // ✅ Controlar visibilidad con efecto separado
  useEffect(() => {
    if (changeDetection.hasChanges) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [changeDetection.hasChanges]);

  // ✅ Solo mostrar si hay cambios Y es visible
  if (!isVisible || !changeDetection.hasChanges) return null;

  // ✅ Mensajes específicos según el tipo de cambio
  const getChangeMessage = (): string => {
    const { changedFields } = changeDetection;

    if (changedFields.includes("asistencia")) {
      return "¡Asistencia actualizada!";
    }
    if (changedFields.includes("name")) {
      return "Nombre actualizado";
    }
    if (changedFields.includes("role")) {
      return "Rol modificado";
    }
    if (changedFields.includes("token")) {
      return "Sesión renovada";
    }

    return "Datos actualizados";
  };

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
      <div
        className="alert alert-info alert-dismissible fade show"
        role="alert"
      >
        <div className="d-flex align-items-center">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Actualizando...</span>
          </div>
          <span>{getChangeMessage()}</span>
        </div>
      </div>
    </div>
  );
};

export default SmartUpdateIndicator;
