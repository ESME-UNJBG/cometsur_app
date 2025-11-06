// interfaces/api.ts
import { User } from "./user";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface UpdateUserResponse {
  user?: User;
  token?: string;
}
