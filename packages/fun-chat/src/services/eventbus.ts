interface Callback<T = unknown> {
  (...args: T[]): void;
}

export default class EventBus {
  private listeners: { [key: string]: Callback[] } = {};

  public on<T>(event: string, callback: Callback<T>) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback as Callback);
  }

  public off<T>(event: string, callback: Callback<T>) {
    if (!this.listeners[event]) throw new Error(`No event: ${event}`);
    this.listeners[event] = this.listeners[event].filter(listener => listener !== callback);
  }

  public emit(event: string, ...args: unknown[]) {
    if (!this.listeners[event]) throw new Error(`No event: ${event}`);
    this.listeners[event].forEach(callback => {
      callback(...args);
    });
  }

  public clear() {
    this.listeners = {};
  }

  protected emit_and_clear(event: string, ...args: unknown[]) {
    this.emit(event, ...args);
    this.listeners = {};
  }
}
