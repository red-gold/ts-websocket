import SocketIO from 'socket.io'
import { checkAccessKey, verifyJWTFromCookei } from './authService'
import { messageWSEventHandlers } from './messageService'
import { roomWSEventHandlers } from './roomService'
import { getUserByUID, setUserByUID } from './store'

/**
 * Initialize WebSocket
 */
export const initWebSocket = async (server) => {
  const io = SocketIO(server)
  io.use(async function (socket, next) {
    const handshakeData = socket.request
    const accessKey = handshakeData._query.accessKey
    const uid = handshakeData._query.uid
    console.log('middleware: ', accessKey, 'uid: ', uid)

    // Check if user already verified
    const user = getUserByUID(uid)
    if (user && user.verified) {
      console.log('user is verified: ', uid)
      if (!user.connections[socket.id]) {
        console.log('user is not in connection: ', uid)

        // TODO: Check access key with server
        await checkAccessKey(
          uid,
          accessKey,
          (errorData) => {
            // socket.disconnect(true)
          },
          (data) => {
            console.log('user is verified join to room: ', uid)

            socket.join(uid)
            next()
          }
        )
      } else {
        next()
      }
    } else {
      // TODO: Check access key with server
      await checkAccessKey(
        uid,
        accessKey,
        (errorData) => {
          setUserByUID(uid, { verified: false })
          next()
        },
        (data) => {
          console.log('First access accepted.', data)
          const user = getUserByUID(uid)
          if (
            !user ||
            (user && user.connections && !user.connections[socket.id])
          ) {
            console.log('user is not verified join to room: ', uid)
          }
          if (!data.isVerified) {
            setUserByUID(uid, { verified: false })
            next()
            return
          }
          socket.join(uid)
          setUserByUID(uid, {
            verified: true,
            connections: { [socket.id]: true }
          })
          next()
        }
      )
    }
  })

  /**
   * On connection
   */
  io.on('connection', (socket) => {
    console.log('Client connected')
    // TODO: verify cookie
    const { claim } = verifyJWTFromCookei(socket.handshake.headers.cookie)
    console.log('userClaim: ', claim)
    const { uid } = claim
    const user = getUserByUID(uid)

    console.log('uid: ', uid, 'user: ', user)
    if (!user || (user && !user.verified)) {
      socket.emit('dispatch', 'not authorized..')
      socket.disconnect(true)
    }

    // Add event handlers
    const wsEventHandlers = [...roomWSEventHandlers, ...messageWSEventHandlers]

    wsEventHandlers.forEach((handler) => {
      socket.on(handler.key, handler.value(io, socket, uid))
    })

    /**
     * On disconnect
     */
    socket.on('disconnect', () => {
      const user = getUserByUID(uid)
      if (user.connections) {
        const conKeys = Object.keys(user.connections)

        let newCons = {}
        let newConCounter = 0
        conKeys.forEach((key) => {
          if (key !== socket.id) {
            ++newConCounter
            newCons = { ...newCons, [key]: true }
          }
        })

        if (newConCounter > 0) {
          user.connections = { ...newCons }
        } else {
          setUserByUID(uid, { verified: false })
        }
      }
    })
  })

  setInterval(() => io.emit('time', new Date().toTimeString()), 1000)
  return io
}
