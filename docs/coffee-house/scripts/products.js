import { Device } from '../utils/device.js'
import productsJson from '../data/products.json' assert { type: 'json' }

const device = new Device({ callback: fillItems })
let currentTab = 'coffee'
let multItems = 1

const products = {
  coffee: productsJson.filter(data => data.category === 'coffee'),
  tea: productsJson.filter(data => data.category === 'tea'),
  dessert: productsJson.filter(data => data.category === 'dessert'),
}

function tabChangeHandler(event) {
  const { target: el } = event
  if (el) {
    currentTab = el.value
    multItems = 1
    fillItems(el.value)
  }
}

function LoadMoreHandler() {
  multItems += 1
  fillItems()
}

function modalClickHandler(event) {
  if (event && event.target === event.currentTarget) {
    modalToggle(event.target)
  }
}

function getItemsCount(total) {
  const maxItems = device.type() === 'desktop' ? 4 + 4 * multItems : 4 * multItems
  return Math.min(total, maxItems)
}

function refreshButtonShow(show) {
  const loadMore = document.querySelector('.button__load_more')
  loadMore.classList.toggle('hidden', !show)
}

function fillItems(tab = currentTab) {
  const offer = document.querySelector('#offer__list')
  const data = products[tab] || []
  const maxItems = device.type() === 'desktop' ? 8 : 4
  const totalItems = getItemsCount(data.length)
  refreshButtonShow(totalItems < data.length)

  offer.innerHTML = ''
  for (let i = 0; i < totalItems; i += 1) {
    const item = document.createElement('div')
    item.classList.add('offer__item')
    item.addEventListener('click', () => productOpen(i))

    const img = document.createElement('div')
    img.style.backgroundImage = `url(../assets/${tab}-${i + 1}.jpg)`
    item.appendChild(img)

    const info = document.createElement('div')
    const title = document.createElement('div')
    title.className = 'offer__item_title'

    const name = document.createElement('h3')
    name.innerHTML = data[i].name
    title.appendChild(name)

    const desc = document.createElement('p')
    desc.innerHTML = data[i].description
    title.appendChild(desc)

    info.appendChild(title)

    const price = document.createElement('h3')
    price.innerHTML = `$${data[i].price}`
    info.appendChild(price)

    item.appendChild(info)
    offer.appendChild(item)
  }
}

function productOpen(item) {
  const modalProduct = document.getElementById('modal__product')
  const data = products[currentTab][item] || []
  modalToggle(modalProduct)
  // console.log(data)

  const total = { price: Number(data.price), size: Number(data.sizes.s['add-price']) }

  const img = modalProduct.querySelector('.modal__img')
  img.style.backgroundImage = `url(../assets/${currentTab}-${item + 1}.jpg)`

  const name = modalProduct.querySelector('#modal__name')
  name.textContent = data.name

  const desc = modalProduct.querySelector('#modal__desc')
  desc.textContent = data.description

  const price = modalProduct.querySelector('#modal__total')
  price.textContent = data.price

  function changeTotal() {
    // console.log(total)
    const summ = Object.values(total).reduce((acc, val) => (acc += val), 0)
    const [d, c] = summ.toString().split('.')
    price.textContent = '$' + [d, `${c || '0'}0`.slice(0, 2)].join('.')
  }

  function changeSize(event) {
    if (event && event.target) {
      total.size = Number(event.target.value)
      changeTotal()
    }
  }

  const sizes = modalProduct.querySelector('#modal__desc_tabs_size')
  const sizeIndex = ['s', 'm', 'l']
  sizes.querySelectorAll('label').forEach((el, i) => {
    const values = data.sizes[sizeIndex[i]]
    el.querySelector('span:nth-child(2)').textContent = values.size
    el.title = values['add-price']
    const input = sizes.querySelector(`#tab_size${i + 1}`)
    input.value = values['add-price']
    input.addEventListener('change', changeSize)
    // console.log(input)
  })
  sizes.querySelector('#tab_size1').checked = true

  function changeAdd(event) {
    if (event && event.target) {
      const name = event.target.id.slice(4)
      total[name] = event.target.checked ? Number(event.target.value) : 0
      changeTotal()
    }
  }

  const additives = modalProduct.querySelector('#modal__desc_tabs_add')
  additives.querySelectorAll('label').forEach((el, i) => {
    const values = data.additives[i]
    el.querySelector('span:nth-child(2)').textContent = values.name
    el.title = values['add-price']
    const input = additives.querySelector(`#tab_add${i + 1}`)
    input.value = values['add-price']
    input.checked = false
    input.addEventListener('change', changeAdd)
    // console.log(input)
  })

  changeTotal()
}

document.addEventListener('readystatechange', event => {
  setTimeout(() => {
    if (document.readyState === 'complete') {
      const selectors = document.querySelectorAll('input[name="tab"]')
      for (const el of selectors) el.addEventListener('change', tabChangeHandler)

      const loadMore = document.querySelector('.button__load_more')
      loadMore.addEventListener('click', LoadMoreHandler)

      const modalProduct = document.getElementById('modal__product')
      modalProduct.addEventListener('click', modalClickHandler)

      fillItems()
    }
  }, 100)
})
