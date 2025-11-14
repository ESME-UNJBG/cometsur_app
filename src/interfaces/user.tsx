// interfaces/user.ts
export interface User {
  _id: string;
  email: string;
  name: string;
  estado: string;
  asistencia?: number[];
  university: string;
  importe: string;
  category: string;
  pago: string; // ✅ Nuevo campo
  baucher: string; // ✅ Nuevo campo
  profesion: string; // ✅ Nuevo campo
}

export interface UserSession {
  token: string | null;
  name: string | null;
  role: string | null;
  asistencia: number | null;
  isAuthenticated: boolean;
}

export interface ChangeDetection {
  hasChanges: boolean;
  changedFields: string[];
  previousData: Partial<UserSession>;
}

export interface UserSessionHook extends UserSession {
  lastUpdate: number | null;
  updateSession: () => Promise<void>;
  isInitialized: boolean;
  changeDetection: ChangeDetection;
  isUpdating: boolean; // ✅ Mantener por compatibilidad
}
