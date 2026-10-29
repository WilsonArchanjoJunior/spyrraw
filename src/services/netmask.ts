export const netmaskToPrefixLength = (netmask: string | null): number => {
  if (!netmask) return 24; // Fallback clássico se for nulo

  const octets = netmask.split('.').map(Number);
  if (octets.length !== 4 || octets.some(isNaN)) return 24;

  // Transforma os octetos em uma string binária contínua
  const binaryString = octets.map(o => o.toString(2).padStart(8, '0')).join('');

  // Validação rigorosa: máscara legítima só possui 1s seguidos de 0s
  const firstZero = binaryString.indexOf('0');
  const lastOne = binaryString.lastIndexOf('1');

  if (firstZero !== -1 && lastOne !== -1 && firstZero < lastOne) {
    return 24; // Dado corrompido, ejeta para o fallback seguro
  }

  const prefixLength = binaryString.split('1').length - 1;
  return prefixLength > 0 && prefixLength <= 32 ? prefixLength : 24;
};
