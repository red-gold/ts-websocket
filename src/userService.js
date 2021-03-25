import got from 'got'
import { GateKeeper } from '../utils/hmac'
import { appConfig } from './appConfig'
import { XCloudSignature } from './constants'
import { getPrettyURLf } from './common'

/**
 * Get user profile
 */
export const getUserProfile = (userId, onError, onSuccess) => {
  const hashData = GateKeeper.sign('', appConfig.payloadSecret)
  const url = getPrettyURLf(`/profile/id/${userId}`)
  const options = {
    method: 'GET',
    headers: {}
  }
  options.headers[XCloudSignature] = hashData
  options.headers.uid = userId
  console.log('Get User Profile...')
  console.log('Request Options: ', options);

  (async () => {
    try {
      const response = await got(url, options)
      if (response && response.statusCode && response.statusCode === 200) {
        console.log('Authorized!')
        console.log('body: ', response.body)
        onSuccess(JSON.parse(response.body))
      }
    } catch (error) {
      console.log('error: ', error)
      onError(error)
    }
  })()
}
