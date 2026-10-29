import TcpSocket from 'react-native-tcp-socket';

export type ProbeStatus = 'open' | 'refused' | 'silent';

export interface ProbeResult {
  port: number;
  status: ProbeStatus;
}

export const probePort = (ip: string, port: number, timeout: number = 800): Promise<ProbeResult> => {
  return new Promise((resolve) => {
    let isResolved = false;

    const client = TcpSocket.createConnection({ host: ip, port, timeout }, () => {
      if (!isResolved) {
        isResolved = true;
        cleanup();
        resolve({ port, status: 'open' });
      }
    });

    const timer = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        cleanup();
        resolve({ port, status: 'silent' });
      }
    }, timeout);

    const cleanup = () => {
      clearTimeout(timer);
      try {
        client.destroy();
      } catch (e) {}
      client.removeAllListeners();
    };

    client.on('error', (err: any) => {
      if (!isResolved) {
        isResolved = true;
        cleanup();
        const errMsg = err?.message?.toLowerCase() || '';
        if (errMsg.includes('refused') || errMsg.includes('econnrefused')) {
          resolve({ port, status: 'refused' });
        } else {
          resolve({ port, status: 'silent' });
        }
      }
    });
  });
};
