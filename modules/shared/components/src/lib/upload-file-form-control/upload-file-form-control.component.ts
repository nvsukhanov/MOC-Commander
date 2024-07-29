import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription, from } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';
import { ValidationMessagesDirective } from '@app/shared-misc';

import { EllipsisTitleDirective } from '../ellipsis-title.directive';

@Component({
    standalone: true,
    selector: 'lib-upload-file',
    templateUrl: './upload-file-form-control.component.html',
    styleUrls: [ './upload-file-form-control.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatInputModule,
        ValidationMessagesDirective,
        MatButtonModule,
        TranslocoPipe,
        EllipsisTitleDirective
    ],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: UploadFileFormControlComponent, multi: true }
    ]
})
export class UploadFileFormControlComponent implements ControlValueAccessor, OnDestroy {
    @Input() public translocoTitle = 'uploadFileButtonTitle';

    @ViewChild('fileInput', { static: true }) public fileInput!: ElementRef<HTMLInputElement>;

    private controlUpdateSub?: Subscription;

    private _file?: File;

    private _isDisabled = false;

    constructor(
        private readonly cdRef: ChangeDetectorRef
    ) {
    }

    public get file(): File | undefined {
        return this._file;
    }

    public get isDisabled(): boolean {
        return this._isDisabled;
    }

    public registerOnChange(
        fn: (value: string | null) => void
    ): void {
        this.onChangeFn = fn;
    }

    public registerOnTouched(
        fn: () => void
    ): void {
        this.onTouchedFn = fn;
    }

    public setDisabledState(
        isDisabled: boolean
    ): void {
        this._isDisabled = isDisabled;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public writeValue(): void {
    }

    public onUploadClick(
        event: Event
    ): void {
        event.preventDefault();
        this.fileInput.nativeElement.click();
    }

    public onUploaded(
        event: Event
    ): void {
        this._file = (event.target as HTMLInputElement).files?.[0];
        if (!this._file) {
            return;
        }
        this.controlUpdateSub?.unsubscribe();
        this.controlUpdateSub = from(this._file.text()).subscribe((content) => {
            this.onTouchedFn();
            this.onChangeFn(content);
            this.cdRef.markForCheck();
        });
    }

    public ngOnDestroy(): void {
        this.controlUpdateSub?.unsubscribe();
    }

    private onChangeFn: (value: string) => void = () => void 0;

    private onTouchedFn: () => void = () => void 0;
}
