import * as ImagePicker from 'expo-image-picker';
import { parseSMSMessage } from './parser';
import { PendingTransaction } from '../types';

export async function pickImage(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  return result.assets[0].uri;
}

export async function takePhoto(): Promise<string | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    quality: 0.8,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  return result.assets[0].uri;
}

export async function processReceiptImage(
  imageUri: string
): Promise<PendingTransaction | null> {
  try {
    console.log('OCR Service: Processando imagem...');
    console.log('OCR Service: Use Google ML Kit (Android) ou Apple Vision (iOS)');

    return {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      amount: 0,
      type: 'expense',
      category: 'other_expense',
      description: 'Fatura escaneada',
      date: new Date(),
      source: 'ocr',
      rawMessage: imageUri,
      isConfirmed: false,
    };
  } catch (error) {
    console.error('Erro no OCR:', error);
    return null;
  }
}

export async function extractTextFromImage(
  imageUri: string
): Promise<string> {
  console.log('OCR Service: Extraindo texto de:', imageUri);
  return '';
}
