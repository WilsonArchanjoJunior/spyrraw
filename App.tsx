import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, StatusBar } from 'react-native';
import { colors } from './src/theme';
import { useConsent } from './src/hooks/useConsent';
import { useScanner } from './src/hooks/useScanner';
import { ConsentScreen } from './src/components/ConsentScreen';
import { StatusCard } from './src/components/StatusCard';
import { ScanButton } from './src/components/ScanButton';
import { DetailsScreen } from './src/components/DetailsScreen';

export default function App() {
  const { hasConsented, loadingConsent, acceptConsent } = useConsent();
  const { isScanning, progress, currentStep, devices, posCandidates, isolationResult, error, startScan, cancelScan } = useScanner();
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'details'>('dashboard');

  // Chave fictícia de demonstração para ativar a camada Jev no scan local
  const JEV_API_KEY = "ts_jev_live_demo_key_free_output";

  if (loadingConsent) return null;

  if (!hasConsented) {
    return <ConsentScreen onAccept={acceptConsent} />;
  }

  if (currentScreen === 'details') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <DetailsScreen 
          devices={devices} 
          posCandidates={posCandidates} 
          isolation={isolationResult || { isIsolated: null, testedHostsCount: 0, reachableHosts: [] }} 
          onBack={() => setCurrentScreen('dashboard')} 
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.content}>
        <StatusCard 
          isScanning={isScanning} 
          progress={progress} 
          currentStep={currentStep} 
          deviceCount={devices.length} 
          isolation={isolationResult}
          error={error}
          onViewDetails={() => setCurrentScreen('details')}
        />
        <ScanButton 
          isScanning={isScanning} 
          onPress={() => isScanning ? cancelScan() : startScan(JEV_API_KEY)} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
});
