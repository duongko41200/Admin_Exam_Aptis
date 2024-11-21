const API_KEY =
  "2ec64e0705db689b64489975fcd06ca3249725dccac9a4d428c930a4a6d140af55fa0f09ea96f3e333a98f8efb68bed963f818a16e58e0d6584b163fa8a52924";
const HEADERS = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY,
  'x-client-id': localStorage.getItem('userId') as string,
  authorization: localStorage.getItem('accessToken') as string
}

export { HEADERS }
