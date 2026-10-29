import { Device, PosCandidate, RiskFinding } from '../types';
import { probePort } from './tcpProbe';
import { POS_SCAN_PORTS, RISK_PORTS, POS_HINT_PORTS, POS_OUIS } from '../constants/posSignatures';

interface FingerprintOptions {
  devices: Device[];
  concurrency?: number;
  timeout?: number;
  onProgress: (progress: number) => void;
  signal?: AbortSignal;
}

export const performPosFingerprint = async ({
  devices,
  concurrency = 5,
  timeout = 1000,
  onProgress,
  signal,
}: FingerprintOptions): Promise<PosCandidate[]> => {
  const candidates: PosCandidate[] = [];
  let processedDevices = 0;

  if (devices.length === 0) {
    onProgress(1);
    return [];
  }

  const fingerprintDevice = async (device: Device): Promise<PosCandidate | null> => {
    if (signal?.aborted) return null;

    const portsToScan = POS_SCAN_PORTS.filter(p => !device.openPorts.includes(p));
    const probeResults = await Promise.all(
      portsToScan.map(port => probePort(device.ip, port, timeout))
    );

    const newOpenPorts = probeResults
      .filter(r => r.status === 'open')
      .map(r => r.port);

    const allOpenPorts = [...device.openPorts, ...newOpenPorts];

    let isPos = false;
    let confidence = 0;
    const matchedCriteria: string[] = [];
    const detectedRisks: RiskFinding[] = [];

    if (device.mac) {
      const cleanMac = device.mac.toUpperCase().replace(/-/g, ':');
      const oui = cleanMac.substring(0, 8);
      if (POS_OUIS[oui]) {
        isPos = true;
        confidence += 60;
        matchedCriteria.push(`Fabricante identificado via MAC: ${POS_OUIS[oui]}`);
      }
    }

    const hasPosPorts = allOpenPorts.some(p => POS_HINT_PORTS.includes(p));
    if (hasPosPorts) {
      isPos = true;
      confidence += 40;
      matchedCriteria.push('Portas ativas de automação/impressão comercial (ex: 9100/10001)');
    }

    allOpenPorts.forEach(port => {
      if (RISK_PORTS[port]) {
        detectedRisks.push(RISK_PORTS[port]);
      }
    });

    const isHighOrCritical = detectedRisks.some(r => r.severity === 'high' || r.severity === 'critical');

    if (isPos || isHighOrCritical) {
      return {
        device: { ...device, openPorts: allOpenPorts },
        isPos,
        confidence: Math.min(confidence, 100),
        matchedCriteria,
        detectedRisks,
      };
    }

    return null;
  };

  const deviceQueue = [...devices];
  const worker = async () => {
    while (deviceQueue.length > 0 && !signal?.aborted) {
      const device = deviceQueue.shift();
      if (!device) break;

      const candidate = await fingerprintDevice(device);
      if (candidate && !signal?.aborted) {
        candidates.push(candidate);
      }

      processedDevices++;
      onProgress(processedDevices / devices.length);
    }
  };

  const workers = Array.from({ length: Math.min(concurrency, devices.length) }, () => worker());
  await Promise.all(workers);

  if (signal?.aborted) {
    throw new Error('Scan aborted by user');
  }

  return candidates;
};
