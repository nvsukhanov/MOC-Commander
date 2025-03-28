import { getGamepadVendorAndProduct } from './get-gamepad-vendor-and-product';

describe('getGamepadVendorAndProduct', () => {
  it('should return null if the id does not match the expected format', () => {
    const id = 'Xbox 360 Controller (XInput STANDARD GAMEPAD)';
    const result = getGamepadVendorAndProduct(id);
    expect(result).toBeNull();
  });

  it('should return the vendor and product ids if the id matches the expected format', () => {
    const id = 'HID-compliant game controller (STANDARD GAMEPAD Vendor: 28de Product: 11ff)';
    const result = getGamepadVendorAndProduct(id);
    expect(result).toEqual({ vendorId: 0x28de, productId: 0x11ff });
  });
});
