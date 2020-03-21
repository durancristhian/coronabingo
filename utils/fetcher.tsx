import fetch from 'isomorphic-unfetch'

export default async function fetcher<T>(
  request: RequestInfo,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(request, options)
  try {
    const body = await response.json()

    return body
  } catch (error) {
    throw new Error(error)
  }
}
