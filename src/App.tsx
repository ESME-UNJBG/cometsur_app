import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./private/proRuts";
import useActualizarUsuario from "./hook/useAct";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Qr from "./pages/Qr";
import HomeMod from "./pages/Home_moderador";
import QrMod from "./pages/Qr_moderador";
import PilaMod from "./pages/Pila_moderador";

const App: React.FC = () => {
  // ✅ Activa el hook global que refresca el rol cada 3s
  useActualizarUsuario();

  return (
    <Router>
      <Routes>
        {/* Login libre */}
        <Route path="/" element={<Login />} />

        {/* Usuario */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={["usuario"]}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qr"
          element={
            <ProtectedRoute allowedRoles={["usuario"]}>
              <Qr />
            </ProtectedRoute>
          }
        />

        {/* Moderador */}
        <Route
          path="/moderador"
          element={
            <ProtectedRoute allowedRoles={["moderador"]}>
              <HomeMod />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qrmoderador"
          element={
            <ProtectedRoute allowedRoles={["moderador"]}>
              <QrMod />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pilamoderador"
          element={
            <ProtectedRoute allowedRoles={["moderador"]}>
              <PilaMod />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
