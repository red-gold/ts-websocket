import { GateKeeper } from '../utils/hmac'
import { appConfig } from './appConfig'
import { XCloudSignature } from './constants'
import { reducer } from './reducer'
import { getUserByUID } from './store'

/**
 * Dispatch controller
 */
export const dispatchController = (io) => async (req, res) => {
  console.log('Start Dispatching!')
  const hash = req.header(XCloudSignature)
  if (!hash || (hash && hash === '')) {
    return res
      .status(400)
      .send({ code: 'HMACError', message: 'HMAC is not presented!' })
  }

  console.log('Dispatch - HMAC presented!')
  const room = req.params.room
  console.log('Dispatch - Room :', room)

  let isValidReq = false
  try {
    console.log(
      'Dispatch - Start Validaiton',
      ' - ',
      req.rawBody,
      ' - ',
      appConfig.payloadSecret,
      ' - ',
      hash
    )
    // Check action
    const action = JSON.parse(req.rawBody)
    reducer(action)

    isValidReq = await GateKeeper.validate(req.rawBody, appConfig.payloadSecret, hash)
  } catch (error) {
    console.log('Dispatch - HMAC Error: ', error)

    return res.status(400).send({ code: 'HMACError', message: error })
  }

  console.log('isValidReq: ', isValidReq)
  if (isValidReq) {
    const user = getUserByUID(room)
    if (user) {
      io.to(room).emit('dispatch', JSON.parse(req.rawBody))
      return res.status(200).send({ success: true })
    } else {
      return res
        .status(400)
        .send({ code: 'roomNotFundError', message: 'Room not found' })
    }
  }
  return res
    .status(400)
    .send({ code: 'HMACError', message: 'HMAC is not valid!' })
}

/**
   * Dispatch list controller
   */
export const dispatchListController = (io) => async (req, res) => {
  console.log('Start Dispatching list!')
  const hash = req.header(XCloudSignature)
  if (!hash || (hash && hash === '')) {
    return res
      .status(400)
      .send({ code: 'HMACError', message: 'HMAC is not presented!' })
  }

  console.log('Dispatch - HMAC presented!')
  const room = req.params.room
  console.log('Dispatch - Room :', room)

  let isValidReq = false
  try {
    console.log(
      'Dispatch - Start Validaiton',
      req.body,
      ' - ',
      req.rawBody,
      ' - ',
      appConfig.payloadSecret,
      ' - ',
      hash
    )
    isValidReq = await GateKeeper.validate(req.rawBody, appConfig.payloadSecret, hash)
  } catch (error) {
    console.log('Dispatch - HMAC Error: ', error)

    return res.status(400).send({ code: 'HMACError', message: error })
  }

  console.log('isValidReq: ', isValidReq)
  if (isValidReq) {
    const user = getUserByUID(room)
    if (user) {
      io.to(room).emit('dispatch-list', req.rawBody)
      return res.status(200).send({ success: true })
    } else {
      return res
        .status(400)
        .send({ code: 'roomNotFundError', message: 'Room not found' })
    }
  }
  return res
    .status(400)
    .send({ code: 'HMACError', message: 'HMAC is not valid!' })
}

/**
 * Ping controller
 */
export const pingController = (io) => (req, res) => {
  io.emit('dispatch', 'pong')

  return res.status(200).send({ success: true })
}
