import { Inject, Injectable } from '@angular/core';
import { ControlSchemeModel, STORAGE_VERSION } from '@app/store';
import { LzmaService, WINDOW } from '@app/shared';

export enum ExportVersion {
    V1
}

export type ControlSchemeCompressionResult = {
    s: string; // storage version
    c: ControlSchemeModel; // control scheme
};

@Injectable()
export class ControlSchemeCompressorService {
    constructor(
        @Inject(WINDOW) private readonly window: Window,
        private lzma: LzmaService
    ) {
    }

    public compress(
        scheme: ControlSchemeModel
    ): string {
        const payload: ControlSchemeCompressionResult = {
            s: STORAGE_VERSION,
            c: scheme
        };
        const payloadStringified = JSON.stringify(payload);

        const schemeByteArray = this.lzma.compress(payloadStringified);
        const schemePreparedByteArray = schemeByteArray.map((byte) => byte + 128);
        const resultStringified = String.fromCharCode(...schemePreparedByteArray);
        const payloadBase64 = this.window.btoa(resultStringified);
        return [ ExportVersion.V1, payloadBase64 ].join(':');
    }
}
