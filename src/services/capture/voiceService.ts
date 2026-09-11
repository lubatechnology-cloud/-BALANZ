import { expoSpeechRecognition } from 'expo-speech-recognition';
import { parseVoiceCommand } from './parser';
import { Transaction } from '../types';

let isListening = false;

export async function startVoiceCapture(
  onResult: (transaction: Partial<Transaction>) => void,
  onError: (error: string) => void
): Promise<void> {
  if (isListening) {
    onError('Já está ouvindo');
    return;
  }

  try {
    const { status } = await expoSpeechRecognition.requestPermissionsAsync();
    if (status !== 'granted') {
      onError('Permissão de microfone negada');
      return;
    }

    isListening = true;

    expoSpeechRecognition.start({
      language: 'pt-BR',
      interimResults: false,
      maxAlternatives: 1,
    });

    expoSpeechRecognition.onResult((event) => {
      const transcript = event.value[0]?.transcript;
      if (transcript) {
        const parsed = parseVoiceCommand(transcript);
        if (parsed) {
          onResult({
            amount: parsed.amount,
            type: parsed.type,
            description: parsed.description,
            category: parsed.category,
            source: 'voice',
          });
        } else {
          onError('Não consegui entender. Tente novamente.');
        }
      }
    });

    expoSpeechRecognition.onError((event) => {
      isListening = false;
      onError('Erro ao reconhecer voz');
    });

    expoSpeechRecognition.onEnd(() => {
      isListening = false;
    });
  } catch (error) {
    isListening = false;
    onError('Erro ao iniciar reconhecimento de voz');
  }
}

export function stopVoiceCapture(): void {
  if (isListening) {
    expoSpeechRecognition.stop();
    isListening = false;
  }
}

export function isVoiceCaptureActive(): boolean {
  return isListening;
}
