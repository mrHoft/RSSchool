/**
 * Utility that can be used to catch outside click events
 * @param element HTMLElement that must be hidden
 * @param callback function that makes nessesary operations
 */
export default function hideOnClickOutside(element, callback) {
  const outsideClickListener = event => {
    const target = event.target
    if (target && !element.contains(target)) {
      removeClickListener()
      if (isVisible(element)) {
        event.stopPropagation()
        callback()
      }
    }
  }

  const removeClickListener = () => {
    document.removeEventListener('click', outsideClickListener)
  }

  document.addEventListener('click', outsideClickListener)
}

// Idea taken from: https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js
export const isVisible = element => !!element && !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length)
