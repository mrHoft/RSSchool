export function modalClose(event) {
  const target = event?.target
  if (target) {
    const modal_inner = target.querySelector('.modal_inner')
    if (modal_inner) {
      if (!modal_inner.contains(target)) target.style.display = 'none'
    }
  }
}
