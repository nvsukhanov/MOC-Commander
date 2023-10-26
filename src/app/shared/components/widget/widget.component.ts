import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { PushPipe } from '@ngrx/component';

@Component({
    standalone: true,
    selector: 'app-widget',
    templateUrl: './widget.component.html',
    styleUrls: [ './widget.component.scss' ],
    imports: [
        MatCardModule,
        NgIf,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        PushPipe,
        NgTemplateOutlet
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetComponent {
    @Input() public title?: string;

    @Input() public subTitle?: string;

    @Input() public canBeRemoved = false;

    @Input() public canBeEdited = false;

    @Output() public readonly remove = new EventEmitter<void>();

    @Output() public readonly edit = new EventEmitter<void>();

    public onRemove(): void {
        this.remove.emit();
    }

    public onEdit(): void {
        this.edit.emit();
    }
}
