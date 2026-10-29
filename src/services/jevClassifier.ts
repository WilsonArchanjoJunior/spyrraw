import { Device, JevDecision } from '../types';

// Wrapper de integração com a API da TypeSafe AI para o modelo Jev
export const classifyDeviceWithJev = async (device: Device, apiKey: string): Promise<JevDecision> => {
  if (!apiKey) {
    return { isPos: false, confidence: 0, criticalExploitRisk: false, suggestedAction: 'none' };
  }

  try {
    // Chamada otimizada para o endpoint System One do Jev (Tempo de resposta esperado: <150ms)
    const response = await fetch('https://typesafe.ai', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        state: `Device IP: ${device.ip}, Open Ports: ${device.openPorts.join(', ')}, Hostname: ${device.hostname || 'unknown'}`,
        schema: {
          isPos: 'boolean',
          confidence: 'number',
          criticalExploitRisk: 'boolean',
          suggestedAction: 'string' // valores restritos tratados no parse
        }
      }),
    });

    if (!response.ok) throw new Error('Jev API error');
    const data = await response.json();
    
    return {
      isPos: !!data.isPos,
      confidence: data.confidence || 0,
      criticalExploitRisk: !!data.criticalExploitRisk,
      suggestedAction: (data.suggestedAction === 'isolate' || data.suggestedAction === 'monitor') ? data.suggestedAction : 'none'
    };
  } catch (error) {
    // Fallback silencioso seguro para não travar a thread de varredura nativa
    return { isPos: false, confidence: 0, criticalExploitRisk: false, suggestedAction: 'none' };
  }
};
