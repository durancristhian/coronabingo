export default function scrollToTop() {
  try {
    window.scroll({
      behavior: 'smooth',
      top: 0,
      left: 0,
    })
  } catch (err) {
    if (err instanceof TypeError) {
      window.scroll(0, 0)
    } else {
      console.error(err)
    }
  }
}
