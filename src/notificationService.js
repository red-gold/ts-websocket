// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { postHMAC } from './httpService'

/**
 * Check notify email queue
 * @param {string} uid User ID
 */
export const checkNotifyEmail = async (uid) => {
  const data = {
    url: '/notifications/check'
  }

  const result = await postHMAC('/notifications/check', data, { userId: uid })

  return JSON.parse(result)
}
