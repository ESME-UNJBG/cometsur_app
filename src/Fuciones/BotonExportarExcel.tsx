import React from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import QRCode from "qrcode";
import { User } from "../interfaces/user";

interface BotonExportarExcelProps {
  usuarios: User[];
  className?: string;
}

const BotonExportarExcel: React.FC<BotonExportarExcelProps> = ({
  usuarios,
  className = "btn btn-success btn-sm",
}) => {
  const descargarExcel = async () => {
    if (!usuarios || usuarios.length === 0) {
      alert("No hay usuarios para exportar.");
      return;
    }

    const usuariosFiltrados = usuarios.filter(
      (u) => !u.email?.toLowerCase().endsWith("@getnada.com")
    );

    if (usuariosFiltrados.length === 0) {
      alert("Todos los usuarios fueron filtrados por email @getnada.com");
      return;
    }

    const workbook = new ExcelJS.Workbook();

    // ======================================================
    // ===================  HOJA 1  =========================
    // ======================================================
    const ws1 = workbook.addWorksheet("Asistentes");

    const QR_PX = 64;
    const PIXELS_PER_EXCEL_COL_UNIT = 7.5;
    const PIXELS_PER_EXCEL_ROW_PT = 1.33;

    const qrColumnWidth = QR_PX / PIXELS_PER_EXCEL_COL_UNIT + 2;
    const qrRowHeight = QR_PX / PIXELS_PER_EXCEL_ROW_PT + 10;

    ws1.columns = [
      { header: "Nombre", key: "name", width: 50 },
      { header: "QR", key: "qr", width: qrColumnWidth },
      { header: "Código", key: "codigo", width: 18 },
      { header: "Importe", key: "importe", width: 12 },
      { header: "Categoría", key: "category", width: 20 },
      { header: "Universidad", key: "university", width: 60 },
      { header: "Email", key: "email", width: 45 },
    ];

    const header1 = ws1.getRow(1);
    header1.height = 26;
    header1.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1F4E78" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    const listaConCodigo: Array<User & { codigo: string }> = [];

    for (let i = 0; i < usuariosFiltrados.length; i++) {
      const u = usuariosFiltrados[i];
      const excelRowIndex = i + 2;

      const codigo = `Cometsur-${(i + 1).toString().padStart(3, "0")}`;

      listaConCodigo.push({
        ...u,
        codigo,
      });

      ws1.addRow({
        name: u.name,
        codigo,
        importe: u.importe,
        category: u.category,
        university: u.university,
        email: u.email,
      });

      ws1.getRow(excelRowIndex).height = qrRowHeight;

      const qrDataUrl = await QRCode.toDataURL(u._id, {
        width: QR_PX,
        margin: 0,
      });

      const imageId = workbook.addImage({
        base64: qrDataUrl,
        extension: "png",
      });

      const colIndexForQR = 2;

      const moveRight = 0.3;
      const moveDown = 0.05;

      ws1.addImage(imageId, {
        tl: {
          col: colIndexForQR - 1 + moveRight,
          row: excelRowIndex - 1 + moveDown,
        },
        ext: { width: QR_PX, height: QR_PX },
        editAs: "oneCell",
      });
    }

    ws1.eachRow((row) => {
      row.eachCell((cell) => {
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // ======================================================
    // ===================  FUNCION DE ESTILO  ==============
    // ======================================================
    const aplicarEstilos = (ws: ExcelJS.Worksheet) => {
      const header = ws.getRow(1);
      header.height = 26;

      header.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF1F4E78" },
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      ws.eachRow((row, index) => {
        if (index === 1) return;
        row.eachCell((cell) => {
          cell.alignment = { horizontal: "center", vertical: "middle" };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });
    };

    // ======================================================
    // ===================  HOJA 2  =========================
    // ======================================================
    const ws2 = workbook.addWorksheet("Baucher_Ordenado");

    ws2.columns = [
      { header: "Nombre", key: "name", width: 40 },
      { header: "Código", key: "codigo", width: 18 },
      { header: "Baucher", key: "baucher", width: 20 },
      { header: "Pago", key: "pago", width: 15 }, // ⭐ NUEVO ⭐
      { header: "Importe", key: "importe", width: 12 },
    ];

    const ordenBaucher = [...listaConCodigo].sort((a, b) =>
      a.baucher.localeCompare(b.baucher)
    );

    ordenBaucher.forEach((u) => {
      ws2.addRow({
        name: u.name,
        codigo: u.codigo,
        baucher: u.baucher,
        pago: u.pago, // ⭐ NUEVO ⭐
        importe: u.importe,
      });
    });

    aplicarEstilos(ws2);

    // ======================================================
    // ===================  HOJA 3  =========================
    // ======================================================
    const ws3 = workbook.addWorksheet("Universidad_Codigos");

    ws3.columns = [
      { header: "Nombre", key: "name", width: 40 },
      { header: "Universidad", key: "university", width: 50 },
      { header: "Código", key: "codigo", width: 18 },
    ];

    const ordenUniversidad = [...listaConCodigo].sort((a, b) =>
      a.university.localeCompare(b.university)
    );

    ordenUniversidad.forEach((u) => {
      ws3.addRow({
        name: u.name,
        university: u.university,
        codigo: u.codigo,
      });
    });

    aplicarEstilos(ws3);

    // ======================================================
    // ===================  DESCARGA  =======================
    // ======================================================
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Lista_Asistentes.xlsx");
  };

  return (
    <button
      className={className}
      onClick={descargarExcel}
      title="Descargar lista en Excel"
      disabled={!usuarios || usuarios.length === 0}
    >
      📥 Descargar Excel
    </button>
  );
};

export default BotonExportarExcel;
