import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing } from '../../theme';

const { width } = Dimensions.get('window');

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: ChartData[];
  maxValue?: number;
  height?: number;
}

export function BarChart({ data, maxValue, height = 200 }: BarChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value));

  return (
    <View style={[styles.chartContainer, { height }]}>
      <View style={styles.barsContainer}>
        {data.map((item, index) => {
          const barHeight = max > 0 ? (item.value / max) * (height - 40) : 0;
          return (
            <View key={index} style={styles.barWrapper}>
              <Text style={styles.barValue}>
                {item.value > 0 ? `R$${item.value.toFixed(0)}` : ''}
              </Text>
              <View
                style={[
                  styles.bar,
                  {
                    height: Math.max(barHeight, 4),
                    backgroundColor: item.color || colors.primary,
                  },
                ]}
              />
              <Text style={styles.barLabel}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

interface PieChartProps {
  data: ChartData[];
  size?: number;
}

export function PieChart({ data, size = 150 }: PieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <View style={styles.pieContainer}>
      <View style={[styles.pieChart, { width: size, height: size }]}>
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          const rotation = (percentage / 100) * 360;
          return (
            <View
              key={index}
              style={[
                styles.pieSlice,
                {
                  width: size,
                  height: size,
                  backgroundColor: item.color || colors.primary,
                  opacity: percentage / 100,
                },
              ]}
            />
          );
        })}
      </View>
      <View style={styles.pieLegend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: item.color || colors.primary },
              ]}
            />
            <Text style={styles.legendLabel}>{item.label}</Text>
            <Text style={styles.legendValue}>{item.value.toFixed(0)}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

interface ProgressProps {
  progress: number;
  color?: string;
  height?: number;
}

export function ProgressBar({ progress, color, height = 8 }: ProgressProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const progressColor = clampedProgress >= 100 ? colors.expense : color || colors.primary;

  return (
    <View style={[styles.progressContainer, { height }]}>
      <View
        style={[
          styles.progressTrack,
          { height, backgroundColor: colors.surfaceLight },
        ]}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${clampedProgress}%`,
              height,
              backgroundColor: progressColor,
            },
          ]}
        />
      </View>
    </View>
  );
}

interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

export function Sparkline({
  data,
  color = colors.primary,
  width = 100,
  height = 30,
}: SparklineProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <View style={[styles.sparklineContainer, { width, height }]}>
      {data.map((value, index) => {
        const barHeight = ((value - min) / range) * height;
        return (
          <View
            key={index}
            style={[
              styles.sparklineBar,
              {
                width: Math.max(width / data.length - 1, 2),
                height: Math.max(barHeight, 2),
                backgroundColor: color,
                marginLeft: index > 0 ? 1 : 0,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    padding: spacing.base,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '100%',
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 24,
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  barValue: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  pieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  pieChart: {
    borderRadius: 75,
    overflow: 'hidden',
  },
  pieSlice: {
    position: 'absolute',
  },
  pieLegend: {
    flex: 1,
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  legendValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  progressContainer: {
    width: '100%',
  },
  progressTrack: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 4,
  },
  sparklineContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  sparklineBar: {
    borderRadius: 1,
  },
});
