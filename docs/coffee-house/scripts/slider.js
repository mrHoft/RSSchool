let favorites, inputList, dotList
let current = 0
let startX = 0
const DELTA = 50

function clickButtonHandler(event) {
  if (event && event.target) {
    // console.log(event.currentTarget.dataset.direction)
    slide(event.currentTarget.dataset.direction === 'right' ? 1 : -1)
  }
}

function keyEventHandler(event) {
  if (event.code === 'ArrowRight') slide(1)
  if (event.code === 'ArrowLeft') slide(-1)
}

function hoverHandler() {
  dotList[current].children[0].style.animationPlayState = 'paused'
}

function leaveHandler() {
  dotList[current].children[0].style.removeProperty('animation-play-state')
}

function slide(dir = 1) {
  current += dir
  if (current < 0) current = 2
  if (current > 2) current = 0
  inputList[current].checked = true
  animateDot()
}

function animateDot() {
  dotList.forEach((el, i) => {
    el.classList.toggle('active', i === current)
    el.children[0].style.removeProperty('animation-play-state')
  })
}

function animationEndHandler(event) {
  slide()
}

function mouseDownHandler(event) {
  event.preventDefault()
  dotList[current].children[0].style.animationPlayState = 'paused'
  startX = event.offsetX
}

function mouseUpHandler(event) {
  dotList[current].children[0].style.removeProperty('animation-play-state')
  const dx = startX - event.offsetX
  if (Math.abs(dx) > DELTA) slide(dx / Math.abs(dx))
}

function touchStartHandler(event) {
  event.preventDefault()
  const touchObj = event.changedTouches[0]
  dotList[current].children[0].style.animationPlayState = 'paused'
  startX = touchObj.pageX
}

function touchEndHandler(event) {
  const touchObj = event.changedTouches[0]
  dotList[current].children[0].style.removeProperty('animation-play-state')
  const dx = startX - touchObj.pageX
  if (Math.abs(dx) > DELTA) slide(dx / Math.abs(dx))
}

document.addEventListener('readystatechange', event => {
  setTimeout(() => {
    if (document.readyState === 'complete') {
      document.addEventListener('keyup', keyEventHandler)
      favorites = document.getElementById('favorite-coffee')
      const slider = favorites.querySelector('.slider')
      slider.addEventListener('mousedown', mouseDownHandler)
      slider.addEventListener('mouseup', mouseUpHandler)
      slider.addEventListener('touchstart', touchStartHandler)
      slider.addEventListener('touchend', touchEndHandler)
      slider.addEventListener('mouseenter', hoverHandler, false)
      slider.addEventListener('mouseleave', leaveHandler, false)
      const buttonList = favorites.querySelectorAll('.slider__side')
      buttonList.forEach(el => {
        el.addEventListener('click', clickButtonHandler)
      })
      inputList = favorites.querySelectorAll('input[name="slider"]')
      dotList = favorites.querySelectorAll('.dot')
      dotList.forEach(el => {
        el.addEventListener('animationend', animationEndHandler)
      })
      animateDot()
    }
  }, 100)
})
