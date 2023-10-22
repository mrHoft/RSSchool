export class Carousel {
  static _instance = null
  static JUMP_SIZE = 1400
  galery = null
  arrow = {
    left: null,
    right: null,
  }
  carousel = null
  items = []
  current = 0
  itemsToShow = 3
  animation = {
    left: [{ transform: 'translateX(-100%)' }, { transform: 'translateX(0)' }],
    right: [{ transform: 'translateX(0)' }, { transform: 'translateX(calc(-100% - 1.25rem))' }],
  }
  dots = []
  active = false

  constructor() {
    if (Carousel._instance) return Carousel._instance
    this.galery = document.querySelector('#galery')
    if (this.galery) {
      this.arrow = { left: this.galery.firstElementChild, right: this.galery.lastElementChild }
      this.arrow.left.addEventListener('click', this.arrowEvent)
      this.arrow.right.addEventListener('click', this.arrowEvent)
      this.carousel = document.querySelector('#carousel')
      this.items = this.carousel.querySelectorAll('.item')
      this.dots = document.querySelector('#slider').querySelectorAll('.dot_button')
      this.dots.forEach((dot, i) => dot.addEventListener('click', event => this.dotEvent(event, i)))
      Carousel._instance = this
    }
  }

  setup() {
    const big = window.innerWidth > Carousel.JUMP_SIZE
    // console.log(`Corousel: ${big}  (${window.innerWidth})`)
    this.itemsToShow = big ? 3 : 1
    this.current = 0
    for (let i = 0; i < 5; ++i) {
      this.items[i].style.display = i < this.itemsToShow ? 'block' : 'none'
    }
    this.setControls(this.current)
  }

  slide(direction) {
    if (this.active) return

    const next = this.current + (direction === 'right' ? 1 : -1)
    const start = Math.min(this.current, next)
    const end = start + this.itemsToShow
    const itemToHide = direction === 'right' ? start : end

    const items = []
    for (let i = start; i <= end; ++i) items.push(i)

    this.active = true
    items.forEach(n => {
      this.items[n].style.display = 'block'
      const animation = this.items[n].animate(this.animation[direction], {
        duration: 500,
        direction: 'normal',
      })
      if (n === this.current) {
        animation.onfinish = event => {
          this.items[itemToHide].style.display = 'none'
          this.current = next
          this.active = false
        }
      }
    })

    this.setControls(next)
  }

  arrowEvent = event => {
    const el = event.target.tagName === 'DIV' ? event.target : event.target.parentNode
    const direction = el === this.arrow.left ? 'left' : 'right'
    if (this.arrow[direction].classList.contains('disabled')) return
    this.slide(direction)
  }

  dotEvent = (event, n) => {
    if (n === this.current) return
    const direction = n > this.current ? 'right' : 'left'
    this.slide(direction)
  }

  setControls(current) {
    this.arrow.left.classList.toggle('disabled', current === 0)
    this.arrow.right.classList.toggle('disabled', current === 4)
    this.dots.forEach((el, i) => el.classList.toggle('own', i === current))
  }
}
