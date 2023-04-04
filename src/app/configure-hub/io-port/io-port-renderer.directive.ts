import { ComponentRef, Directive, Input, ViewContainerRef } from '@angular/core';
import { IIoPortRenderer, IIoPortRendererConfig } from './i-io-port-renderer';
import { IOType } from '../../lego-hub';
import { IoPortViewComponentResolverService } from './io-port-view-component-resolver.service';
import { UnknownIoComponent } from './renderers';

type RenderedComponentDescriptor = {
    ioType: IOType;
    componentRef: ComponentRef<IIoPortRenderer>;
}

@Directive({
    selector: '[appIoPortRenderer]',
    standalone: true,
})
export class IoPortRendererDirective {
    private componentDescriptor?: RenderedComponentDescriptor;

    private unknownIOComponentRef?: ComponentRef<UnknownIoComponent>;

    constructor(
        private readonly viewContainerRef: ViewContainerRef,
        private readonly resolver: IoPortViewComponentResolverService
    ) {
    }

    @Input('appIoPortRenderer')
    public set ioType({ type, config }: { type: IOType, config: IIoPortRendererConfig }) {
        const resolvedComponentType = this.resolver.resolveComponentType(type);

        if (this.componentDescriptor?.ioType === type) {
            this.componentDescriptor.componentRef.instance.setConfig(config);
            return;
        }

        this.componentDescriptor?.componentRef.destroy();
        this.viewContainerRef.clear();

        if (!resolvedComponentType) {
            if (!this.unknownIOComponentRef) {
                this.unknownIOComponentRef = this.viewContainerRef.createComponent(UnknownIoComponent);
            }
            return;
        }

        this.unknownIOComponentRef?.destroy();
        this.unknownIOComponentRef = undefined;
        this.componentDescriptor = {
            ioType: type,
            componentRef: this.viewContainerRef.createComponent(resolvedComponentType)
        };
        this.componentDescriptor.componentRef.instance.setConfig(config);
    }
}
