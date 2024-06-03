export class Device {
  mediaQuery
  _device = 'desktop'
  _callback = () => undefined

  constructor({ query = '(max-width: 768px)', callback }) {
    this.mediaQuery = window.matchMedia(query)
    this.mediaQuery.addEventListener('change', this.handleTabletChange)
    this.handleTabletChange(this.mediaQuery)
    if (callback) this._callback = callback
  }

  handleTabletChange = event => {
    this._device = event.matches ? 'mobile' : 'desktop'
    this._callback()
  }

  remove() {
    this.mediaQuery.removeEventListener('change', this.handleTabletChange)
  }

  type() {
    return this._device
  }
}
