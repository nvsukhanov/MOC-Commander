import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { GamepadConnectListener, ExtractTokenType, GamepadMapperFactoryService, TICKER } from '../engine';
import { map, switchMap } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    constructor(
        private stack: GamepadConnectListener,
        @Inject(TICKER) private ticker: ExtractTokenType<typeof TICKER>,
        private mapperFactory: GamepadMapperFactoryService
    ) {
        this.stack.gamepadConnect$.pipe(
            map((b) => b.index),
            switchMap((id) => {
                const mapper = this.mapperFactory.create(id);
                return this.ticker.tick$.pipe(
                    map(() => mapper.getCurrentControls())
                )
            })
        ).subscribe((e) => {
            console.log(e);
        });
    }
}
