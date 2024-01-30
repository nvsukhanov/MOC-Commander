import { FormGroup } from '@angular/forms';

export interface IBindingsDetailsEditComponent<TBindingForm extends FormGroup = FormGroup> {
    setForm(form: TBindingForm): void;
}
