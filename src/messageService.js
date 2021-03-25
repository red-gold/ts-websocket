import actions from './actions'
import { getChatRoomById } from './store'

/**
 * Handle chatroom-message event
 * @param {*} io socketIO.Server
 * @param {*} socket socketIO.Socket
 * @param {*} uid User id
 * @returns event handler function
 */
const onChatRoomMessage = (io, socket, uid) => (data) => {
  console.log('Send chat message: ', data)

  // The person whos request accepted
  const message = data.message
  const chatRoomId = message.chatRoomId
  const chatRoom = getChatRoomById(chatRoomId)
  if (chatRoom && chatRoom.connections[uid]) {
    io.to(chatRoomId).emit(
      'dispatch',
      actions.addPlainChatRoomMessages([message], chatRoomId)
    )
  } else {
    io.to(uid).emit(
      'dispatch',
      actions.showMessage('Can not connect to room, due to wrong room id.')
    )
  }
}

/**
   * Handle WebSocket events
   */
export const messageWSEventHandlers = [
  {
    key: 'hatroom-message',
    value: onChatRoomMessage
  }
]
