const API_KEY =
  '4379e3b406e606110a01e8fbe364120fdc58be39a9f30431476dd53ad14b20fe66f52423a3e4546dfa272f4c389822299709414bb44b6b3ffce7f04292be2556'
const HEADERS = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY,
  'x-client-id': localStorage.getItem('userId') as string,
  authorization: localStorage.getItem('accessToken') as string
}

export { HEADERS }
