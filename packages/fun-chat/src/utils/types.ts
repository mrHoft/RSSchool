export const objectKeys = <T extends Record<PropertyKey, unknown>, K extends keyof T>(obj: T) =>
  Object.keys(obj) as K[];

interface ConstructorOf<T> {
  new (...args: readonly never[]): T;
}

export function getDOMElement<T extends Node>(
  elemType: ConstructorOf<T>,
  element: Element | Document | DocumentFragment,
): T {
  if (!(element instanceof elemType)) {
    throw new Error(`Not expected value: ${element} of type:${elemType}`);
  }
  return element;
}
