const apikey = 'MRRIQL3PPaXHpeGYl7lciUdrGnP65CaZrZrwakmYXzw'
const apiurl = `https://api.unsplash.com/photos/?client_id=${apikey}&page=1`
const searchurl = `https://api.unsplash.com/search/photos?client_id=${apikey}&page=1&query=`

const CARDS = 9

const results = document.querySelector('#results')
const total = document.querySelector('#total')
const search = document.querySelector('#search')
const clear = search.querySelector('.search__clear')

clear.onclick = () => {
  clear.previousElementSibling.value = ''
}

search.onsubmit = e => {
  if (e && e.target) {
    const data = new FormData(e.target)
    const request = data.get('request').toString()
    if (!request || request.trim() === 0) {
      return new Error('Search query can not be blank.')
    }
    if (!request || request.trim() < 4) {
      return new Error('Found nothing.')
    }
    performSearch(request)
  }

  return false
}

function performSearch(request) {
  fetch(`${searchurl}${request.replace(' ', '+')}`)
    .then(response => response.json())
    .then(obj => {
      if (!obj || obj.errors) {
        return new Error(obj.errors[0] ?? 'Search failed (code: 500)')
      }
      if (!obj.total || !obj.total === 0) {
        return new Error('Found nothing.')
      }
      showResults(obj.results)
    })
}

function getFeatured() {
  fetch(apiurl)
    .then(response => response.json())
    .then(obj => showResults(obj))
}

function showResults(data) {
  if (data && Array.isArray(data)) {
    results.innerHTML = ''
    for (let i = 0; i < Math.min(data.length, CARDS); i += 1) {
      const card = getCard(data[i])
      results.append(card)
    }
  }
}

function getCard(data) {
  const { updated_at, alt_description, user, urls } = data

  const card = document.createElement('div')
  card.title = alt_description
  card.style.backgroundImage = `url(${urls.small})`
  card.classList.add('card')

  const title = document.createElement('p')
  title.classList.add('card__name')
  title.innerText = `By ${user.name}`
  card.append(title)

  const year = document.createElement('p')
  year.classList.add('card__date')
  year.innerText = updated_at.slice(0, 4)
  card.append(year)

  return card
}

getFeatured()
