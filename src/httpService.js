import got from 'got'
import { GateKeeper } from '../utils/hmac'
import { appConfig } from './appConfig'
import { getPrettyURLf } from './common'
import { XCloudSignature } from './constants'

/**
 *  Post request with HMAC
 * @param {string} url Request URL
 * @param {*} body Request payload
 * @param {*} userInfo User information for request
 * @returns response body
 */
export const postHMAC = async (url, body, userInfo) => {
  const hashData = GateKeeper.sign(JSON.stringify(body), appConfig.payloadSecret)
  const uri = getPrettyURLf(url)
  const options = {
    headers: {},
    json: body
  }
  options.headers[XCloudSignature] = hashData
  options.headers.uid = userInfo.userId

  try {
    const response = await got.post(uri, options)
    if (response && response.statusCode && response.statusCode === 200) {
      console.log('body: ', response.body)
      return response.body
    } else {
      throw new Error('Status code is not OK => ', response.statusCode)
    }
  } catch (error) {
    console.log('error: ', error)
    throw error
  }
}
