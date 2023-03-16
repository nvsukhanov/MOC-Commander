import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-configure-hub-component',
    templateUrl: './configure-hub.component.html',
    styleUrls: [ './configure-hub.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigureHubComponent {

}
