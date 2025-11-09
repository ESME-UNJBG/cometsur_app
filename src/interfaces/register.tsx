export interface FormData {
  name: string;
  email: string;
  password: string;
  university: string;
  importe: string;
  category: string;
  pago: string; // ✅ Nuevo campo (tipo de pago, ej. "Yape", "Depósito")
  baucher: string; // ✅ Nuevo campo (número o código del comprobante)
  profesion: string; // ✅ Nuevo campo (profesión o especialidad)
}
