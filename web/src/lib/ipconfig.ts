import os from 'os'

export function getIpAddress() {
  const networkInterfaces = os.networkInterfaces()

  const ip = networkInterfaces['Wi-Fi']?.filter(
    (protocol) => protocol.family === 'IPv4',
  )[0].address

  return ip || 'localhost'
}
