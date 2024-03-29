import got from 'got';
import { GateKeeper } from '../utils/hmac';
import { appConfig } from './appConfig';
import { getPrettyURLf } from './common';
import { XCloudSignature } from './constants';

/**
 *  Post request with HMAC
 * @param {string} url Request URL
 * @param {*} json Request payload
 * @param {*} userInfo User information for request
 * @returns response body
 */
export const postHMAC = (url, json, userInfo) => {
  return callAPIWithHMAC('POST', url, json, userInfo);
};

/**
 *  Put request with HMAC
 * @param {string} url Request URL
 * @param {*} json Request payload
 * @param {*} userInfo User information for request
 * @returns response body
 */
export const putHMAC = (url, json, userInfo) => {
  return callAPIWithHMAC('PUT', url, json, userInfo);
};

/**
 * Call api with HMAC header
 * @param {import('got').Method} method HTTP method
 * @param {string} url Request URL
 * @param {*} json Request payload
 * @param {*} userInfo User information for request
 * @returns response body
 */
const callAPIWithHMAC = async (method, url, json, userInfo) => {
  const hashData = GateKeeper.sign(
    JSON.stringify(json),
    appConfig.payloadSecret
  );
  const uri = getPrettyURLf(url);
  console.log(
    '[INFO][HTTP CALL] callAPIWithHMAC: ',
    'Method: ' + method,
    'URL: ' + url,
    'Payload: ' + json,
    'User Info: ' + userInfo,
    'URI: ' + uri
  );
  const options = {
    headers: { origin: 'https://social.telar.dev' },
    json,
    method,
  };
  options.headers[XCloudSignature] = hashData;
  options.headers.uid = userInfo.userId;

  const response = await got(uri, options);
  if (response && response.statusCode && response.statusCode === 200) {
    console.log('body: ', response.body);
    return response.body;
  } else {
    throw new Error('Status code is not OK => ' + response.statusCode);
  }
};
