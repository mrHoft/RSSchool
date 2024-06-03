import { Device } from '../utils/device.js'

const device = new Device({ callback: menuStateCheck })

function menuStateCheck() {
  if (device.type() === 'desktop') {
    document.querySelector('.button__burger').classList.remove('active')
    document.querySelector('nav').classList.remove('active')
    document.body.style.removeProperty('overflow')
  }
}
