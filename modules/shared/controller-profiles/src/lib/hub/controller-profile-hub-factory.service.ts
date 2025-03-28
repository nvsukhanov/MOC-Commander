import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import { ControllerProfileHub } from './controller-profile-hub';

@Injectable()
export class ControllerProfileHubFactoryService {
  constructor(private readonly translocoService: TranslocoService) {}

  public build(hubId: string): ControllerProfileHub {
    return new ControllerProfileHub(this.buildUid(hubId), hubId, this.translocoService);
  }

  public fromUid(uid: string): ControllerProfileHub | null {
    if (!this.uidIsHub(uid)) {
      return null;
    }
    const hubId = this.getHubIdFromUid(uid);
    return this.build(hubId);
  }

  private uidIsHub(uid: string): boolean {
    return uid.startsWith('hub-');
  }

  private buildUid(hubId: string): string {
    return `hub-${hubId}`;
  }

  private getHubIdFromUid(uid: string): string {
    return uid.replace('hub-', '');
  }
}
