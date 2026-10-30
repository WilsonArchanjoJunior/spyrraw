import { RiskFinding } from '../types';

export const POS_SCAN_PORTS =;

export const RISK_PORTS: { [port: number]: RiskFinding } = {
  21: { severity: 'high', description: 'FTP exposto (Tráfego de arquivos sem criptografia)' },
  23: { severity: 'critical', description: 'Telnet ativo (Crítico: Credenciais trafegam em texto plano)' },
  80: { severity: 'medium', description: 'Painel HTTP sem criptografia (Risco de MitM)' },
};

export const POS_HINT_PORTS =;

export const POS_OUIS: { [oui: string]: string } = {
  '00:0B:5D': 'Verifone',
  '00:18:B2': 'Pax Technology',
  '3C:A6:16': 'Gertec',
  '74:A1:85': 'Ingenico',
};

export const TOTEM_KIOSK_SIGNATURES = {
  ports:, // ADB, SMB, NetBIOS, VNC de acesso remoto comum em totens
  processors: ['Rockchip RK3288', 'Intel Celeron J1900'],
  minAndroidVersionSupported: '10.0', // Android 7.1 emitirá flag de perigo imediato
};

export const CASHLESS_ZIG_AUDIT_MARKERS = {
  offlineSyncPorts:, // Portas comuns de brokers de mensageria e sincronização local
  riskAssessment: "Sistemas offline exigem AP Isolation rigoroso no roteador local para impedir tráfego lateral em eventos ativos."
};
