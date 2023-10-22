export class EventBus {
  listeners = {}

  constructor() {
    this.listeners = {}
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = []
    this.listeners[event].push(callback)
  }

  off(event, callback) {
    if (!this.listeners[event]) throw new Error(`No event: ${event}`)
    this.listeners[event] = this.listeners[event].filter(listener => listener !== callback)
  }

  emit(event, ...args) {
    if (!this.listeners[event]) throw new Error(`No event: ${event}`)
    this.listeners[event].forEach(listener => {
      listener(...args)
    })
  }

  clear() {
    this.listeners = {}
  }

  emit_and_clear(event, ...args) {
    this.emit(event, ...args)
    this.listeners = {}
  }
}
