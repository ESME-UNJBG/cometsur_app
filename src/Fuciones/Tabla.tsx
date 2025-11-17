import { QRCodeCanvas } from "qrcode.react";
import BotonExportarExcel from "./BotonExportarExcel";
import { useUsuarios } from "../hook/useUsuarios";

const TablaUsuarios: React.FC = () => {
  const { usuarios, cargando } = useUsuarios();

  return (
    <div className="card mb-3" style={{ width: "100%", fontSize: "15px" }}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0 fw-bold">Lista de asistentes</h5>

          <div className="d-flex gap-2">
            <BotonExportarExcel usuarios={usuarios} />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>Nombre</th>
                <th>QR</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan={2}>Cargando usuarios...</td>
                </tr>
              ) : usuarios.length > 0 ? (
                usuarios.map((user) => (
                  <tr key={user._id}>
                    <td className="align-middle">{user.name}</td>
                    <td className="align-middle">
                      <QRCodeCanvas value={user._id} size={64} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2}>No hay usuarios cargados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TablaUsuarios;
