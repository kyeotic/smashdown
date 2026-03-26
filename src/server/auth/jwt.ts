import { createRemoteJWKSet, jwtVerify } from 'jose'

export function createJwtVerifier(domain: string, audience: string) {
  const JWKS = createRemoteJWKSet(new URL(`https://${domain}/.well-known/jwks.json`))
  return async (authHeader: string) => {
    const token = authHeader.replace(/^Bearer /i, '')
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://${domain}/`,
      audience,
    })
    return payload
  }
}
