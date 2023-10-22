import { validate } from '../utils/validation.js'
import { generateId } from '../utils/generate.js'
import { Store } from '../utils/store.js'
import { fillCardInfo, fillProfileData } from './profileData.js'
import { defaultProfileData } from '../data/profile.js'
import { profileStatistics } from '../conponents/statistics.js'
import { setProfileStatistics } from './profileData.js'
import { checkAllBookBuyButtons, checkBookBuyButton } from './favorites.js'
import { showMessage } from '../utils/message.js'

const store = new Store()

function isValid(data) {
  const messages = []
  for (const key in data) {
    const mess = validate[key](data[key])
    if (mess) messages.push(mess)
  }
  if (messages.length) alert(messages.join('\n'))
  return messages.length === 0
}

function handleEvent(event) {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  const el = event?.target
  if (!el) throw new Error('Something went wrong: submitted form was not found.')
  return el
}

export function formRegisterBlur() {
  if (this.name && validate[this.name]) {
    const mess = validate[this.name](this.value)
    if (mess) showMessage(this, document.querySelector('#form_register').parentNode, mess)
  }
}

export function formRegisterSubmit(event, modal) {
  const el = handleEvent(event)

  const form = new FormData(el)
  const data = {
    first_name: String(form.get('first_name')),
    last_name: String(form.get('last_name')),
    email: String(form.get('email')),
    password: String(form.get('password')),
  }

  if (isValid(data)) {
    const id = generateId()
    store.set('profile', { ...defaultProfileData, user: data, id, authorized: true })
    if (modal) modal.style.display = 'none'
    fillProfileData()
  }
}

export function formLoginSubmit(event, modal) {
  const el = handleEvent(event)

  const form = new FormData(el)
  const data = {
    email: String(form.get('email')),
    password: String(form.get('password')),
  }

  const { email, password } = store.get('profile.user')
  const id = store.get('profile.id')
  if ((data.email === email || data.email === id) && data.password === password) {
    const visits = store.get('profile.visits') || 0
    store.set('profile.visits', visits + 1)
    store.set('profile.authorized', true)
    if (modal) modal.style.display = 'none'
    fillProfileData()
    checkAllBookBuyButtons()
  } else {
    showMessage(el.children[1], el.parentNode, 'E-mail or password is wrong')
  }
}

export function logOut() {
  store.set('profile.authorized', false)
  fillProfileData()
  checkAllBookBuyButtons()
  console.log('Logged out')
}

export function clipboardCopy() {
  const id = store.get('profile.id')
  navigator.clipboard.writeText(id)
  console.log('Copyed to clipboard:', id)
}

export function checkCard(event) {
  const el = handleEvent(event)

  const form = new FormData(el)
  const user_name = form.get('user_name').trim(),
    card_id = form.get('card_id').trim()

  const { user, id, visits, score, books } = { ...defaultProfileData, ...store.get('profile') }
  const { first_name, last_name } = user

  const card_info = el.querySelector('#card_info')
  if (card_info) {
    const checkCardButton = () => (card_info.innerHTML = `<button type="submit">Check the card</button>`)

    const message = []
    if (card_id === id) message.push(`Reader's name: ${first_name} ${last_name}`)
    if (user_name === `${first_name} ${last_name}`) message.push(`Card number: ${id}`)
    if (!message.length) {
      card_info.textContent = 'Found nothing'
      setTimeout(checkCardButton, 3000)
    } else {
      console.log(message.join(', '))
      if (message.length === 2) {
        card_info.innerHTML = profileStatistics(visits, score, books.length)
        setTimeout(() => {
          checkCardButton()
          const inputList = el.querySelectorAll('input')
          inputList.forEach(el => (el.value = ''))
        }, 10000)
      }
    }
  }
}

const validateCard = {
  valid: (value, length) => {
    const res = Number(value.replaceAll(' ', ''))
    return res != NaN && res.toString().length >= length
  },
  card: function (value) {
    return this.valid(value, 16) ? null : 'Card number must be 16 number length'
  },
  month: function (value) {
    return this.valid(value, 2) ? null : 'Expiration date is incorrect'
  },
  year: function (value) {
    return this.valid(value, 2) ? null : 'Expiration date is incorrect'
  },
  cvc: function (value) {
    return this.valid(value, 3) ? null : 'CVC is incorrect'
  },
}

export function formBuyCardChanged(event, el) {
  if (event.target && event.target.name && validateCard[event.target.name]) {
    const message = validateCard[event.target.name](event.target.value)
    if (message) showMessage(event.target, el, message)
  }
  const form = new FormData(el)
  const valid = [...form.values()].every(value => value.length)
  el.querySelector('button[type="submit"]').disabled = !valid
}

export function formBuyCard(event, modal) {
  const el = handleEvent(event)

  const form = new FormData(el)
  const data = [...form.entries()].reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {})
  new Array('card', 'month', 'year', 'cvc', 'post').forEach(key => (data[key] = Number(data[key].replaceAll(' ', ''))))

  if (data.card === NaN || data.card.toString().length < 16) alert('Card number must be 16 number length')
  else if (data.month === NaN || data.month.toString().length < 2) alert('Expiration date is incorrect')
  else if (data.year === NaN || data.year.toString().length < 2) alert('Expiration date is incorrect')
  else if (data.cvc === NaN || data.cvc.toString().length < 3) alert('CVC is incorrect')
  else {
    // Success
    if (modal) modal.style.display = 'none'
    store.set('profile.have_card', true)
  }
}

export function bookBuy(el) {
  if (el.querySelector('.small-button').classList.contains('own')) return

  const title = el.querySelector('.book_title').textContent
  const author = el.querySelector('.book_author').textContent
  const bookString = `${title} ${author}`

  const { authorized, have_card, visits, score, books } = { ...defaultProfileData, ...store.get('profile') }
  if (!authorized) {
    document.getElementById('modal_login').style.display = 'flex'
    return
  }
  if (!have_card) {
    document.getElementById('modal_buy_card').style.display = 'flex'
    return
  }
  console.log(bookString)
  const booksNew = [...new Set([...books, bookString])]
  store.set('profile.books', booksNew)
  setProfileStatistics(visits, score, booksNew)
  checkBookBuyButton(el, bookString)
  fillCardInfo()
}
