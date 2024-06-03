function modalToggle(element) {
  element.classList.toggle('active')
  scrollLock(element)
}

const isVisible = element => !!element && !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length)

function scrollLock(element) {
  if (isVisible(element)) {
    document.body.style.overflow = 'hidden'
    document.body.style.scrollbarGutter = 'stable'
    // disableScroll()
  } else {
    document.body.style.removeProperty('overflow')
    document.body.style.removeProperty('scrollbarGutter')
    // enableScroll()
  }
}

function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false) // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt) // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt) // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false)
  window.addEventListener('scroll', onScroll, false) // ruge hack
}

function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false)
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt)
  window.removeEventListener('touchmove', preventDefault, wheelOpt)
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false)
  window.removeEventListener('scroll', onScroll, false)
}

const preventDefault = e => e.preventDefault()

function preventDefaultForScrollKeys(event) {
  // left: 37, up: 38, right: 39, down: 40, spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
  const keys = [37, 38, 39, 40, 33, 34, 35, 36]
  if (keys.includes(event.keyCode)) {
    console.log(event.keyCode)
    event.preventDefault()
    return false
  }
}

// modern Chrome requires { passive: false } when adding event
let supportsPassive = false
try {
  window.addEventListener(
    'test',
    null,
    Object.defineProperty({}, 'passive', {
      get: function () {
        supportsPassive = true
      },
    })
  )
} catch (e) {}

const wheelOpt = supportsPassive ? { passive: false } : false
const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel'

function onScroll() {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
}
