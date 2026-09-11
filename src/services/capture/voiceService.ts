let isListening = false;

export async function startVoiceCapture(
  onResult: (transaction: any) => void,
  onError: (error: string) => void
): Promise<void> {
  if (isListening) {
    onError('Já está ouvindo');
    return;
  }

  try {
    isListening = true;

    const { Alert } = require('react-native');
    Alert.alert(
      'Comando de Voz',
      'Digite sua transação:\n\nEx: "Gastei 50 reais no mercado"',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            isListening = false;
            onError('Digite a transação manualmente ou instale expo-speech');
          },
        },
      ]
    );
  } catch (error) {
    isListening = false;
    onError('Erro ao iniciar reconhecimento de voz');
  }
}

export function stopVoiceCapture(): void {
  isListening = false;
}

export function isVoiceCaptureActive(): boolean {
  return isListening;
}
