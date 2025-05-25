import api from './api';

export const toggle2FA = async (enable: boolean, token: string) => {
  try {
    const response = await api.post(
      '/toggle2FA', 
      { enable }, 
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;

  } catch (error) {
      console.error("Erro ao alternar 2FA:", error);
      throw error;
  }
};

export const verify2FACode = (email: string, code: string) => api.post("/verify-2fa", { email, code });
export const resend2FACode = (email: string) => api.post("/resend-code", { email });