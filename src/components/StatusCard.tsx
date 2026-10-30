import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { theme } from '../theme';

interface StatusCardProps {
  title: string;
  subtitle: string;
  status: 'idle' | 'running' | 'ok' | 'warn' | 'danger' | 'error';
  metric?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({ title, subtitle, status, metric }) => {
  // Determina a cor de destaque com base no estado do scanner heurístico via REA
  const getStatusColor = () => {
    switch (status) {
      case 'running': return theme.colors.primary;
      case 'ok': return theme.colors.primary;
      case 'warn': return theme.colors.warning;
      case 'danger': return theme.colors.danger;
      case 'error': return theme.colors.danger;
      default: return theme.colors.textMuted;
    }
  };

  // Altera o plano de fundo dinamicamente para manter o contraste espacial nas lentes do XREAL AURA
  const getBackgroundColor = () => {
    if (status === 'danger') return '#2A1415'; // Tom de alerta crítico translúcido
    if (status === 'warn') return '#261C10';   // Tom de aviso preventivo translúcido
    return theme.colors.surface;               // Verde-carapaça escuro padrão
  };

  const statusColor = getStatusColor();
  const backgroundColor = getBackgroundColor();

  return (
    <View style={[styles.card, { backgroundColor, borderColor: statusColor }]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        
        {/* Indicador visual de processamento ou estado */}
        {status === 'running' ? (
          <ActivityIndicator color={theme.colors.primary} size="small" />
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
    borderRadius: theme.borderRadius.card,
    borderWidth: 1.5,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4, // Projeta sombra flutuante nos painéis espaciais (Android XR)
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.size.title,
    fontWeight: theme.typography.weight.bold as any,
    color: theme.colors.text,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: theme.typography.size.body,
    fontWeight: theme.typography.weight.regular as any,
    color: theme.colors.textMuted,
    lineHeight: 24,
  },
  indicatorBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  metricContainer: {
    marginTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.xs,
    alignItems: 'flex-end',
  },
  metricText: {
    fontSize: theme.typography.size.display,
    fontWeight: theme.typography.weight.bold as any,
  },
});
