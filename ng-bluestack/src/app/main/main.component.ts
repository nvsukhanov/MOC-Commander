import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.html'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent {

}
