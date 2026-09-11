import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';

export default function PrivacyPolicyScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Política de Privacidade</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>1. Introdução</Text>
        <Text style={styles.text}>
          O BALANZ respeita sua privacidade. Esta política descreve como coletamos, usamos e protegemos suas informações.
        </Text>

        <Text style={styles.sectionTitle}>2. Informações Coletadas</Text>
        <Text style={styles.text}>
          • Dados de cadastro: nome, e-mail{'\n'}
          • Transações financeiras: descrição, valor, categoria{'\n'}
          • Dados de uso: funcionalidades utilizadas
        </Text>

        <Text style={styles.sectionTitle}>3. Como Usamos seus Dados</Text>
        <Text style={styles.text}>
          • Processar transações{'\n'}
          • Gerar relatórios{'\n'}
          • Melhorar o aplicativo{'\n'}
          • Enviar alertas relevantes
        </Text>

        <Text style={styles.sectionTitle}>4. Compartilhamento</Text>
        <Text style={styles.text}>
          NÃO compartilhamos seus dados com terceiros para fins de marketing. Compartilhamos apenas quando exigido por lei.
        </Text>

        <Text style={styles.sectionTitle}>5. Segurança</Text>
        <Text style={styles.text}>
          • Criptografia de dados sensíveis{'\n'}
          • Armazenamento local no dispositivo{'\n'}
          • Autenticação biométrica opcional
        </Text>

        <Text style={styles.sectionTitle}>6. Seus Direitos</Text>
        <Text style={styles.text}>
          Você pode acessar, exportar ou excluir seus dados a qualquer momento.
        </Text>

        <Text style={styles.sectionTitle}>7. Contato</Text>
        <Text style={styles.text}>
          Para dúvidas: privacidade@balanz.app
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  text: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});
