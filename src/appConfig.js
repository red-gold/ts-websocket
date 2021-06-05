import { checkBase64Decode } from '../utils/common'
import isEmpty from 'validator/lib/isEmpty'

if (isEmpty(process.env.PUBLIC_KEY)) {
  throw Error('Public key is empty!')
}

export const appConfig = {
  payloadSecret: `${process.env.PAYLOAD_SECRET}`,
  originEnv: `${process.env.ORIGIN}`,
  gateway: process.env.GATEWAY || 'http://www.app.localhost:31112',
  baseRoute: process.env.BASE_ROUTE || '',
  publicKey: checkBase64Decode(process.env.PUBLIC_KEY),
  emailNotifyInterval: process.env.EMAIL_NOTIFY_INTERVAL || 10,
  fnUUID: process.env.FN_UUID || '5ecc1506-e857-4827-ad29-37d1ef5f9eec'
}
