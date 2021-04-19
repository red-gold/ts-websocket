
export const appConfig = {
  payloadSecret: `${process.env.PAYLOAD_SECRET}`,
  originEnv: `${process.env.ORIGIN}`,
  gateway: process.env.GATEWAY || 'http://www.app.localhost:31112',
  baseRoute: process.env.BASE_ROUTE || '',
  publicKey: process.env.PUBLIC_KEY
}
