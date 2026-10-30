import { Device, PosCandidate } from '../types';

export const simulateNetworkEnvironment = (): Device[] => {
  return [
    {
      ip: '192.168.0.1',
      mac: '00:1A:2B:3C:4D:5E',
      openPorts:,
      hostname: 'Roteador_Principal_Gateway'
    },
    {
      ip: '192.168.0.15',
      mac: '00:15:70:AB:CD:EF', // OUI legítimo simulado de fabricante de Smart POS
      openPorts:,
      hostname: 'Terminal_Pagamento_Zaggy_POS'
    },
    {
      ip: '192.168.0.22',
      mac: '44:55:66:77:88:99',
      openPorts:, // Vulnerável: Telnet e ADB abertos na mesma rede do comércio
      hostname: 'Dispositivo_Vulneravel_Risco_Critico'
    }
  ];
};

export const runHeuristicValidation = (devices: Device[]): PosCandidate[] => {
  const candidates: PosCandidate[] = [];
  
  devices.forEach(device => {
    let isPos = false;
    let confidence = 0;
    const matchedCriteria: string[] = [];
    
    if (device.openPorts.includes(9100)) {
      isPos = true;
      confidence += 40;
      matchedCriteria.push('Portas ativas de automação/impressão comercial (9100)');
    }
    
    if (device.mac?.startsWith('00:15:70')) {
      isPos = true;
      confidence += 60;
      matchedCriteria.push('Fabricante identificado via base heurística do REA');
    }

    if (isPos) {
      candidates.push({
        device,
        isPos,
        confidence: Math.min(confidence, 100),
        matchedCriteria,
        detectedRisks: device.openPorts.includes(23) ? [{ severity: 'critical', description: 'Porta Telnet (23) exposta sem criptografia' }] : []
      });
    }
  });

  return candidates;
};
