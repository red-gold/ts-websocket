import { Server } from 'socket.io';
import actions from './actions';
import { verifyJWTFromCookei } from './authService';
import { messageWSEventHandlers } from './messageService';
import { getRoomsByUserId, roomWSEventHandlers } from './roomService';
import cookie from 'cookie-parse';
import { updateLastSeen } from './userService';

/**
 * Initialize WebSocket
 */
export const initWebSocket = async (server, origin) => {
  const io = new Server(server, {
    cookie: true,
    cors: {
      origin,
      credentials: true,
    },
  });
  io.use(async function (socket, next) {
    const handshakeData = socket.request;
    // Verify token from cookie
    console.log('[INFO] Verify token from cookie');
    try {
      let cookies = {};
      if (handshakeData.headers.cookie) {
        cookies = cookie.parse(handshakeData.headers.cookie);
      } else {
        const rawCookies = handshakeData.headers['set-cookie'];
        cookies = rawCookies
          .map((cookie) => cookie.split('; ')[0])
          .reduce((prev, current) => {
            const [name, ...value] = current.split('=');
            prev[name] = value.join('=');
            return prev;
          }, {});
      }
      console.log('[INFO] Cookies: ', JSON.stringify(cookies));
      const { claim } = verifyJWTFromCookei(cookies);
      console.log('[INFO] Cookie is verified for ', claim.uid);
      socket.uid = claim.uid;
      next();
    } catch (error) {
      next(error);
    }
  });

  /**
   * On connection
   */
  io.on('connection', async (socket) => {
    console.log('[INFO] ', 'Client connected ', socket.uid);

    const { uid } = socket;

    // Join socket to target user
    socket.join('user:' + uid);

    // Merge event handlers
    const wsEventHandlers = [...roomWSEventHandlers, ...messageWSEventHandlers];

    // Register all event handlers
    wsEventHandlers.forEach((handler) => {
      socket.on(handler.key, handler.value(io, socket, uid));
    });

    // TODO: Get user rooms from API if this is the first connection
    try {
      const sockets = io.sockets.adapter.rooms.get('user:' + uid);
      const { rooms, roomIds } = await getRoomsByUserId(uid);
      socket.emit('dispatch', actions.setRoomEntities(rooms));
      if (sockets.size === 1) {
        roomIds.forEach((roomId) => {
          socket.join('room:' + roomId);
          io.to('room:' + roomId).emit(
            'dispatch',
            actions.updateLastSeenUser(roomId, uid, 1)
          );
        });
      } else if (sockets.size > 1) {
        roomIds.forEach((roomId) => {
          socket.join('room:' + roomId);
        });
      }
    } catch (error) {
      console.log('[ERROR] on preparing rooms to join ', error);
    }

    // On disconnecting
    socket.on('disconnecting', handleDisconnecting(io, socket, uid));

    // On disconnect
    socket.on('disconnect', handleDisconnect(io, socket, uid));

    // Update last seen
    await updateLastSeen(uid);
  });

  setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
  return io;
};

/**
 * Handle socket disconnect
 * @param {*} socket User socket
 * @param {*} uid User ID
 */
const handleDisconnecting = (io, socket, uid) => async () => {
  const sockets = io.sockets.adapter.rooms.get('user:' + uid);
  if (sockets.size === 1) {
    console.log('[INFO] User is going to offline ');
    const parsedRooms = Array.from(socket.rooms);
    const chatRooms = parsedRooms.filter((room) => room.startsWith('room:'));
    chatRooms.forEach((room) => {
      io.to(room).emit(
        'dispatch',
        actions.updateLastSeenUser(room.slice(5), uid, new Date().getTime())
      );
    });
  }
};

/**
 * Handle socket disconnect
 * @param {*} socket User socket
 * @param {*} uid User ID
 */
const handleDisconnect = (io, socket, uid) => async () => {
  /**
   * Join socket to target user
   */
  socket.leave('user:' + uid);

  await updateLastSeen(uid);
};
