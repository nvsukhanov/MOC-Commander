export function calculateTaskHash(hubId: string, portId: number, payloadHash: string): string {
  return `${hubId}/${portId}/${payloadHash}`;
}
