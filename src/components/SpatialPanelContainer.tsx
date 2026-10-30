import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { colors, typography } from '../theme';
import { Device, PosCandidate } from '../types';

interface SpatialProps {
  devices: Device[];
  candidates: PosCandidate[];
  currentLogLine?: string;
}

export const SpatialPanelContainer: React.FC<SpatialProps> = ({ devices, candidates, currentLogLine }) => {
  return (
    <View style={styles.spatialWrapper}>
      {/* PAINEL ESQUERDO: Topologia e Mapeamento de IPs */}
      <View style={[styles.panel, styles.leftPanel]}>
        <Text style={styles.panelTitle}>🌐 TOPOLOGIA DE REDE</Text>
        <ScrollView style={styles.scroll}>
          {devices.map((d, i) => (
            <View key={i} style={styles.deviceRow}>
              <Text style={styles.monoText}>{d.ip}</Text>
              <Text style={styles.subText}>{d.hostname || 'Dispositivo Desconhecido'}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* PAINEL CENTRAL: Status Mestre da Auditoria */}
      <View style={[styles.panel, styles.centerPanel]}>
        <Text style={styles.panelTitle}>🥽 STATUS DA AUDITORIA</Text>
        <View style={styles.centerContent}>
          <Text style={styles.hugeStat}>{candidates.filter(c => c.isPos).length}</Text>
          <Text style={styles.subText}>Terminais POS/Totens Identificados em Campo</Text>
        </View>
      </View>

      {/* PAINEL DIREITO: Terminal de Logs de Baixo Nível (REA Engine) */}
      <View style={[styles.panel, styles.rightPanel]}>
        <Text style={styles.panelTitle}>🛠️ REA DEBUGLOG ENGINE</Text>
        <ScrollView style={styles.logContainer} contentContainerStyle={styles.logContent}>
          <Text style={styles.logText}>[REA-INIT] Carregando assinaturas ZIG Cashless...</Text>
          <Text style={styles.logText}>[PING-SWEEP] Escaneando sub-rede local ativa...</Text>
          {currentLogLine && <Text style={styles.logText}>> {currentLogLine}</Text>}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  spatialWrapper: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  panel: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginHorizontal: 8,
  },
  leftPanel: { flex: 0.9 },
  centerPanel: { flex: 1.2, justifyContent: 'space-between' },
  rightPanel: { flex: 0.9 },
  panelTitle: {
    color: colors.accentGreen,
    fontSize: typography.sizeBody,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  scroll: { flex: 1 },
  deviceRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  monoText: {
    color: colors.textPrimary,
    fontFamily: typography.fontMono,
    fontSize: typography.sizeBody,
  },
  subText: {
    color: colors.textSecondary,
    fontSize: typography.sizeLog,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hugeStat: {
    color: colors.textPrimary,
    fontSize: 48,
    fontWeight: 'bold',
  },
  logContainer: {
    flex: 1,
    backgroundColor: '#05070B',
    borderRadius: 6,
    padding: 8,
  },
  logContent: { paddingBottom: 16 },
  logText: {
    color: '#34D399',
    fontFamily: typography.fontMono,
    fontSize: typography.sizeLog,
    lineHeight: 18,
  },
});
