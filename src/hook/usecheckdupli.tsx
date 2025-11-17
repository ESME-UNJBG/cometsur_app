import { useState, useEffect } from "react";
import { FormData } from "../interfaces/register";
import { API_URL } from "../config";
interface DuplicateCheck {
  emailDuplicado: boolean;
  baucherDuplicado: boolean;
  loading: boolean;
  error: string | null;
}

const useCheckDuplicate = (
  email: string,
  baucher: string,
  trigger: boolean
) => {
  const [result, setResult] = useState<DuplicateCheck>({
    emailDuplicado: false,
    baucherDuplicado: false,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!trigger) return;
    if (!email && !baucher) return;

    const token = localStorage.getItem("Token");
    if (!token) {
      setResult({
        emailDuplicado: false,
        baucherDuplicado: false,
        loading: false,
        error: "Falta token de autenticación",
      });
      return;
    }

    const checkDuplicates = async () => {
      setResult({
        emailDuplicado: false,
        baucherDuplicado: false,
        loading: true,
        error: null,
      });
      try {
        const response = await fetch(`${API_URL}/users/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Error al obtener usuarios");
        const data: FormData[] = await response.json();

        const emailExists = email ? data.some((u) => u.email === email) : false;
        const baucherExists = baucher
          ? data.some((u) => u.baucher === baucher)
          : false;

        setResult({
          emailDuplicado: emailExists,
          baucherDuplicado: baucherExists,
          loading: false,
          error: null,
        });
      } catch (err: unknown) {
        setResult({
          emailDuplicado: false,
          baucherDuplicado: false,
          loading: false,
          error: (err as Error).message,
        });
      }
    };

    checkDuplicates();
  }, [email, baucher, trigger]);

  return result;
};

export default useCheckDuplicate;
