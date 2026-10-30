import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { theme } from './src/theme';
import { StatusCard } from './src/components/StatusCard';

export default function App() {
  // Estados simulados para a demonstração tática da interface espacial
  const [scanStatus, setScanStatus] = useState<'idle' | 'running' | 'ok' | 'warn' | 'danger'>('idle');
  const [targetCount, setTargetCount] = useState<number>(0);
  const [riskMetrics, setRiskMetrics] = useState<string>('0%');

  // Ciclo heurístico simulado semelhante aos playbooks do Alethe Orchestrate
  useEffect(() => {
    if (scanStatus === 'running') {
      const interval = setInterval(() => {
        setTargetCount(prev => {
          if (prev >= 14) {
            clearInterval(interval);
            setScanStatus('danger'); // Interceptou vulnerabilidade crítica na rede POS
            setRiskMetrics('92%');
            return 14;
          }
          return prev + 2;
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [scanStatus]);

  const dispararAuditoria = () => {
    setTargetCount(0);
    setRiskMetrics('0%');
    setScanStatus('running');
  };

  const resetarPainel = () => {
    setTargetCount(0);
    setRiskMetrics('0%');
    setScanStatus('idle');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Cabeçalho estendido para telas Virtuais AR de 70° */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>SPYRRAW // SPATIAL NET</Text>
          <Text style={styles.headerSubtitle}>Ambiente Orquestrado Android XR - Módulo Puck Qualcomm</Text>
        </View>

        {/* Painel de Controle Superior */}
        <View style={styles.controlPanel}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.colors.primary }]} 
            onPress={dispararAuditoria}
          >
            <Text style={styles.buttonText}>AUDITAR REDE LOCAL</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#334155' }]} 
            onPress={resetarPainel}
          >
            <Text style={styles.buttonText}>LIMPAR BUFFER</Text>
          </TouchableOpacity>
        </View>

        {/* Trindade de Painéis Espaciais (Unbounded Canvas) */}
        <StatusCard 
          title="Orquestrador Alethe"
          subtitle={scanStatus === 'running' ? "Buscando agentes e playbooks ativos..." : "Agentes Claude Code locais em espera."}
          status={scanStatus}
          metric={scanStatus === 'idle' ? "IDLE" : scanStatus === 'running' ? "SCAN" : "WARN"}
        />

        <StatusCard 
          title="Varredura Heurística REA"
          subtitle="Análise lateral de buffers em terminais físicos de pagamento (Totens/POS)."
          status={scanStatus === 'danger' ? 'danger' : scanStatus === 'running' ? 'running' : 'idle'}
          metric={`${targetCount} IPs`}
        />

        <StatusCard 
          title="Gemini Multimodal XR"
          subtitle="Mapeamento de risco topológico e prevenção de perdas estruturais."
          status={scanStatus === 'danger' ? 'warn' : scanStatus === 'running' ? 'running' : 'idle'}
          metric={riskMetrics}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.typography.size.display,
    fontWeight: theme.typography.weight.bold as any,
    color: theme.colors.text,
    letterSpacing: 1.5,
  },
  headerSubtitle: {
    fontSize: theme.typography.size.body,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  controlPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: theme.typography.size.body,
    fontWeight: theme.typography.weight.bold as any,
    letterSpacing: 1,
  },
});
