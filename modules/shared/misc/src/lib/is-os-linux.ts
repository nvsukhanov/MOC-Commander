import { inject } from '@angular/core';

import { NAVIGATOR } from './types';

export function isOsLinux(navigator: Navigator = inject(NAVIGATOR)): boolean {
  return navigator.userAgent.toLowerCase().includes('linux');
}
