import React, { useState } from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  ImageSourcePropType
} from 'react-native';
import api from '../../services/api';

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
  uriComprovante: string;
}

export default function Comprovante({
  tipo,
  tipoId,
  width = 200,
  height = 200,
  borderRadius = 8,
  borderWidth = 0,
  borderColor = '#000',
  refreshKey,
  fallbackSource,
  uriComprovante,
}: Props) {
  
  const [loading, setLoading] = useState(false);
  const fallback = fallbackSource || require('../../assets/perfil.png');
  const uriFinal = uriComprovante;
  const imageStyle = { width, height, borderRadius, borderWidth, borderColor };

  return (
    <View style={[styles.container, imageStyle]}>
      <Image
        source={{ uri: uriFinal }}
        style={imageStyle}
        resizeMode="cover"
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => setLoading(false)}
        defaultSource={fallback}
      />
      {loading && (
        <View style={[styles.loader, StyleSheet.absoluteFill]}>
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});