import { isOsLinux } from './is-os-linux';

describe('isOsLinux', () => {
  it('should return true if browser is running on Linux platform', () => {
    const userAgent =
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    const navigator = { userAgent } as Navigator;

    expect(isOsLinux(navigator)).toBe(true);
  });

  it('should return false if browser is running on Windows platform', () => {
    const userAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    const navigator = { userAgent } as Navigator;

    expect(isOsLinux(navigator)).toBe(false);
  });

  it('should return false if browser is running on Mac platform', () => {
    const userAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    const navigator = { userAgent } as Navigator;

    expect(isOsLinux(navigator)).toBe(false);
  });
});
