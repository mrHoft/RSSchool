import { Carousel } from './carousel.js'

const JUMP_SIZE = 1024
export const isBig = () => window.innerWidth > JUMP_SIZE //document.documentElement.clientWidth

export function onResize() {
  const big = isBig()
  console.log(`Window size: ${big ? 'big' : 'small'} (${window.innerWidth})`)
  // Header
  const burger_menu_button = document.querySelector('#burger_menu_button')
  if (burger_menu_button) burger_menu_button.style.display = big ? 'none' : 'block'

  new Carousel().setup()
}
