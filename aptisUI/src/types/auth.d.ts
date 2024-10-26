export interface CreateTokenPayload {
  userId: number
  email: string
}

export interface KeyStore {
  refreshTokensUsed: string[]
  refreshToken: string
  publicKey: string
  privateKey: string
  _id: number
}
