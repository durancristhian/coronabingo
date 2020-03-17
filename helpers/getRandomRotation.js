function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function getRandomRotation() {
  return getRandomInt(0, 360)
}
