export function isThereLocalStorageSupport() {
  const mod = 'coronabingo'

  try {
    localStorage.setItem(mod, mod)
    localStorage.removeItem(mod)

    return true
  } catch (e) {
    return false
  }
}
