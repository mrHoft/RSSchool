const Marks = {
  error: '&#9888; ',
  valid: '&#x2714; ',
}

export const validate = {
  null: () => null,
  username: value => {
    if (value.length < 3) return 'Name is too short'
    if (!value.match(/^[A-Za-zА-Яа-яЁё0-9_]+$/)) return 'Name is incorrect'
    return null
  },
  get first_name() {
    return this.username
  },
  get last_name() {
    return this.username
  },
  nickname: value => {
    if (value.length < 3) return 'Name is too short'
    if (!value.match(/^[A-Za-zА-Яа-яЁё0-9_]+\s?[A-Za-zА-Яа-яЁё0-9_]+$/)) return 'Name is incorrect'
    return null
  },
  login: value => value.length >= 3 && value.match(/^[A-Za-z0-9_]+$/),
  email: value => {
    if (value.length < 6 || !value.match(/^[A-Za-z._\-[0-9]+[@][A-Za-z._\-[0-9]+[.][a-z]{2,4}$/)) return 'Wrong e-mail'
    return null
  },
  password: value => {
    if (value.length < 8) return 'Password is too short'
    if (!value.match(/^[A-Za-z\d_]+$/)) return 'Wrong symbols'
    if (!value.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_]{8,}$/)) return 'Password is too simple'
    return null
  },
  repeat: (v1, v2) => {
    if (v1 != v2) return 'Passwords do not match'
    return null
  },
  phone: value => {
    if (
      !value
        .replace(/\s+/g, '')
        .replace('(', '')
        .replace(')', '')
        .replace('+', '')
        .match(/^[0-9]{11}$/)
    )
      return 'Wrong phone number'
    return null
  },
}

function validateEmail(el) {
  if (!el) return 1
  const err_el = el.nextElementSibling
  const { value } = el
  if (!checkEmail(value)) {
    showMessage(err_el, Messages.email, 'red')
    return 1
  }
  showMessage(err_el, Marks.valid, 'green')
  return 0
}

function callback_validate(event) {
  event.stopPropagation()
  if (!event.target) return false
  const target = event.target
  if (target.name == '') return false
  console.log(target.name)
  switch (target.name) {
    case 'first_name':
      validateName(target)
      break
    default:
      console.log('Unexpected error')
  }
  return true
}
