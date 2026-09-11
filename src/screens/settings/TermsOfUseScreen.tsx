import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';

export default function TermsOfUseScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Termos de Uso</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>1. Aceitação dos Termos</Text>
        <Text style={styles.text}>
          Ao usar o BALANZ, você concorda com estes Termos de Uso. Se não concordar, não use o aplicativo.
        </Text>

        <Text style={styles.sectionTitle}>2. Descrição do Serviço</Text>
        <Text style={styles.text}>
          O BALANZ é um aplicativo de gestão financeira pessoal que oferece registro de transações, captura automática, relatórios e orçamentos.
        </Text>

        <Text style={styles.sectionTitle}>3. Conta do Usuário</Text>
        <Text style={styles.text}>
          Você é responsável por manter a confidencialidade de sua senha e por notificar sobre uso não autorizado.
        </Text>

        <Text style={styles.sectionTitle}>4. Uso Aceitável</Text>
        <Text style={styles.text}>
          Você concorda em NÃO usar o aplicativo para fins ilegais, tentar acessar contas de outros usuários, ou interferir no funcionamento do serviço.
        </Text>

        <Text style={styles.sectionTitle}>5. Conteúdo do Usuário</Text>
        <Text style={styles.text}>
          Seus dados financeiros são de sua propriedade. Você pode exportar ou excluir a qualquer momento.
        </Text>

        <Text style={styles.sectionTitle}>6. Assinaturas e Pagamentos</Text>
        <Text style={styles.text}>
          Pagamentos são processados via Apple App Store ou Google Play. Cancele a qualquer momento nas configurações.
        </Text>

        <Text style={styles.sectionTitle}>7. Isenção de Responsabilidade</Text>
        <Text style={styles.text}>
          O BALANZ não é um consultor financeiro. Você é o único responsável por suas decisões financeiras.
        </Text>

        <Text style={styles.sectionTitle}>8. Alterações</Text>
        <Text style={styles.text}>
          Podemos alterar estes termos a qualquer momento. Notificaremos sobre alterações significativas.
        </Text>

        <Text style={styles.sectionTitle}>9. Contato</Text>
        <Text style={styles.text}>
          Para dúvidas: suporte@balanz.app
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
