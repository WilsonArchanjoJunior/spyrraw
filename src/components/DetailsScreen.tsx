import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { colors, typography } from '../theme';
import { Device, PosCandidate, IsolationResult } from '../types';
import { SpatialPanelContainer } from './SpatialPanelContainer';

interface DetailsProps {
  devices: Device[];
  posCandidates: PosCandidate[];
  isolation: IsolationResult;
  onBack: () => void;
}

export const DetailsScreen: React.FC<DetailsProps> = ({ devices, posCandidates, isolation, onBack }) => {
  return (
    <View style={styles.container}>
      {/* Cabeçalho de Controle Superior */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Voltar ao Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Painel Tático de Auditoria</Text>
      </View>

      {/* Renderiza a Interface Espacial Panorâmica Multiplataforma (Estilo kc1t / Meta Quest) */}
      <View style={styles.spatialArea}>
        <SpatialPanelContainer 
          devices={devices} 
          candidates={posCandidates} 
          currentLogLine={isolation.isIsolated === false ? "ALERTA: Falha na segmentação de tráfego lateral detectada!" : "Isolamento de AP validado com sucesso."}
        />
      </View>

      {/* Resumo de Vulnerabilidades no Rodapé */}
      <View style={styles.footerSummary}>
        <Text style={styles.summaryText}>
          Total de IPs: <Text style={styles.highlight}>{devices.length}</Text> | 
          Terminais POS: <Text style={styles.highlight}>{posCandidates.filter(c => c.isPos).length}</Text> | 
          Status de Rede: <Text style={[styles.highlight, { color: isolation.isIsolated ? colors.accentGreen : colors.accentRed }]}>
            {isolation.isIsolated ? 'Isolada (Segura)' : 'Exposta (Perigo)'}
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: colors.border,
  },
  backButtonText: {
    color: colors.textPrimary,
    fontSize: typography.sizeLog,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizeTitle - 4,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  spatialArea: {
    flex: 1,
  },
  footerSummary: {
    padding: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  summaryText: {
    color: colors.textSecondary,
    fontSize: typography.sizeLog,
  },
  highlight: {
    color: colors.accentGreen,
    fontWeight: 'bold',
  },
});
