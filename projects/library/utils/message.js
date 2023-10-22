/**
 * Show message under the given element.
 * And removes when element get focus.
 * @param {HTMLElement} element
 * @param {HTMLElement} parent
 * @param {string} text
 */
export function showMessage(element, parent, text, color = 'red') {
  const message = document.createElement('div')
  const coords1 = parent.getBoundingClientRect()
  const coords2 = element.getBoundingClientRect()
  const x = coords2.left - coords1.left
  const y = coords2.top - coords1.top + coords2.height
  message.style.cssText = `position:absolute; left:${x}px; top: ${y}px; font-size: 0.5rem; color:${color};`
  message.textContent = text
  parent.append(message)

  function callback() {
    this.removeEventListener('focus', callback, true)
    message.remove()
  }

  element.addEventListener('focus', callback, true)
}

function getCoords(elem) {
  const box = elem.getBoundingClientRect()

  return {
    top: box.top + window.scrollY,
    right: box.right + window.scrollX,
    bottom: box.bottom + window.scrollY,
    left: box.left + window.scrollX,
  }
}
