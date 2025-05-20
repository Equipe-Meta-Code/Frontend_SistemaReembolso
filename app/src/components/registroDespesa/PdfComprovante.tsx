import React from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import api from '../../services/api';

interface PdfComprovanteProps {
  comprovanteId: number;
  width?: number;
  height?: number;
}

export default function PdfComprovante({
  comprovanteId,
  width = Dimensions.get('window').width - 40,
  height = 300,
}: PdfComprovanteProps) {

  // retira possível barra final da baseURL
  const baseURL = api.defaults.baseURL!.replace(/\/$/, '');
  const pdfUrl = `${baseURL}/comprovantes/${comprovanteId}`;

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
  webview: { flex: 1 },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
