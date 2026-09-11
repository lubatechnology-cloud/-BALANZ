import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';

const EXCHANGE_RATES: Record<string, number> = {
  USD: 5.00,
  EUR: 5.45,
  GBP: 6.30,
  JPY: 0.034,
  ARS: 0.005,
  CLP: 0.0055,
  COP: 0.0012,
  BTC: 250000,
};

const CURRENCIES = [
  { code: 'BRL', name: 'Real Brasileiro', symbol: 'R$', flag: '🇧🇷' },
  { code: 'USD', name: 'Dólar Americano', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'Libra Esterlina', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Iene Japonês', symbol: '¥', flag: '🇯🇵' },
  { code: 'ARS', name: 'Peso Argentino', symbol: '$', flag: '🇦🇷' },
  { code: 'CLP', name: 'Peso Chileno', symbol: '$', flag: '🇨🇱' },
  { code: 'COP', name: 'Peso Colombiano', symbol: '$', flag: '🇨🇴' },
];

export default function CurrencyConverterScreen({ navigation }: any) {
  const [amount, setAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('BRL');
  const [toCurrency, setToCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState(0);

  useEffect(() => {
    convert();
  }, [amount, fromCurrency, toCurrency]);

  const convert = () => {
    const value = parseFloat(amount.replace(',', '.')) || 0;

    if (fromCurrency === 'BRL') {
      const rate = EXCHANGE_RATES[toCurrency] || 1;
      setConvertedAmount(value / rate);
    } else if (toCurrency === 'BRL') {
      const rate = EXCHANGE_RATES[fromCurrency] || 1;
      setConvertedAmount(value * rate);
    } else {
      const fromRate = EXCHANGE_RATES[fromCurrency] || 1;
      const toRate = EXCHANGE_RATES[toCurrency] || 1;
      const inBRL = value * fromRate;
      setConvertedAmount(inBRL / toRate);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const getRate = (code: string) => {
    if (code === 'BRL') return 1;
    return EXCHANGE_RATES[code] || 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Conversor de Moedas</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.converterCard}>
          <Text style={styles.converterLabel}>De</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={colors.textMuted}
            />
            <View style={styles.currencySelector}>
              <Text style={styles.flagText}>
                {CURRENCIES.find((c) => c.code === fromCurrency)?.flag}
              </Text>
              <Text style={styles.currencyCode}>{fromCurrency}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies}>
            <Ionicons name="swap-vertical" size={24} color={colors.primary} />
          </TouchableOpacity>

          <Text style={styles.converterLabel}>Para</Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultValue}>
              {convertedAmount.toFixed(2)}
            </Text>
            <View style={styles.currencySelector}>
              <Text style={styles.flagText}>
                {CURRENCIES.find((c) => c.code === toCurrency)?.flag}
              </Text>
              <Text style={styles.currencyCode}>{toCurrency}</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickSelect}>
          <Text style={styles.sectionTitle}>Converter para</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CURRENCIES.filter((c) => c.code !== fromCurrency).map((currency) => (
              <TouchableOpacity
                key={currency.code}
                style={[styles.quickChip, toCurrency === currency.code && styles.quickChipActive]}
                onPress={() => setToCurrency(currency.code)}
              >
                <Text style={styles.quickChipFlag}>{currency.flag}</Text>
                <Text style={[styles.quickChipCode, toCurrency === currency.code && styles.quickChipCodeActive]}>
                  {currency.code}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Taxas de Câmbio (referência)</Text>
          {CURRENCIES.filter((c) => c.code !== 'BRL' && c.code !== fromCurrency).map((currency, index) => (
            <View key={index} style={styles.rateItem}>
              <Text style={styles.rateFlag}>{currency.flag}</Text>
              <View style={styles.rateInfo}>
                <Text style={styles.rateCode}>{currency.code}</Text>
                <Text style={styles.rateName}>{currency.name}</Text>
              </View>
              <Text style={styles.rateValue}>
                R$ {getRate(currency.code).toFixed(2)}
              </Text>
            </View>
          ))}
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
  converterCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  converterLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  amountInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.base,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  flagText: {
    fontSize: 20,
  },
  currencyCode: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  swapButton: {
    alignSelf: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  resultRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  resultValue: {
    flex: 1,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  quickSelect: {
    marginBottom: spacing.xl,
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  quickChipActive: {
    backgroundColor: colors.primary,
  },
  quickChipFlag: {
    fontSize: 16,
  },
  quickChipCode: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  quickChipCodeActive: {
    color: colors.background,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  rateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.sm,
  },
  rateFlag: {
    fontSize: 24,
  },
  rateInfo: {
    flex: 1,
  },
  rateCode: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  rateName: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  rateValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
  },
});
