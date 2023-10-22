import { Store } from '../utils/store.js'
import { defaultProfileData } from '../data/profile.js'
import { profileStatistics } from '../conponents/statistics.js'

const store = new Store()

export function fillCardInfo() {
  const card_info = document.querySelector('#card_info')
  if (card_info) {
    const { authorized, visits, score, books } = { ...defaultProfileData, ...store.get('profile') }
    card_info.innerHTML = authorized ? profileStatistics(visits, score, books.length) : '<button type="submit">Check the card</button>'
  }
}

export function fillProfileData() {
  const { authorized, user, id, visits, score, books } = { ...defaultProfileData, ...store.get('profile') }
  const { password, ...omit } = user
  console.log({ authorized, user: omit, id, visits, score, books })

  const initials = ((user.first_name[0] || 'J') + (user.last_name[0] || 'D')).toUpperCase()
  const fullName = `${user.first_name || 'John'} ${user.last_name || 'Doe'}`

  // Login
  const form_login = document.querySelector('#form_login')
  if (user.email && form_login) {
    const inputList = form_login.querySelectorAll('input')
    inputList[0].value = user.email
  }

  // User menu
  const user_menu = document.querySelector('#user_menu')
  if (user_menu) {
    const linkList = user_menu.querySelectorAll('a')
    linkList.forEach((el, i) => (el.hidden = authorized != (i % 2 != 0)))

    // Вместо надписи Profile отображается девятизначный Card Number
    const menuTitle = user_menu.querySelector('li strong')
    if (menuTitle) {
      menuTitle.textContent = authorized ? id : 'Profile'
      menuTitle.classList.toggle('menu-title', authorized)
    }
  }

  // Card
  fillCardInfo()
  const find_card = document.querySelector('#find_card')
  if (find_card) {
    find_card.querySelector('.find_card-title').textContent = authorized ? 'Your Library card' : 'Digital Library Cards'
    find_card.querySelector('.card-title').textContent = authorized ? 'Brooklyn Public Library' : 'Find your Library card'
    const inputList = find_card.querySelectorAll('input')
    inputList[0].value = authorized ? fullName : ''
    inputList[1].value = authorized ? id : ''
  }

  const get_card = document.querySelector('#get_card')
  if (get_card) {
    get_card.querySelector('.get_card-title').textContent = authorized ? 'Visit your profile' : 'Get a reader card'
    get_card.querySelector('.get_card-description').textContent = authorized
      ? 'With a digital library card you get free access to the Library’s wide array of digital resources including e-books, databases, educational resources, and more.'
      : 'You will be able to see a reader card after logging into account or you can register a new account'

    const buttonsList = get_card.querySelectorAll('.small-button')
    buttonsList[0].hidden = authorized
    buttonsList[1].hidden = authorized
    buttonsList[2].hidden = !authorized
  }

  if (authorized) {
    // User avatar
    const user_avatar = document.querySelector('#user_menu_button')
    if (user_avatar) {
      user_avatar.textContent = initials
      user_avatar.title = fullName
    }

    // Register
    const form_register = document.querySelector('#form_register')
    if (form_register) {
      const inputList = form_register.querySelectorAll('input')
      inputList[0].value = user.first_name
      inputList[1].value = user.last_name
      inputList[2].value = user.email
    }

    // Profile
    const modal_profile = document.querySelector('#modal_profile')
    if (modal_profile) {
      const avatar = modal_profile.querySelectorAll('.profile_avatar')[0]
      avatar.textContent = initials
      const profile_name = modal_profile.querySelectorAll('.profile_name')[0]
      profile_name.textContent = fullName

      setProfileStatistics(visits, score, books)

      const card_number = document.querySelector('#card_number')
      card_number.textContent = id
    }
  } else {
    // User avatar
    const user_avatar = document.querySelector('#user_menu_button')
    if (user_avatar) {
      user_avatar.innerHTML = '<img src="./assets/icons/union.svg" />'
      user_avatar.title = ''
    }
  }
}

export function setProfileStatistics(visits, score, books) {
  const statistics = document.querySelector('#profile_statistics')
  if (statistics) {
    statistics.innerHTML = profileStatistics(visits, score, books.length)
  }
  const rented_books = document.querySelector('#rented_books')
  if (rented_books) {
    rented_books.innerHTML = books.map(val => `<li>${val}</li>`).join('')
  }
}
