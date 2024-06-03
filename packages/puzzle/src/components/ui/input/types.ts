export interface FormInputProps extends Partial<Record<keyof HTMLInputElement, string>> {
  name: string;
  type?: string;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  onChange?: (ev: Event) => void;
  onInput?: (ev: Event) => void;
}
