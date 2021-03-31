import { setChatRoomById } from './store'

export const reducer = (socket) => (action) => {
  switch (action.type) {
    case 'SET_ACTIVE_ROOM':
      setChatRoomById(newRoomId, {
        roomId: newRoomId,
        connections: { [data.reqUserId]: true, [uid]: true }
      })
      socket.join(newRoomId)
      break

    default:
      break
  }
}
