import got from 'got';
import { GateKeeper } from '../utils/hmac';
import { appConfig } from './appConfig';
import { getPrettyURLf } from './common';
import { XCloudSignature } from './constants';
import jwt from 'jsonwebtoken';

/**
 * Check user access key
 */
export const checkAccessKey = async (userId, accessKey, onError, onSuccess) => {
  const body = {
    accessKey,
  };
  const hashData = GateKeeper.sign(
    JSON.stringify(body),
    appConfig.payloadSecret
  );
  const url = getPrettyURLf('/actions/room/verify');
  const options = {
    method: 'POST',
    headers: {},
    json: body,
  };
  options.headers[XCloudSignature] = hashData;
  options.headers.uid = userId;
  console.log('Check access ...');
  console.log('Request Options: ', options);

  try {
    const response = await got(url, options);
    if (response && response.statusCode && response.statusCode === 200) {
      console.log('Authorized!');
      console.log('body: ', response.body);
      onSuccess(JSON.parse(response.body));
    }
  } catch (error) {
    console.log('error: ', error);
    onError(error);
  }
};

/**
 * Get token from cookie
 */
const getTokenFromCookie = (cookies) => {
  console.log('[INFO] Received cookie ', cookies);
  if (!cookies.he) {
    throw new Error('Cookie header is not appeared!');
  }
  if (!cookies.pa) {
    throw new Error('Cookie payload is not appeared!');
  }
  if (!cookies.si) {
    throw new Error('Cookie sign is not appeared!');
  }

  const token = `${cookies.he}.${cookies.pa}.${cookies.si}`;
  return token;
};

/**
 * Verify JWT from cookei
 */
export const verifyJWTFromCookei = (rawCookie) => {
  console.log('[INFO] Input verifyJWTFromCookei cookie to parse ');

  const token = getTokenFromCookie(rawCookie);
  return verifyJWT(token);
};

/**
 * Verify JWT
 */
export const verifyJWT = (token) => {
  console.log('[INFO] Token is ', token);
  const cert = appConfig.publicKey;
  const verifiedToken = jwt.verify(token, cert, {
    algorithms: ['RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512'],
  });
  console.log('[INFO] ', 'verifiedToken ', verifiedToken);
  return verifiedToken;
};
