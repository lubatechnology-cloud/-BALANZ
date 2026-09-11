import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '../../theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width, height = 16, borderRadius = 8, style }: SkeletonProps) {
  return (
    <View
      style={[
        styles.skeleton,
        { width: width as any, height, borderRadius },
        style,
      ]}
    />
  );
}

export function TransactionSkeleton() {
  return (
    <View style={styles.transactionSkeleton}>
      <View style={styles.transactionLeft}>
        <Skeleton width={44} height={44} borderRadius={12} />
        <View style={styles.transactionInfo}>
          <Skeleton width="70%" height={14} />
          <Skeleton width="40%" height={12} style={{ marginTop: 6 }} />
        </View>
      </View>
      <Skeleton width={60} height={14} />
    </View>
  );
}

export function BalanceSkeleton() {
  return (
    <View style={styles.balanceSkeleton}>
      <Skeleton width={80} height={14} />
      <Skeleton width="60%" height={32} style={{ marginTop: 8 }} />
      <View style={styles.balanceRow}>
        <Skeleton width="30%" height={14} />
        <Skeleton width="30%" height={14} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.surfaceLight,
    opacity: 0.7,
  },
  transactionSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  transactionInfo: {
    flex: 1,
  },
  balanceSkeleton: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
  },
  balanceRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.base,
  },
});
