// app/src/pages/notificacao/NotificationsService.ts

import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import api from '../../services/api';
import { store } from '../../(redux)/store';
import { addNotification } from '../../(redux)/notificationsSlice';
import { useSelector } from 'react-redux';
import type { RootState } from '../../(redux)/store';

// Tipo da despesa retornada do backend
interface Despesa {
  despesaId: number;
  userId: number;
  categoria: string;               // ex: "4"
  aprovacao: 'Pendente' | 'Aprovado' | 'Recusado';
}

// Tipo da categoria retornada do backend
interface Categoria {
  categoriaId: number;
  nome: string;
}

// Wrapper do endpoint /categorias
interface CategoriasResponse {
  message: string;
  alertType: string;
  categorias: Categoria[];
}

// Configura como as notificações são exibidas em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Inicializa permissões e canais de notificação.
 */
export async function initNotifications() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Permissão de notificação não concedida!');
    return;
  }

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync();
    console.log('Push Token:', tokenData.data);
  } catch (e) {
    console.error('Falha ao obter o push token:', e);
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('despesas-updates', {
      name: 'Atualizações de Despesas',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

/**
 * Hook que faz polling em /despesa e dispara notificações
 * quando o status muda de 'Pendente' para 'Aprovado' ou 'Recusado'.
 * Notifica apenas o criador da despesa e apenas uma vez.
 */
export function useDespesasNotifications(intervalMs: number = 5000) {
  const notifiedRef = useRef<Set<number>>(new Set());
  const usuario = useSelector((state: RootState) => state.auth.user);
  const [categories, setCategories] = useState<Categoria[]>([]);

  // Buscar categorias sempre que o hook for montado
  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await api.get<CategoriasResponse>('/categorias');
        setCategories(res.data.categorias);
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
      }
    }
    fetchCategorias();
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function checkDespesas() {
      if (!isMounted) return;
      if (!usuario || typeof usuario.id !== 'number') return;

      try {
        const resp = await api.get<Despesa[]>('/despesa');
        const despesas = resp.data;

        if (notifiedRef.current.size === 0) {
          despesas.forEach(d => notifiedRef.current.add(d.despesaId));
          return;
        }

        for (const d of despesas) {
          if (d.userId !== usuario.id) continue;
          if (notifiedRef.current.has(d.despesaId)) continue;

          if (d.aprovacao === 'Aprovado' || d.aprovacao === 'Recusado') {
            const catId = parseInt(d.categoria, 10);
            const catObj = categories.find(c => c.categoriaId === catId);
            const nomeCategoria = catObj ? catObj.nome : 'categoria desconhecida';
            const titulo = d.aprovacao === 'Aprovado' ? 'Despesa Aprovada' : 'Despesa Recusada';
            const body = `Sua despesa de ${nomeCategoria} foi ${d.aprovacao.toLowerCase()}.`;

            await Notifications.scheduleNotificationAsync({
              content: { title: titulo, body, data: { despesaId: d.despesaId } },
              trigger: null,
            });

            store.dispatch(addNotification({
              id: `${d.despesaId}-${Date.now()}`,
              title: titulo,
              body,
              date: Date.now(),
              read: false,
            }));

            notifiedRef.current.add(d.despesaId);
          }
        }
      } catch (err) {
        console.error('Erro ao buscar despesas:', err);
      }
    }

    checkDespesas();
    const timer = setInterval(checkDespesas, intervalMs);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [intervalMs, usuario, categories]);
}