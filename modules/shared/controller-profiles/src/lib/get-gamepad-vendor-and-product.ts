export function getGamepadVendorAndProduct(id: string): { vendorId: number; productId: number } | null {
  const match = id.match(/Vendor: ([0-9a-fA-F]+) Product: ([0-9a-fA-F]+)/);
  if (!match) {
    return null;
  }
  const vendorId = parseInt(match[1], 16);
  const productId = parseInt(match[2], 16);
  return { vendorId, productId };
}
