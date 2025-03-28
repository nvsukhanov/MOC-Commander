export interface IBindingFormBuilder<TForm> {
  build(): TForm;
  patchForm(form: TForm, patch: object): void;
}
