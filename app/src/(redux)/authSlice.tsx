import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction, createAsyncThunk  } from "@reduxjs/toolkit";

// Definindo a estrutura do tipo User
interface User {
    userId:Number;
    id: Number;
    name: string;
    email: string;
    password: string;
}

// Definindo o tipo do estado de autenticação
interface AuthState {
    user: User | null;
}

// Função para obter o usuário do AsyncStorage
const loadUserFromStorage = async (): Promise<User | null> => {
    try {
        const userInfo = await AsyncStorage.getItem("userInfo");
        return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
        return null;
    }
};

// Estado inicial do slice
const initialState: AuthState = {
    user: null,
};

// Criando o slice para autenticação
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginUserAction: (state, action: PayloadAction<User>) => {
            state.user = {
                ...action.payload,
                userId: action.payload.userId || action.payload.id,
            };
            AsyncStorage.setItem("userInfo", JSON.stringify(state.user));
        },
        logoutAction: (state) => {
            state.user = null;
            AsyncStorage.removeItem("userInfo");
        },
        setUserAction: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
    },
});

// Gerando as ações a partir do slice
export const { loginUserAction, logoutAction, setUserAction } = authSlice.actions;

// Exportando o reducer
export const authReducer = authSlice.reducer;

// Função thunk para carregar o usuário do AsyncStorage
/* export const loadUser = () => async (dispatch: any) => {
    const userInfo = await loadUserFromStorage();
    if (userInfo) {
        dispatch(setUserAction(userInfo));
    }
}; */

// Criar a ação assíncrona usando createAsyncThunk
export const loadUser = createAsyncThunk('auth/loadUser', async () => {
    const userInfo = await loadUserFromStorage();
    return userInfo;
});
