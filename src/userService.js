import got from 'got';
import { GateKeeper } from '../utils/hmac';
import { appConfig } from './appConfig';
import { XCloudSignature, OnlineStatus, OfflineStatus } from './constants';
import { getPrettyURLf } from './common';
import { putHMAC } from './httpService';

/**
 * Get user profile
 */
export const getUserProfile = (userId, onError, onSuccess) => {
  const hashData = GateKeeper.sign('', appConfig.payloadSecret);
  const url = getPrettyURLf(`/profile/id/${userId}`);
  const options = {
    method: 'GET',
    headers: {},
  };
  options.headers[XCloudSignature] = hashData;
  options.headers.uid = userId;
  console.log('Get User Profile...');
  console.log('Request Options: ', options);

  (async () => {
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
  })();
};

/**
 * Update user last seen
 */
export const updateLastSeen = (userId) => {
  return putHMAC(
    '/profile/last-seen',
    {
      userId,
    },
    {
      userId,
    }
  );
};

/**
 * Get user status
 */
export const getUserStatus = (io, userId) => {
  const sockets = io.sockets.adapter.rooms.get('user:' + userId);
  if (sockets) {
    return OnlineStatus;
  }
  return OfflineStatus;
};
