import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Tipo para a notificação
export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  date: number; // timestamp em ms
  read: boolean;
}

// Estado inicial
interface NotificationsState {
  items: NotificationItem[];
}

const initialState: NotificationsState = {
  items: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<NotificationItem>) => {
      // Insere no início para manter ordem cronológica decrescente
      state.items.unshift(action.payload);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const item = state.items.find(n => n.id === id);
      if (item) {
        item.read = true;
      }
    },
    markAllRead: (state) => {
      state.items.forEach(n => { n.read = true; });
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
});

export const { addNotification, markAsRead, markAllRead, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;