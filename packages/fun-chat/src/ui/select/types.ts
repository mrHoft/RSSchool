export interface FormInputProps
  extends Partial<Record<Exclude<keyof HTMLSelectElement, 'options'>, string>> {
  name: string;
  options: string[];
  placeholder?: string;
  onChange?: (ev: Event) => void;
}
