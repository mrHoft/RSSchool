function burgerToggle() {
  const burger = document.querySelector('.button__burger')
  const active = burger.classList.contains('active')
  const nav = document.querySelector('nav')

  function animationEndHandler(event) {
    burger.classList.remove('active')
    event.target.classList.remove('active', 'show', 'hide')
    event.target.removeEventListener('animationend', animationEndHandler)
  }

  function clickHandler(event) {
    if (event.target !== event.currentTarget) {
      nav.removeEventListener('click', clickHandler)
      document.body.style.removeProperty('overflow')
      document.body.style.removeProperty('scrollbarGutter')
      burgerToggle()
    }
  }

  if (!active) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.body.style.overflow = 'hidden'
    document.body.style.scrollbarGutter = 'stable'

    burger.classList.add('active')
    nav.classList.remove('hide')
    nav.classList.add('active', 'show')

    nav.addEventListener('click', clickHandler)
    nav.removeEventListener('animationend', animationEndHandler)
  } else {
    document.body.style.removeProperty('overflow')
    document.body.style.removeProperty('scrollbarGutter')

    nav.classList.remove('show')
    nav.classList.add('active', 'hide')

    nav.removeEventListener('click', clickHandler)
    nav.addEventListener('animationend', animationEndHandler)
  }
}
