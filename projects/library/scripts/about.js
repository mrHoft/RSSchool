import { opacityAnimate } from './animation.js'
import { isBig } from './resize.js'

const galeryAll = new Array(6).fill('el_').map((n, i) => n + (i + 1))
let galeryCurrent = 1

/**
 * Set 'about' section images.
 * @param {number} n image number (1-6)
 */
export function sliderSet(n) {
  const about = document.querySelector('#about')
  if (about) {
    const buttonList = about.querySelectorAll('.dot_button')
    buttonList.forEach((el, i) => el.classList.toggle('own', i === n - 1))

    const imageList = about.querySelectorAll('.item')
    if (isBig()) {
      imageList.forEach((el, i) => {
        el.classList.remove(...galeryAll)
        el.classList.add('el_' + (i - ~~(i / 3) * 3 + n))
        opacityAnimate(el)
      })
    } else {
      const el = imageList[0]
      el.classList.remove(...galeryAll)
      el.classList.add('el_' + n)
      opacityAnimate(el)
    }

    const arrowList = about.querySelectorAll('.slider_arrow')
    arrowList[0].classList.toggle('slider_arrow_disabled', n === 1)
    arrowList[1].classList.toggle('slider_arrow_disabled', n === 5)
  }
  galeryCurrent = n
}

export function sliderSwitch(event, n) {
  const shift = n > galeryCurrent ? 1 : -1
  sliderSet(galeryCurrent + shift)
}

export function sliderShift(event, shift) {
  const n = galeryCurrent + shift
  if (n >= 1 && n <= 5) sliderSet(n)
}
