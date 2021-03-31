
import { postHMAC } from './httpService'

/**
 * Handle chatroom-message event
 * @param {*} io socketIO.Server
 * @param {*} socket socketIO.Socket
 * @param {*} uid User id
 * @returns event handler function
 */
const onChatRoomMessage = (io, socket, uid) => async (data) => {
  console.log('Send chat message: ', data)

  // The person whos request accepted
  const text = data.text
  const roomId = data.roomId

  const message = {
    objectId: data.objectId,
    ownerUserId: uid,
    roomId,
    text
  }
  await postHMAC('/vang/messages', [message], { userId: uid })
  // const chatRoom = getChatRoomById(roomId)
  // if (chatRoom && chatRoom.connections[uid]) {
  //   io.to(roomId).emit(
  //     'dispatch',
  //     actions.addPlainChatRoomMessages([message], roomId)
  //   )
  // } else {
  //   io.to(uid).emit(
  //     'dispatch',
  //     actions.showMessage('Can not connect to room, due to wrong room id.')
  //   )
  // }
}

/**
   * Handle WebSocket events
   */
export const messageWSEventHandlers = [
  {
    key: 'chatroom-message',
    value: onChatRoomMessage
  }
]
