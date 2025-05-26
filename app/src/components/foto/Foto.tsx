// src/components/foto/Foto.tsx
import React, { useState } from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  ImageSourcePropType
} from 'react-native';
import api from '../../services/api';
import { themas } from '../../global/themes';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  tipo: string;
  tipoId: number;
  width?: number;
  height?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  refreshKey?: string | number;
  fallbackSource?: ImageSourcePropType;
}

export default function Foto({
  tipo,
  tipoId,
  width = 200,
  height = 200,
  borderRadius = 8,
  borderWidth = 0,
  borderColor = themas.colors.black,
  refreshKey,
  fallbackSource,
}: Props) {
  const { theme } = useTheme();
  const styles = createStyles (theme);
  const [loading, setLoading] = useState(false);
  const fallback = fallbackSource || require('../../assets/perfil.png');

  // Monta o endpoint e deixa o axios gerar a URL completa
  const safeTipo = encodeURIComponent(tipo);
  const endpoint = `/imagens/${safeTipo}/${tipoId}`;
  const params = refreshKey != null ? { ts: refreshKey } : undefined;

  // api.getUri() respeita o baseURL que você definiu em services/api.ts
  const uri = api.getUri({ url: endpoint, params });

  const imageStyle = { width, height, borderRadius, borderWidth, borderColor };

  return (
    <View style={[styles.container, imageStyle]}>
      <Image
        source={{ uri }}
        style={imageStyle}
        resizeMode="cover"
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => setLoading(false)}
        defaultSource={fallback}  // só Android
      />
      {loading && (
        <View style={[styles.loader, StyleSheet.absoluteFill]}>
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
}


const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.cinza_muito_claro,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
