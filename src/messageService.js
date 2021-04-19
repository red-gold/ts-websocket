
import { postHMAC } from './httpService'
import actions from './actions'
import { socketBelongToRoom, updateReadMessage } from './roomService'

/**
 * Handle chatroom-message event
 * @param {*} io socketIO.Server
 * @param {*} socket socketIO.Socket
 * @param {*} uid User id
 * @returns event handler function
 */
const onChatRoomMessage = (io, socket, uid) => async (data) => {
  const { text, roomId } = data

  // Check if current socket belong to target room
  const canSendMessage = socketBelongToRoom(io, socket.id, roomId)

  if (canSendMessage) {
    const message = {
      objectId: data.objectId,
      ownerUserId: uid,
      roomId,
      text
    }

    const payload = {
      messages: [message],
      userId: uid,
      roomId
    }

    // Save messages in DB
    await postHMAC('/vang/messages', payload, { userId: uid })
    const now = new Date().getTime()
    message.createdDate = now
    message.updateDate = now
    message.loading = false

    io.to('room:' + roomId).emit(
      'dispatch',
      actions.addRoomNewMessages([message], roomId)
    )
  } else {
    console.error(`[ERROR] User (${uid}) not belong to room (${roomId}) can not send message!`)
    io.to(uid).emit(
      'dispatch',
      actions.showMessage('Can not connect to room, due to wrong room id.'))
  }
}

/**
 * Handle query-room-messages event
 * @param {*} io socketIO.Server
 * @param {*} socket socketIO.Socket
 * @param {*} uid User id
 * @returns event handler function
 */
const onQueryRoomMessages = (io, socket, uid) => async (data) => {
  const { requestId, roomId, page, lte, gte } = data

  // Check if current socket belong to target room
  const canQueryMessage = socketBelongToRoom(io, socket.id, roomId)

  if (canQueryMessage) {
    // Query messages
    try {
      const messages = await queryMessage(uid, roomId, page, lte, gte)
      io.to('user:' + uid).emit(
        'dispatch',
        actions.addRoomMessages(messages, roomId, requestId)
      )
    } catch (error) {
      console.error('[ERROR] Query message ', error)
      io.to(uid).emit(
        'dispatch',
        actions.showMessage('Query message error!'))
      io.to(uid).emit(
        'dispatch',
        actions.errorRequest(requestId, 'messageService/onQueryRoomMessages', error.message))
    }
  } else {
    console.error(`[ERROR] User (${uid}) not belong to room (${roomId}) can not send message!`)
    io.to(uid).emit(
      'dispatch',
      actions.showMessage('Can not connect to room, due to wrong room id.'))
  }
}

/**
 * Handle read-message-meta event
 * @param {*} io socketIO.Server
 * @param {*} socket socketIO.Socket
 * @param {*} uid User id
 * @returns event handler function
 */
const onReadMessageMeta = (io, socket, uid) => async (data) => {
  const { roomId, messageId, readCount, messageCreatedDate } = data

  // Check if current socket belong to target room
  const canQueryMessage = socketBelongToRoom(io, socket.id, roomId)

  if (canQueryMessage) {
    // Update read message meta on room
    await updateReadMessage(uid, roomId, readCount, messageCreatedDate, messageId)
  } else {
    console.error(`[ERROR] User (${uid}) not belong to room (${roomId}) can not send message!`)
    io.to(uid).emit(
      'dispatch',
      actions.showMessage('Can not connect to room, due to wrong room id.'))
  }
}

/**
 * Handle WebSocket events
 */
export const messageWSEventHandlers = [
  {
    key: 'chatroom-message',
    value: onChatRoomMessage
  },
  {
    key: 'query-room-messages',
    value: onQueryRoomMessages
  },
  {
    key: 'read-message-meta',
    value: onReadMessageMeta
  }
]

/**
 * Query message
 * @param {string} uid User ID
 * @param {string} page page number
 * @param {string} roomId page number
 * @param {number} lte Less/equal createdDate
 */
export const queryMessage = async (uid, roomId, page, lte, gte) => {
  const data = {
    reqUserId: uid,
    roomId,
    page,
    lte,
    gte

  }
  // Query messages in DB
  const result = await postHMAC('/vang/message/query', data, { userId: uid })

  return JSON.parse(result)
}
