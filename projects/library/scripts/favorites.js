import { books } from '../data/books.js'
import { opacityAnimate } from './animation.js'
import { Store } from '../utils/store.js'

const store = new Store()
let currentSeason = 'winter'

/**
 * Callback function for the checkbox element
 * @param {string} season 'winter' | 'spring' | 'summer' | 'autumn'
 */
export function setSeason(season = null) {
  const offer = document.querySelector('#offer')
  if (offer) {
    const booksList = offer.querySelectorAll('.book')
    if (season) currentSeason = season

    for (let i = 0; i <= 3; ++i) {
      const el = booksList[i]

      const setContent = () => {
        const title = el.querySelector('.book_title')
        title.textContent = books[currentSeason][i].title

        const author = el.querySelector('.book_author')
        author.textContent = 'By ' + books[currentSeason][i].author

        const description = el.querySelector('.book_description')
        description.textContent = books[currentSeason][i].description

        const cover = el.querySelector('.book_cover')
        cover.src = books[currentSeason][i].cover

        const bookString = `${books[currentSeason][i].title} By ${books[currentSeason][i].author}`
        checkBookBuyButton(el, bookString)
        if (season) opacityAnimate(el)
      }

      if (season) {
        const animation = opacityAnimate(el, true)
        animation.onfinish = setContent
      } else {
        setContent()
      }
    }
  }
}

export function checkAllBookBuyButtons() {
  const offer = document.querySelector('#offer')
  if (offer) {
    const booksList = offer.querySelectorAll('.book')

    for (let i = 0; i <= 3; ++i) {
      const el = booksList[i]
      const bookString = `${books[currentSeason][i].title} By ${books[currentSeason][i].author}`
      checkBookBuyButton(el, bookString)
      if (season) opacityAnimate(el)
    }
  }
}

export function checkBookBuyButton(el, bookString) {
  const button = el.querySelector('.small-button')
  if (button) {
    const { authorized, books } = store.get('profile')
    const own = books.some(n => n === bookString)

    button.classList.toggle('own', authorized && own)
    button.textContent = authorized && own ? 'Own' : 'Buy'
  }
}
