const theme = ['drozd', 'forest', 'javoronok', 'slavka', 'solovey', 'zarynka']
let current = 'forest'
let isPlay = false

// Theme selector
const nav = document.querySelector('nav')
const selectors = nav.querySelectorAll('li')

function setTheme() {
  audioSrc = `./assets/audio/${current}.mp3`
  imageSrc = `./assets/img/${current}.jpg`
  audio.src = audioSrc
  main.style.backgroundImage = `url(${imageSrc})`
}

function select(event) {
  event.stopPropagation()
  const el = event.target
  current = el.dataset.theme
  for (const selector of selectors) {
    selector.classList.toggle('active', selector.dataset.theme === current)
  }
  setTheme()
  playAudio(true)
}

for (const selector of selectors) {
  selector.addEventListener('click', select)
}

// Player
const main = document.querySelector('main')
const audio = main.querySelector('audio')
const play = main.querySelector('button')

function switchAudio() {
  isPlay = !isPlay
  playAudio()
}

play.addEventListener('click', switchAudio)

function playAudio(force) {
  if (force) isPlay = true

  play.classList.toggle('play', !isPlay)
  play.classList.toggle('pause', isPlay)

  if (isPlay) {
    audio.currentTime = 0
    audio.play()
  } else {
    audio.pause()
  }
}

// Parallax
document.addEventListener('mousemove', parallax)
window.onresize = setSize

function setSize() {
  const ar = 0.5625
  let w, h
  if (window.innerWidth > window.innerHeight) {
    w = window.innerWidth * 1.25
    h = w * ar
  } else {
    h = window.innerHeight * 1.25
    w = h / ar
  }
  main.style.backgroundSize = `${w}px ${h}px`
}

function parallax(event) {
  const _w = window.innerWidth / 2
  const _h = window.innerHeight / 2
  const mouseX = event.clientX
  const mouseY = event.clientY
  const depth = `${50 - (mouseX - _w) * 0.0075}% ${50 - (mouseY - _h) * 0.0075}%`
  main.style.backgroundPosition = depth
}

setSize()
setTheme()
