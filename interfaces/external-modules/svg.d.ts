// The webpack rule in next.config.js resolves imported SVGs to their URL.
declare module '*.svg' {
  const src: string
  export default src
}
