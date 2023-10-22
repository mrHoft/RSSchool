// ## Static Import
// import movies from './data/movies.json' assert { type: 'json' }

// ## Dynamic Import
// const { default: movies } = await import('./data/movies.json', { assert: { type: 'json' } })

// ## Fetch
// fetch('./data/movies.json').then(response => response.json()).then(obj => console.log(obj))

const CARDS = 3
const apikey = 'fe125519'
const apiurl = `http://www.omdbapi.com/?apikey=${apikey}&`

const searching = request => `Searching for: "${request}"...`
const message = request => `Search results for "${request}": `

const title = document.querySelector('#title')
const results = document.querySelector('#results')
const total = document.querySelector('#total')
const search = document.querySelector('#search')

search.onsubmit = e => {
  if (e && e.target) {
    const data = new FormData(e.target)
    const request = data.get('request').toString()
    if (!request || request.trim() === 0) {
      return false
    }
    if (!request || request.trim() < 4) {
      title.innerText = message(request) + 'Found nothing.'
      return false
    }
    title.innerText = searching(request)
    performSearch(request)
  }

  return false
}

function performSearch(request) {
  fetch(`${apiurl}&s=${request.replace(' ', '+')}`)
    .then(response => response.json())
    .then(obj => {
      title.innerText = message(request)
      if (!obj) {
        const response = 'Search failed (code: 500)'
        title.innerText = response
        return new Error(response)
      }
      if (!obj.Response || obj.Response === 'False' || !obj.Search) {
        const response = obj.Error ?? 'Found nothing.'
        title.innerText = message(request) + response
        return new Error(response)
      }
      if (!obj.totalResults || obj.totalResults === '0') {
        const response = 'Found nothing.'
        title.innerText = message(request) + response
        return new Error(response)
      }
      total.innerText = `${CARDS} / ${obj.totalResults}`
      showResults(obj.Search, true)
    })
}

function getFeatured() {
  fetch('./data/movies.json')
    .then(response => response.json())
    .then(obj => showResults(obj))
}

function showResults(data, partial = false) {
  if (data && Array.isArray(data)) {
    results.innerHTML = ''
    for (let i = 0; i < Math.min(data.length, CARDS); i += 1) {
      const { card, director, rating } = getFilmCard(data[i])
      results.append(card)
      if (partial && data[i].imdbID) {
        getMovieInfo(data[i].imdbID, { card, director, rating })
      }
    }
  }
}

function getMovieInfo(imdbID, item) {
  item.director.innerText = 'Loading ...'
  fetch(`${apiurl}&i=${imdbID}`)
    .then(response => response.json())
    .then(obj => {
      if (!obj || !obj.Director || !obj.imdbRating || !obj.Plot) {
        const response = 'Film data foading failed (code: 500)'
        console.warn(response)
        return new Error(response)
      }
      item.director.innerText = `By ${obj.Director}`
      item.card.title = obj.Plot
      item.rating.innerText = obj.imdbRating
    })
}

/* Response format
type TFilmData = {
  Title: string,  // "Iron Man"
  Year: string, // "2008"
  imdbID: string, // "tt0371746",
  Type: "movie" | "series" | "episode",
  Poster: String, // url
  // Extended:
  Genre: string,  // "Action, Adventure, Comedy, Drama, Sci-Fi"
  Director: string, // "Ridley Scott"
  Actors: string,
  Plot: string,
  imdbRating: string, // "8.4"
}

interface response {
  totalResults: number
  Response: "True" | "False"
  Error?: string  // 'Movie not found!'
  Search: TFilmData[]
}
 */

const blankCard = {
  Title: '',
  Year: '',
  Poster: '',
  Director: '',
  Actors: '',
  Plot: '',
  imdbRating: '',
}

function getFilmCard(data) {
  const { Title, Year, Poster, Director, Actors, Plot, imdbRating } = { ...blankCard, ...data }

  const card = document.createElement('div')
  card.title = Plot
  card.classList.add('card')

  const poster = document.createElement('div')
  poster.classList.add('card__poster')
  poster.style.backgroundImage = `url(${Poster})`
  card.append(poster)

  const footer = document.createElement('div')
  footer.classList.add('card__footer')
  card.append(footer)

  const titleWrapper = document.createElement('div')
  titleWrapper.classList.add('card__title_wrapper')
  footer.append(titleWrapper)

  const title = document.createElement('p')
  title.classList.add('card__title')
  title.innerText = Title
  titleWrapper.append(title)

  const year = document.createElement('p')
  year.classList.add('card__year')
  year.innerText = Year
  titleWrapper.append(year)

  const director = document.createElement('p')
  director.classList.add('card__director')
  director.innerText = `By ${Director}`
  footer.append(director)

  const rating = document.createElement('div')
  rating.classList.add('card__rating')
  rating.innerText = imdbRating
  card.append(rating)

  return { card, poster, title, year, director, rating }
}

getFeatured()
