import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { PLANS, purchaseSubscription, restorePurchases } from '../../services/subscription/revenueCatService';

export default function SubscriptionScreen({ navigation }: any) {
  const [selectedPlan, setSelectedPlan] = React.useState('premium_monthly');
  const [isLoading, setIsLoading] = React.useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      const success = await purchaseSubscription(selectedPlan);
      if (success) {
        Alert.alert('Sucesso', 'Assinatura ativada!');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível processar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    setIsLoading(true);
    try {
      const success = await restorePurchases();
      if (success) {
        Alert.alert('Sucesso', 'Compras restauradas!');
      } else {
        Alert.alert('Aviso', 'Nenhuma compra encontrada');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível restaurar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Assinatura</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.heroSection}>
          <Ionicons name="diamond" size={48} color={colors.primary} />
          <Text style={styles.heroTitle}>Desbloqueie o BALANZ</Text>
          <Text style={styles.heroSubtitle}>
            Acesse todas as funcionalidades premium
          </Text>
        </View>

        <View style={styles.plansContainer}>
          {PLANS.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.planCardSelected,
              ]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <Text style={styles.planPeriod}>{plan.period}</Text>
                </View>
              </View>

              <View style={styles.featuresList}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={colors.income}
                    />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              {selectedPlan === plan.id && (
                <View style={styles.selectedBadge}>
                  <Ionicons name="checkmark" size={16} color={colors.background} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.buyButton, isLoading && styles.buyButtonDisabled]}
          onPress={handlePurchase}
          disabled={isLoading}
        >
          <Text style={styles.buyButtonText}>
            {isLoading ? 'Processando...' : 'Assinar agora'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
        >
          <Text style={styles.restoreButtonText}>Restaurar compras</Text>
        </TouchableOpacity>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Informações</Text>
          <Text style={styles.infoText}>
            • Pagamento processado pela Apple/Google
          {'\n'}• Cancele a qualquer momento
          {'\n'}• 7 dias de garantia
          {'\n'}• Dados seguros e criptografados
          </Text>
        </View>
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
  heroSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  heroTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  heroSubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  plansContainer: {
    gap: spacing.md,
  },
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  planCardSelected: {
    borderColor: colors.primary,
  },
  planHeader: {
    marginBottom: spacing.md,
  },
  planName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  planPrice: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  planPeriod: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  featuresList: {
    gap: spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  selectedBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.base,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  buyButtonDisabled: {
    opacity: 0.6,
  },
  buyButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.background,
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: spacing.base,
  },
  restoreButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
  },
  infoSection: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  infoTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
