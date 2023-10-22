const opacityAnimation = [{ opacity: 0 }, { opacity: 1 }]

/**
 * Makes fade animation
 * @param {HTMLElement} elem HTMLElement
 */
export const opacityAnimate = (elem, reverse = false) => {
  if (elem && !elem.hidden) {
    elem.getAnimations().forEach(animation => animation.cancel())
    return elem.animate(opacityAnimation, {
      duration: 300,
      direction: reverse ? 'reverse' : 'normal',
    })
  }
}
