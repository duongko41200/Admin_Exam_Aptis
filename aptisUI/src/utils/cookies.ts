const getClientCookieValue = (name: string) => {
  const cookieString = document.cookie
  const cookies = cookieString.split('; ')
  const cookiePair = cookies.find((row) => row.startsWith(name))

  if (cookiePair) {
    const cookieValue = cookiePair.split('=')[1]
    return cookieValue
  }

  return null
}

export { getClientCookieValue }
