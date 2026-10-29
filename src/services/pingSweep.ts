import { Device } from '../types';
import { probePort } from './tcpProbe';

interface PingSweepOptions {
  subnet: string;
  excludeIp?: string | null;
  portsToTest?: number[];
  concurrency?: number;
  timeout?: number;
  onProgress: (progress: number) => void;
  signal?: AbortSignal;
}

const DEFAULT_PORTS =;

export const performPingSweep = async ({
  subnet,
  excludeIp = null,
  portsToTest = DEFAULT_PORTS,
  concurrency = 25,
  timeout = 800,
  onProgress,
  signal,
}: PingSweepOptions): Promise<Device[]> => {
  const activeDevices: Device[] = [];
  const totalHosts = 254;
  let processedHosts = 0;

  const ipQueue = Array.from({ length: totalHosts }, (_, i) => `${subnet}.${i + 1}`);

  const scanHost = async (ip: string): Promise<number[] | null> => {
    if (signal?.aborted || ip === excludeIp) return null;

    // Testa as portas em paralelo para máxima eficiência
    const probeResults = await Promise.all(
      portsToTest.map(port => probePort(ip, port, timeout))
    );

    const openPorts = probeResults
      .filter(r => r.status === 'open')
      .map(r => r.port);

    const isAlive = probeResults.some(r => r.status === 'open' || r.status === 'refused');

    return isAlive ? openPorts : null;
  };

  const worker = async () => {
    while (ipQueue.length > 0 && !signal?.aborted) {
      const ip = ipQueue.shift();
      if (!ip) break;

      const openPorts = await scanHost(ip);
      
      if (openPorts !== null && !signal?.aborted) {
        activeDevices.push({
          ip,
          mac: null,
          hostname: `Host-${ip.split('.').pop()}`,
          openPorts,
          lastSeen: Date.now(),
        });
      }

      processedHosts++;
      onProgress(processedHosts / totalHosts);
    }
  };

  const workers = Array.from({ length: Math.min(concurrency, totalHosts) }, () => worker());
  await Promise.all(workers);

  if (signal?.aborted) {
    throw new Error('Scan aborted by user');
  }

  // Ordena os dispositivos encontrados pelo último octeto do IP
  return activeDevices.sort((a, b) => {
    const numA = parseInt(a.ip.split('.').pop() || '0', 10);
    const numB = parseInt(b.ip.split('.').pop() || '0', 10);
    return numA - numB;
  });
};
