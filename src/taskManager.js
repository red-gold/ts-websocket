// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { checkNotifyEmail } from './notificationService'

const cron = require('node-cron')
const { appConfig } = require('./appConfig')

export const runEmailNotifyTask = () => {
  const emailNotifyExpression = `*/${appConfig.emailNotifyInterval} * * * *`
  console.log('[INFO] Run email notify task with time expression ', `*/${appConfig.emailNotifyInterval} * * * *`)

  cron.schedule(emailNotifyExpression, () => checkNotifyEmail(appConfig.fnUUID))
}
