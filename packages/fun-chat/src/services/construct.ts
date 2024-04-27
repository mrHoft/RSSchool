import { objectKeys } from '../utils/types';
import { cloneDeep, isEqual } from '../utils/utils';
import EventBus from './eventbus';

export type TProps<T extends HTMLElement> = {
  name?: string;
  events?: () => void;
  child?: HTMLElement | DocumentFragment | HTMLElement[];
  state?: Indexed;
  update?: (state?: Indexed) => void;
} & Partial<Record<keyof T, string | number | boolean>>;

const serviceProps = ['name', 'events', 'render', 'state'];

export default class Construct<TElement extends HTMLElement = HTMLElement> {
  static EVENTS = {
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
    FLOW_UPDATE: 'flow:update',
  } as const;

  private _props: TProps<TElement>;
  private $el: HTMLElement;
  private _meta: { tag: keyof HTMLElementTagNameMap; props: TProps<TElement> };
  private eventBus: EventBus;

  constructor(tag: keyof HTMLElementTagNameMap, props: TProps<TElement>) {
    this._meta = { tag, props };
    this.eventBus = new EventBus();
    this._props = this._makePropsProxy(props);
    this._registerEvents();
    this.$el = this._createElement();
    this.eventBus.emit(Construct.EVENTS.FLOW_RENDER);
  }

  private _registerEvents() {
    this.eventBus.on(Construct.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    this.eventBus.on(Construct.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    this.eventBus.on(Construct.EVENTS.FLOW_RENDER, this._render.bind(this));
    this.eventBus.on(Construct.EVENTS.FLOW_UPDATE, this._update.bind(this));
  }

  private _addEvents(): void {
    const { events = {} } = this._props;
    objectKeys(events).forEach(eventName => {
      this.$el.addEventListener(eventName, events[eventName]);
    });
  }

  private _removeEvents(oldProps: TProps<TElement>): void {
    const { events = {} } = oldProps;
    objectKeys(events).forEach(eventName => {
      this.$el.removeEventListener(eventName, events[eventName]);
    });
  }

  private _createElement() {
    const {
      tag,
      props: { child },
    } = this._meta;
    const el = document.createElement(tag);
    if (child) {
      if (Array.isArray(child)) el.append(...child);
      else el.append(child);
    }
    return el;
  }

  private _componentDidMount(/* oldProps: TProps<TElement> */): void {
    // No action
  }

  public dispatchComponentDidMount() {
    this.eventBus.emit(Construct.EVENTS.FLOW_CDM);
  }

  private _componentDidUpdate(oldProps: TProps<TElement>, newProps: TProps<TElement>): void {
    if (
      Object.keys(oldProps).length !== Object.keys(newProps).length ||
      !isEqual(oldProps, newProps)
    ) {
      this._removeEvents(oldProps);
      this.eventBus.emit(Construct.EVENTS.FLOW_UPDATE);
    }
  }

  private _update() {
    if (this._props.update) {
      this._props.update(this._props.state);
    }
  }

  setProps = (newProps: TProps<TElement>): void => {
    if (!newProps) return;
    const oldProps = <Indexed>cloneDeep(this._props);
    Object.assign(this._props, newProps);
    this.eventBus.emit(Construct.EVENTS.FLOW_CDU, oldProps, newProps);
  };

  get el() {
    return this.$el;
  }

  private _render(): void {
    Object.keys(this._props).forEach(key => {
      if (!serviceProps.includes(key)) {
        const value = this._props[key as keyof TProps<TElement>];
        Object.assign(this.$el, { [key]: value });
      }
    });
    this._addEvents();
  }

  private _makePropsProxy = (props: TProps<TElement>) => {
    const { eventBus } = this;
    const proxy = new Proxy(props, {
      set(target: Record<string, unknown>, prop: string, value: unknown) {
        const oldTarget = { ...target };
        target[prop] = value;
        eventBus.emit(Construct.EVENTS.FLOW_CDU, oldTarget, target);
        return true;
      },
      deleteProperty() {
        throw new Error('Deleting property denied');
      },
    });
    return proxy as TProps<TElement>;
  };

  show(): void {
    if (this.$el) this.$el.style.display = '';
  }

  hide(): void {
    if (this.$el) this.$el.style.display = 'none';
  }
}
