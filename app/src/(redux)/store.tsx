import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";

// Configuração do store
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Tipagem do dispatch
export type AppDispatch = typeof store.dispatch;

// Exportando o tipo de rootState para usar em outros arquivos (ex: em selectors ou em useSelector)
export type RootState = ReturnType<typeof store.getState>;