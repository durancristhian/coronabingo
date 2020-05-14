export function scrollToTop() {
  try {
    window.scroll({
      behavior: 'smooth',
      top: 0,
      left: 0,
    })
  } catch (e) {
    if (e instanceof TypeError) {
      window.scroll(0, 0)
    } else {
      console.error(e)
    }
  }
}
