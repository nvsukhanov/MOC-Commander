import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { PushPipe } from '@ngrx/component';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    standalone: true,
    selector: 'app-control-scheme-page-compact-toolbar',
    templateUrl: './control-scheme-page-compact-toolbar.component.html',
    styleUrls: [ './control-scheme-page-compact-toolbar.component.scss' ],
    imports: [
        MatButtonModule,
        NgIf,
        PushPipe,
        TranslocoPipe,
        MatIconModule,
        MatMenuModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemePageCompactToolbarComponent {
    @Input() public canRun = false;

    @Input() public canStop = false;

    @Input() public canExport = false;

    @Input() public canAddBinding = false;

    @Output() public readonly run = new EventEmitter<void>();

    @Output() public readonly stop = new EventEmitter<void>();

    @Output() public readonly addBinding = new EventEmitter<void>();

    @Output() public readonly export = new EventEmitter<void>();

    @Output() public readonly delete = new EventEmitter<void>();

    public onRun(): void {
        this.run.emit();
    }

    public onStop(): void {
        this.stop.emit();
    }

    public onAddBinding(): void {
        this.addBinding.emit();
    }

    public onDelete(): void {
        this.delete.emit();
    }

    public onExport(): void {
        this.export.emit();
    }
}
