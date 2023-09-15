import { Inject, Injectable } from '@angular/core';
import { DeepPartial, LzmaService, WINDOW } from '@app/shared';
import { AppStoreVersion, ControlSchemeModel } from '@app/store';

import { ControlSchemeCompressionResult, ExportVersion } from '../export-control-scheme-dialog';

@Injectable()
export class ControlSchemeDecompressorService {
    private readonly exportVersion = ExportVersion.V1;

    constructor(
        @Inject(WINDOW) private readonly window: Window,
        private readonly lzma: LzmaService
    ) {
    }

    public decompress(
        importString: string
    ): DeepPartial<ControlSchemeModel> {
        const trimmedImportString = importString.replace(/\r|\n|\s|\t/g, '');
        const [ version, payload ] = trimmedImportString.split(':');
        if (version !== String(this.exportVersion)) {
            // TODO: add strategy for handling different export versions
            throw new Error('Unsupported export version');
        }
        const decodedPayload = this.window.atob(payload);
        const payloadByteArray = decodedPayload.split('')
                                               .map((char) => char.charCodeAt(0))
                                               .map((byte) => byte - 128);
        const uncompressedPayload = this.lzma.decompress(payloadByteArray);
        const payloadObject = JSON.parse(uncompressedPayload);
        if (!this.isPayloadObject(payloadObject)) {
            throw new Error('Invalid import string');
        }
        if (payloadObject.s !== AppStoreVersion.latest) {
            // TODO: add migration logic
            throw new Error('Invalid storage version');
        }
        return payloadObject.c;
    }

    private isPayloadObject(
        result: unknown
    ): result is ControlSchemeCompressionResult {
        // noinspection SuspiciousTypeOfGuard
        return (
            typeof result === 'object' &&
            result !== null &&
            typeof (result as ControlSchemeCompressionResult).s === 'string' &&
            typeof (result as ControlSchemeCompressionResult).c === 'object'
        );
    }
}
