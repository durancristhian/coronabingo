import fetch from 'isomorphic-unfetch'

export default async function fetcher(...args) {
  const res = await fetch(...args)
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.error)
  }

  return data
}
