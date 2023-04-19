import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ExtractSelectorFactoryReturnType } from '../../../types';
import { CONTROL_BINDING_SCHEME_SELECTORS } from '../../../store';

type BindingData = ExtractSelectorFactoryReturnType<typeof CONTROL_BINDING_SCHEME_SELECTORS.selectFullSchemeBindingDataBySchemeId> extends Array<infer T>
                   ? T
                   : never;

@Component({
    standalone: true,
    selector: 'app-control-scheme-binding-view',
    templateUrl: './control-scheme-binding-view.component.html',
    styleUrls: [ './control-scheme-binding-view.component.scss' ],
    imports: [
        JsonPipe,
        MatCardModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeBindingViewComponent {
    @Input() public binding: BindingData | undefined;
}
