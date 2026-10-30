import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors, spacing, borderRadius, typography } from './src/theme';
import { StatusCard } from './src/components/StatusCard';

export default function App() {
  const [scanStatus, setScanStatus] = useState<'idle' | 'running' | 'ok' | 'warn' | 'danger'>('idle');
  const [targetCount, setTargetCount] = useState<number>(0);
  const [riskMetrics, setRiskMetrics] = useState<string>('0%');

  useEffect(() => {
    if (scanStatus === 'running') {
      const interval = setInterval(() => {
        setTargetCount(prev => {
          if (prev >= 14) {
            clearInterval(interval);
            setScanStatus('danger');
            setRiskMetrics('92%');
            return 14;
          }
          return prev + 2;
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [scanStatus]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>SPYRRAW // SPATIAL NET</Text>
          <Text style={styles.headerSubtitle}>Ambiente Orquestrado Android XR</Text>
        </View>

        <View style={styles.controlPanel}>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => setScanStatus('running')}>
            <Text style={styles.buttonText}>AUDITAR REDE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#334155' }]} onPress={() => setScanStatus('idle')}>
            <Text style={styles.buttonText}>LIMPAR</Text>
          </TouchableOpacity>
        </View>

        <StatusCard title="Orquestrador Alethe" subtitle="Agentes Claude Code locais em espera." status={scanStatus} metric={scanStatus.toUpperCase()} />
        <StatusCard title="Varredura Heurística REA" subtitle="Análise lateral de buffers em terminais físicos (Totens/POS)." status={scanStatus === 'danger' ? 'danger' : scanStatus === 'running' ? 'running' : 'idle'} metric={`${targetCount} IPs`} />
        <StatusCard title="Gemini Multimodal XR" subtitle="Mapeamento de risco topológico e prevenção de perdas." status={scanStatus === 'danger' ? 'warn' : scanStatus === 'running' ? 'running' : 'idle'} metric={riskMetrics} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  header: { marginBottom: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: spacing.md },
  headerTitle: { fontSize: typography.size.display, fontWeight: typography.weight.bold as any, color: colors.text, letterSpacing: 1.5 },
  headerSubtitle: { fontSize: typography.size.body, color: colors.textMuted, marginTop: spacing.xs },
  controlPanel: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md, marginBottom: spacing.xl },
  button: { flex: 1, paddingVertical: spacing.md, borderRadius: borderRadius.button, alignItems: 'center', justifyContent: 'center', elevation: 5 },
  buttonText: { color: '#FFF', fontSize: typography.size.body, fontWeight: typography.weight.bold as any },
});
