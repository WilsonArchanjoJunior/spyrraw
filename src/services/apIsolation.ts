import { Device, IsolationResult } from '../types';
import { probePort } from './tcpProbe';

interface IsolationOptions {
  activeDevices: Device[];
  gatewayIp: string | null;
  concurrency?: number;
  timeout?: number;
  onProgress: (progress: number) => void;
  signal?: AbortSignal;
}

export const performApIsolationCheck = async ({
  activeDevices,
  gatewayIp,
  concurrency = 5,
  timeout = 1200,
  onProgress,
  signal,
}: IsolationOptions): Promise<IsolationResult> => {
  const targets = activeDevices.filter(d => d.ip !== gatewayIp);
  let gatewayAssumed = false;
  let currentGateway = gatewayIp;

  if (!currentGateway && activeDevices.length > 0) {
    const baseIp = activeDevices[0].ip.substring(0, activeDevices[0].ip.lastIndexOf('.'));
    currentGateway = `${baseIp}.1`;
    gatewayAssumed = true;
  }

  if (targets.length === 0) {
    onProgress(1);
    return {
      isIsolated: null,
      testedHostsCount: 0,
      reachableHosts: [],
      gatewayAssumed,
    };
  }

  const reachableHosts: string[] = [];
  let processedTargets = 0;
  const queue = [...targets];

  const worker = async () => {
    while (queue.length > 0 && !signal?.aborted) {
      const target = queue.shift();
      if (!target) break;

      const portsToTest = target.openPorts.length > 0 ? target.openPorts :;
      let canReachTarget = false;

      const probeResults = await Promise.all(
        portsToTest.map(port => probePort(target.ip, port, timeout))
      );

      canReachTarget = probeResults.some(r => r.status !== 'silent');

      if (canReachTarget && !signal?.aborted) {
        reachableHosts.push(target.ip);
      }

      processedTargets++;
      onProgress(processedTargets / targets.length);
    }
  };

  const workers = Array.from({ length: Math.min(concurrency, targets.length) }, () => worker());
  await Promise.all(workers);

  if (signal?.aborted) {
    throw new Error('Scan aborted by user');
  }

  return {
    isIsolated: reachableHosts.length === 0 ? null : false,
    testedHostsCount: targets.length,
    reachableHosts,
    gatewayAssumed,
  };
};
