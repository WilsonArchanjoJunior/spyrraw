import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';

interface StatusCardProps {
  title: string;
  subtitle: string;
  status: 'idle' | 'running' | 'ok' | 'warn' | 'danger' | 'error';
  metric?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({ title, subtitle, status, metric }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'running': return colors.primary;
      case 'ok': return colors.primary;
      case 'warn': return colors.warning;
      case 'danger': return colors.danger;
      case 'error': return colors.danger;
      default: return colors.textMuted;
    }
  };

  const getBackgroundColor = () => {
    if (status === 'danger') return '#2A1415';
    if (status === 'warn') return '#261C10';
    return colors.surface;
  };

  const statusColor = getStatusColor();
  const backgroundColor = getBackgroundColor();

  return (
    <View style={[styles.card, { backgroundColor, borderColor: statusColor }]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        {status === 'running' ? (
          <ActivityIndicator color={colors.primary} size="small" />
        ) : (
          <View style={[styles.indicatorBadge, { backgroundColor: statusColor }]} />
        )}
      </View>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {metric && (
        <View style={styles.metricContainer}>
          <Text style={[styles.metricText, { color: statusColor }]}>{metric}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.card,
    borderWidth: 1.5,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.size.title,
    fontWeight: typography.weight.bold as any,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.size.body,
    color: colors.textMuted,
    lineHeight: 24,
  },
  indicatorBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  metricContainer: {
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.xs,
    alignItems: 'flex-end',
  },
  metricText: {
    fontSize: typography.size.display,
    fontWeight: typography.weight.bold as any,
  },
});
