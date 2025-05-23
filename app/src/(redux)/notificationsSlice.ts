import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import type { RootState } from './store';
export interface NotificationItem {
  id: string;       
  title: string;
  body: string;
  date: number;     
  read: boolean;
  despesaId: number;
}
interface NotificationsState {
  items: NotificationItem[];
  loading: boolean;
}

const initialState: NotificationsState = {
  items: [],
  loading: false,
};

export const fetchNotifications = createAsyncThunk<
  NotificationItem[],
  void,
  { state: RootState; rejectValue: any }
>(
  'notifications/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const userId = getState().auth.user?.id;
      if (!userId) return [];

      const response = await api.get<{
        message: string;
        alertType: string;
        notificacoes: Array<{
          _id: string;
          userId: number;
          title: string;
          body: string;
          date: string;
          read: boolean;
          despesaId: number;
          notificacaoId: number;
        }>;
      }>(`/notifications?userId=${userId}`);

      return response.data.notificacoes.map(n => ({
        id: n._id,
        title: n.title,
        body: n.body,
        date: new Date(n.date).getTime(),
        read: n.read,
        despesaId: n.despesaId,
      }));
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const markNotificationAsRead = createAsyncThunk<
  string,
  string,
  { rejectValue: any }
>(
  'notifications/markRead',
  async (id, { rejectWithValue }) => {
    try {
      await api.patch(`/notifications/${id}`, { read: true });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<NotificationItem>) => {
      state.items.unshift(action.payload);
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchNotifications.pending, state => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items = payload;
      })
      .addCase(fetchNotifications.rejected, state => {
        state.loading = false;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, { payload: id }) => {
        const notif = state.items.find(n => n.id === id);
        if (notif) notif.read = true;
      });
  },
});

export const { addNotification, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;