export interface NetworkInfo {
  ip: string | null;
  subnet: string | null;
  gateway: string | null;
  netmask: string | null;
  type: string | null;
}

export interface Device {
  ip: string;
  mac: string | null;
  hostname?: string;
  openPorts: number[];
  lastSeen?: number;
}

export interface RiskFinding {
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface PosCandidate {
  device: Device;
  isPos: boolean;
  confidence: number;
  matchedCriteria: string[];
  detectedRisks: RiskFinding[];
}

export interface IsolationResult {
  isIsolated: boolean | null;
  testedHostsCount: number;
  reachableHosts: string[];
  gatewayAssumed?: boolean;
}

export interface JevDecision {
  isPos: boolean;
  confidence: number;
  criticalExploitRisk: boolean;
  suggestedAction: 'isolate' | 'monitor' | 'none';
}
