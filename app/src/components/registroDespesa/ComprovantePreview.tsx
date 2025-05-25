import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { themas } from '../../global/themes';

interface Props {
  uri: string;
  mimeType: string;
  onClose: () => void;
}

export default function ComprovantePreview({ uri, mimeType, onClose }: Props) {
  const isPdf = mimeType === 'application/pdf';
  const { width, height } = Dimensions.get('window');

  if (!isPdf) {
    return (
      <TouchableOpacity style={styles.imageContainer} onPress={onClose} activeOpacity={1}>
        <Image
          source={{ uri }}
          style={{ width, height }}
          resizeMode="contain"
        />
        <Text style={styles.tapToClose}>Toque para fechar</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.pdfContainer}>
      <WebView
        source={{ uri }}
        style={{ width, height: height - 60 }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={themas.colors.secondary} />
            <Text style={styles.loaderText}>Carregando PDF…</Text>
          </View>
        )}
        originWhitelist={['*']}
        allowFileAccess
        allowUniversalAccessFromFileURLs
        allowFileAccessFromFileURLs
      />
      <TouchableOpacity style={styles.closePdf} onPress={onClose}>
        <Text style={styles.closeText}>Fechar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tapToClose: {
    position: 'absolute',
    bottom: 20,
    color: themas.colors.secondary,
    fontSize: 16,
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: themas.colors.primary,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: themas.colors.transparente,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 8,
    color: themas.colors.secondary,
  },
  closePdf: {
    height: 60,
    backgroundColor: themas.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: themas.colors.secondary,
    fontSize: 16,
  },
});