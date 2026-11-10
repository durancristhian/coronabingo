async function isolateBrowserNetwork(context, { baseURL, firestorePort }) {
  const hostedFirebase = []
  const allowed = new Set([baseURL, `http://127.0.0.1:${firestorePort}`])
  await context.route('**/*', route => {
    const url = new URL(route.request().url())
    if (allowed.has(url.origin)) return route.continue()
    if (
      /googleapis\.com$|firebaseio\.com$|firebaseapp\.com$/.test(url.hostname)
    ) {
      hostedFirebase.push(url.hostname)
    }
    return route.abort('blockedbyclient')
  })
  await context.routeWebSocket(/.*/, socket => {
    if (new URL(socket.url()).origin === baseURL.replace('http:', 'ws:')) {
      socket.connectToServer()
    } else socket.close()
  })
  return hostedFirebase
}

module.exports = { isolateBrowserNetwork }
