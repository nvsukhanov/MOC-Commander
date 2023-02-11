import { NgModule } from '@angular/core';
import { ControlsModule } from './controls';
import { AnimationFrameTickerService } from './animation-frame-ticker.service';
import { TICKER } from './types';

@NgModule({
    imports: [
        ControlsModule
    ],
    providers: [
        { provide: TICKER, useClass: AnimationFrameTickerService }
    ]
})
export class EngineModule {
}
