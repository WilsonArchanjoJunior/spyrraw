import { useState, useCallback, useRef } from 'react';
import { Device, PosCandidate, IsolationResult } from '../types';
import { performPingSweep } from '../services/pingSweep';
import { performApIsolationCheck } from '../services/apIsolation';
import { triggerLocalNetworkPermission, getDhcpDetails } from '../../modules/spyrraw-network/src';
import { classifyDeviceWithJev } from '../services/jevClassifier';
import { Platform } from 'react-native';

export const useScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [devices, setDevices] = useState<Device[]>([]);
  const [posCandidates, setPosCandidates] = useState<PosCandidate[]>([]);
  const [isolationResult, setIsolationResult] = useState<IsolationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const startScan = useCallback(async (jevApiKey?: string) => {
    setIsScanning(true);
    setProgress(0);
    setError(null);
    setDevices([]);
    setPosCandidates([]);
    setIsolationResult(null);
    abortControllerRef.current = new AbortController();

    try {
      // 1. Verificação Crítica de Permissão de Rede Local no iOS 14+
      if (Platform.OS === 'ios') {
        setCurrentStep('Verificando permissão de rede local...');
        const hasPermission = await triggerLocalNetworkPermission();
        if (hasPermission === false) {
          throw new Error('Permissão de Rede Local negada. Ative em Ajustes › Privacidade e Segurança › Rede Local.');
        }
      }

      // 2. Coleta de Metadados de Rede via Módulo Nativo
      setCurrentStep('Coletando informações da rede nativa...');
      const dhcp = getDhcpDetails();
      const baseSubnet = dhcp.gateway ? dhcp.gateway.substring(0, dhcp.gateway.lastIndexOf('.')) : '192.168.1';
      const myIp = '192.168.1.50'; // IP fictício simulado para exclusão de loop

      // 3. Fase 1: Varredura de IPs (Ping Sweep de Alta Concorrência)
      setCurrentStep('Executando varredura rápida de IPs (Ping Sweep)...');
      const foundDevices = await performPingSweep({
        subnet: baseSubnet,
        excludeIp: myIp,
        onProgress: (p) => setProgress(p * 0.4), // Consome 40% da barra de carregamento
        signal: abortControllerRef.current.signal,
      });
      setDevices(foundDevices);

      // 4. Fase 2: Triagem de Inteligência em Tempo Real com o Jev (TypeSafe AI)
      setCurrentStep('Processando assinaturas e riscos em tempo real com Jev AI...');
      const candidates: PosCandidate[] = [];
      for (let i = 0; i < foundDevices.length; i++) {
        if (abortControllerRef.current.signal.aborted) break;
        
        const device = foundDevices[i];
        // Executa a inferência ultra veloz (<150ms) com custo de saída gratuito do Jev
        const jevDec = await classifyDeviceWithJev(device, jevApiKey || '');
        
        // Converte a decisão estruturada do Jev para o modelo de dados do Spyrraw
        candidates.push({
          device,
          isPos: jevDec.isPos,
          confidence: jevDec.confidence,
          matchedCriteria: jevDec.isPos ? [`Classificado via System One Model (Ação: ${jevDec.suggestedAction})`] : [],
          detectedRisks: jevDec.criticalExploitRisk ? [{ severity: 'critical', description: 'Risco crítico de exploit ativo detectado na porta' }] : [],
        });
        setProgress(0.4 + ((i + 1) / foundDevices.length) * 0.3); // Consome 30% da barra
      }
      setPosCandidates(candidates);

      // 5. Fase 3: Validação Empírica de Alcance Lateral (AP Isolation Check)
      setCurrentStep('Testando segmentação de tráfego lateral (AP Isolation)...');
      const isolation = await performApIsolationCheck({
        activeDevices: foundDevices,
        gatewayIp: dhcp.gateway,
        onProgress: (p) => setProgress(0.7 + p * 0.3), // Consome os últimos 30% da barra
        signal: abortControllerRef.current.signal,
      });
      setIsolationResult(isolation);
      setCurrentStep('Auditoria finalizada com sucesso.');

    } catch (err: any) {
      if (err.message !== 'Scan aborted by user') {
        setError(err.message || 'Erro inesperado durante a auditoria.');
      }
    } finally {
      setIsScanning(false);
    }
  }, []);

  const cancelScan = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsScanning(false);
    setCurrentStep('Auditoria cancelada pelo usuário.');
  }, []);

  return { isScanning, progress, currentStep, devices, posCandidates, isolationResult, error, startScan, cancelScan };
};
