import React from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import api from '../../services/api';

interface PdfComprovanteProps {
  tipo: string;
  tipoId: number;
  width?: number;
  height?: number;
}

export default function PdfComprovante({
  tipo,
  tipoId,
  width = Dimensions.get('window').width - 40,
  height = 300,
}: PdfComprovanteProps) {

  const baseURL = api.defaults.baseURL!.replace(/\/$/, '');
  const pdfUrl = `${baseURL}/comprovantes/${encodeURIComponent(tipo)}/${tipoId}`;

  return (
    <View style={[styles.container, { width, height }]}>
      <WebView
        source={{ uri: pdfUrl }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loader}>
            <ActivityIndicator size="large" />
          </View>
        )}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
  },
  webview: {
    flex: 1,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
