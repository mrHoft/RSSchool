import { isBig } from './resize.js'

export function menuShow(event) {
  if (event) event.stopPropagation()
  const burger_menu_button = document.querySelector('#burger_menu_button')
  if (burger_menu_button) burger_menu_button.style.display = 'none'
  const burger_menu = document.querySelector('#burger_menu')
  if (burger_menu) {
    burger_menu.style.display = 'flex'
    burger_menu.style.opacity = 1
  }
  const burger_menu_close = document.querySelector('#burger_menu_close')
  userHide()
  if (!isBig()) {
    if (burger_menu_close) burger_menu_close.style.display = 'block'
    document.addEventListener('click', menuHide)
  }
}

export function menuHide(event) {
  const burger_menu = document.querySelector('#burger_menu')
  if (event && event.target && event.target.contains(burger_menu)) return
  document.removeEventListener('click', menuHide)
  if (burger_menu) {
    burger_menu.style.opacity = 0
    setTimeout(() => (burger_menu.style.display = 'none'), 300)
  }
  const burger_menu_close = document.querySelector('#burger_menu_close')
  if (burger_menu_close) burger_menu_close.style.display = 'none'
  if (!isBig()) {
    const burger_menu_button = document.querySelector('#burger_menu_button')
    if (burger_menu_button) burger_menu_button.style.display = 'block'
  }
}

export function userShow(event) {
  const user_menu = document.querySelector('#user_menu')
  if (user_menu) {
    if (user_menu.style.display != 'block') {
      if (event) event.stopPropagation()
      menuHide()
      user_menu.style.display = 'block'
      document.addEventListener('click', userHide)
    }
  }
}

function userHide(event) {
  const user_menu = document.querySelector('#user_menu')
  if (event && event.target && user_menu.contains(event.target)) return
  document.removeEventListener('click', userHide)
  if (user_menu) user_menu.style.display = 'none'
}

export const userMenuHide = () => userHide()
