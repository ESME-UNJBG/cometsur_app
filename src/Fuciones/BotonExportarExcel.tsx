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

    // === FILTRAR emails de getnada.com ===
    const usuariosFiltrados = usuarios.filter(
      (u) => !u.email?.toLowerCase().endsWith("@getnada.com")
    );

    if (usuariosFiltrados.length === 0) {
      alert("Todos los usuarios fueron filtrados por email @getnada.com");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet("Asistentes");

    const QR_PX = 64;
    const PIXELS_PER_EXCEL_COL_UNIT = 7.5;
    const PIXELS_PER_EXCEL_ROW_PT = 1.33;

    const qrColumnWidth = QR_PX / PIXELS_PER_EXCEL_COL_UNIT + 2;
    const qrRowHeight = QR_PX / PIXELS_PER_EXCEL_ROW_PT + 10;

    ws.columns = [
      { header: "Nombre", key: "name", width: 50 },
      { header: "QR", key: "qr", width: qrColumnWidth },
      { header: "Código", key: "codigo", width: 18 },
      { header: "Importe", key: "importe", width: 12 },
      { header: "Categoría", key: "category", width: 20 },
      { header: "Universidad", key: "university", width: 60 },
      { header: "Email", key: "email", width: 45 },
    ];

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

    // === Agregar usuarios filtrados ===
    for (let i = 0; i < usuariosFiltrados.length; i++) {
      const u = usuariosFiltrados[i];
      const excelRowIndex = i + 2;
      const codigo = `Cometsur-${(i + 1).toString().padStart(3, "0")}`;

      ws.addRow({
        name: u.name,
        codigo,
        importe: u.importe,
        category: u.category,
        university: u.university,
        email: u.email,
      });

      ws.getRow(excelRowIndex).height = qrRowHeight;

      const qrDataUrl = await QRCode.toDataURL(u._id, {
        width: QR_PX,
        margin: 0,
      });

      const imageId = workbook.addImage({
        base64: qrDataUrl,
        extension: "png",
      });

      const colIndexForQR = 2;
      const colWidthPx =
        ws.getColumn(colIndexForQR).width! * PIXELS_PER_EXCEL_COL_UNIT;
      const rowHeightPx =
        ws.getRow(excelRowIndex).height! * PIXELS_PER_EXCEL_ROW_PT;

      const moveRight = 0.3;
      const moveDown = 0.05;

      const tlCol =
        colIndexForQR - 1 + (colWidthPx - QR_PX) / (2 * colWidthPx) + moveRight;
      const tlRow =
        excelRowIndex -
        1 +
        (rowHeightPx - QR_PX) / (2 * rowHeightPx) +
        moveDown;

      ws.addImage(imageId, {
        tl: { col: tlCol, row: tlRow },
        ext: { width: QR_PX, height: QR_PX },
        editAs: "oneCell",
      });
    }

    ws.eachRow((row) => {
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
