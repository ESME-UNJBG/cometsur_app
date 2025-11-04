import { useState, useEffect, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface Usuario {
  name: string;
  id: string;
  asistencia: number | null;
}

interface ApiUsuario {
  _id: string;
  name: string;
  asistencia?: number;
}

interface ApiResponseWithToken {
  usuarios: ApiUsuario[];
  token: string;
}

const TablaUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const actualizarUsuarios = useCallback(async () => {
    const Token = localStorage.getItem("Token");
    if (!Token) {
      console.error("❌ Falta el token en localStorage");
      return;
    }

    try {
      console.log("📡 Fetch usuarios iniciado");
      const response = await fetch(`https://cometsur-api.onrender.com/users/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error en la petición");

      const data: ApiUsuario[] | ApiResponseWithToken = await response.json();
      console.log("📥 Respuesta usuarios:", data);

      if ("usuarios" in data) {
        localStorage.setItem("Token", data.token);
        procesarUsuarios(data.usuarios);
      } else {
        procesarUsuarios(data);
      }
    } catch (error) {
      console.error("❌ Error actualizando usuarios:", error);
    }
  }, []);

  const procesarUsuarios = (lista: ApiUsuario[]) => {
    const listaUsuarios: Usuario[] = lista.map((user) => ({
      name: user.name,
      id: user._id,
      asistencia: typeof user.asistencia === "number" ? user.asistencia : null,
    }));

    // 🔽 ORDENAR ALFABÉTICAMENTE AQUÍ
    listaUsuarios.sort((a, b) => a.name.localeCompare(b.name));

    console.log("✅ Usuarios procesados:", listaUsuarios);
    setUsuarios(listaUsuarios);
    localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
  };

  useEffect(() => {
    const interval = setInterval(() => actualizarUsuarios(), 10000);
    actualizarUsuarios();
    return () => clearInterval(interval);
  }, [actualizarUsuarios]);

  // 🎨 Generar y descargar Excel con formato profesional
  const descargarExcel = async () => {
    if (usuarios.length === 0) {
      alert("No hay usuarios para exportar.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Asistentes");

    // 🔽 ORDENAR ALFABÉTICAMENTE PARA EL EXCEL TAMBIÉN
    const usuariosOrdenados = [...usuarios].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    // Definir columnas
    worksheet.columns = [
      { header: "N°", key: "numero", width: 8 },
      { header: "Nombre del asistente", key: "nombre", width: 35 },
    ];

    // Agregar datos
    usuariosOrdenados.forEach((user, index) => {
      worksheet.addRow({ numero: index + 1, nombre: user.name });
    });

    // Estilo del encabezado
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1F4E78" }, // Azul oscuro
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Bordes y alineación de todas las celdas
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
      if (rowNumber > 1) {
        row.height = 20;
      }
    });

    // Generar archivo y descargar
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Lista_Asistentes.xlsx");
  };

  return (
    <div className="card mb-3" style={{ width: "100%", fontSize: "15px" }}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0 fw-bold">Lista de asistentes</h5>
          <button
            className="btn btn-success btn-sm"
            onClick={descargarExcel}
            title="Descargar lista en Excel"
          >
            📥 Descargar Excel
          </button>
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
              {usuarios.length > 0 ? (
                // 🔽 YA NO ES NECESARIO ORDENAR AQUÍ PORQUE EL ESTADO YA ESTÁ ORDENADO
                usuarios.map((user) => (
                  <tr key={user.id}>
                    <td className="align-middle">{user.name}</td>
                    <td className="align-middle">
                      <QRCodeCanvas value={user.id} size={64} />
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
