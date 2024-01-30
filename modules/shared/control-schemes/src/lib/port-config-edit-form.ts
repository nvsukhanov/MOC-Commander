import { FormControl, FormGroup } from '@angular/forms';

export type PortConfigEditForm = FormGroup<{
    hubId: FormControl<string | null>;
    portId: FormControl<number | null>;
    accelerationTimeMs: FormControl<number>;
    decelerationTimeMs: FormControl<number>;
}>;
