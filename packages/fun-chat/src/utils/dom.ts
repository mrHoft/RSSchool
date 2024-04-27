import { objectKeys } from './types.ts';

export function getElement<T extends HTMLElement>(
  selector: string,
  parent: Document | HTMLElement = document,
): NonNullable<T> {
  const el = parent.querySelector(selector);
  if (el) return el as T;
  throw new Error(
    `${selector} was not found in ${parent instanceof Document ? 'document' : parent.tagName}`,
  );
}

type TMouseEventHandler = (event: MouseEvent) => void;

type TElementProps = {
  name: string;
  className: string;
  textContent: string;
  onClick: TMouseEventHandler;
  src: string;
  href: string;
};

export function createElement<T extends HTMLElement>(
  tag: keyof HTMLElementTagNameMap,
  props: Partial<TElementProps & Record<keyof T, string | number | boolean>>,
) {
  const el = document.createElement(tag);
  objectKeys(props).forEach(key => {
    const val = props[key];
    if (val !== undefined) {
      switch (key) {
        case 'name': {
          if (tag === 'select') (el as HTMLSelectElement).name = val as string;
          if (tag === 'input') (el as HTMLInputElement).name = val as string;
          break;
        }
        case 'src': {
          if (tag === 'img') (el as HTMLImageElement).src = val as string;
          break;
        }
        case 'href': {
          if (tag === 'a') (el as HTMLAnchorElement).href = val as string;
          break;
        }
        case 'onClick': {
          el.onclick = props.onClick!;
          break;
        }
        default: {
          Object.assign(el, { [key]: val });
        }
      }
    }
  });

  return el as T;
}
