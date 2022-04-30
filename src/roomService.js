import actions from './actions';
import { getChatRoomById, getUserByUID, setChatRoomById } from './store';
import { getUserProfile } from './userService';
import { v4 as uuidv4 } from 'uuid';
import { postHMAC, putHMAC } from './httpService';
import { queryMessage } from './messageService';

/**
 * Handle request-chat event
 * @param {*} io socketIO.Server
 * @param {*} socket socketIO.Socket
 * @param {*} uid User id
 * @returns event handler function
 */
const onRequestChat = (io, socket, uid) => (data) => {
  console.log('Request chat: ', data);
  // The person who should receive the request
  const recUser = getUserByUID(data.recUserId);
  if (!recUser) {
    console.log(
      'Dispatch offline person: ',
      actions.setUserOffline(data.recUserId)
    );

    io.to('user:' + uid).emit(
      'dispatch',
      actions.setUserOffline(data.recUserId)
    );
  } else {
    console.log('Dispatch Request chat: ', actions.setChatRequest(uid));

    socket.emit('dispatch', actions.setChatRequest(data.recUserId));
    getUserProfile(
      uid,
      (errorData) => {
        console.log('Error on getting user profile ', errorData);
      },
      (currentUser) => {
        io.to('user:' + data.recUserId).emit(
          'dispatch',
          actions.addUserInfo(uid, currentUser)
        );
        io.to('user:' + data.recUserId).emit(
          'dispatch',
          actions.setCallingUser(uid)
        );
      }
    );
  }
};

/**
 * Handle accept-chat event
 * @param {*} io socketIO.Server
 * @param {*} socket socketIO.Socket
 * @param {*} uid User id
 * @returns event handler function
 */
const onAcceptChat = (io, socket, uid) => (data) => {
  console.log('Accept chat: ', data);

  // The person whos request accepted
  const reqUser = getUserByUID(data.reqUserId);

  if (!reqUser) {
    io.to('user:' + uid).emit(
      'dispatch',
      actions.setUserOffline(data.reqUserId)
    );
  } else {
    const newRoomId = uuidv4();
    console.log('New chatroom: ', data);
    setChatRoomById(newRoomId, {
      roomId: newRoomId,
      connections: { [data.reqUserId]: true, [uid]: true },
    });
    socket.join(newRoomId);

    socket.emit('dispatch-list', [
      actions.removeChatCalling(data.reqUserId),
      actions.addChatConnect(data.reqUserId, { roomId: newRoomId }),
      actions.setCurrentChat(data.reqUserId),
    ]);

    // Send room id to the user who requested for chat to join the room by sending room id as a `join` event
    io.to('user:' + data.reqUserId).emit('dispatch-list', [
      actions.removeChatRequest(uid),
      actions.addChatConnect(uid, { roomId: newRoomId }),
      actions.asyncJoinChatRoom(newRoomId),
      actions.setCurrentChat(uid),
    ]);
  }
};

/**
 * Handle join-chat event
 * @param {*} io socketIO.Server
 * @param {*} socket socketIO.Socket
 * @param {*} uid User id
 * @returns event handler function
 */
const onJoinChat = (io, socket, uid) => (data) => {
  console.log('Join chat: ', data);

  // The person whos request accepted
  const chatRoom = getChatRoomById(data.roomId);
  if (chatRoom && chatRoom.connections[uid]) {
    socket.join(data.roomId);
  } else {
    io.to('user:' + uid).emit(
      'dispatch',
      actions.showMessage('Can not connect to room, due to wrong room id.')
    );
  }
};

/**
 * Handle cancel-chat event
 * @param {*} io socketIO.Server
 * @param {*} socket socketIO.Socket
 * @param {*} uid User id
 * @returns event handler function
 */
const onCancelChat = (io, socket, uid) => (data) => {
  console.log('Cancel chat: ', data);

  // The person who should receive the request
  const recUser = getUserByUID(data.recUserId);
  if (!recUser) {
    console.log(
      'Dispatch offline person: ',
      actions.setUserOffline(data.recUserId)
    );

    io.to('user:' + uid).emit(
      'dispatch',
      actions.setUserOffline(data.recUserId)
    );
  } else {
    socket.emit('dispatch', actions.removeChatRequest(data.recUserId));
    io.to('user:' + data.recUserId).emit(
      'dispatch',
      actions.removeChatCalling(uid)
    );
  }
};

/**
 * Handle ignore-chat event
 * @param {*} io socketIO.Server
 * @param {*} socket socketIO.Socket
 * @param {*} uid User id
 * @returns event handler function
 */
const onIgnoteChat = (io, socket, uid) => (data) => {
  console.log('Ignore chat: ', data);
  // The person who should receive the request
  const reqUser = getUserByUID(data.reqUserId);
  if (!reqUser) {
    console.log(
      'Dispatch offline person: ',
      actions.setUserOffline(data.reqUserId)
    );

    io.to('user:' + uid).emit(
      'dispatch',
      actions.setUserOffline(data.reqUserId)
    );
  } else {
    socket.emit('dispatch', actions.removeChatCalling(data.reqUserId));
    io.to('user:' + data.reqUserId).emit(
      'dispatch',
      actions.removeChatRequest(uid)
    );
  }
};

/**
 * Handle open-room event
 * @param {*} io socketIO.Server
 * @param {*} socket socketIO.Socket
 * @param {*} uid User id
 * @returns event handler function
 */
const onOpenRoom = (io, socket, uid) => async (data) => {
  const { roomId } = data;

  const canOpenRoom = socketBelongToRoom(io, socket.id, roomId);
  if (canOpenRoom) {
    const messages = await queryMessage(uid, roomId, 1, 0, 0);
    io.to('user:' + uid).emit(
      'dispatch',
      actions.addRoomMessages(messages, roomId)
    );
  } else {
    console.error(`User (${uid}) not belong to room ${roomId}`);
    io.to('user:' + uid).emit(
      'dispatch',
      actions.showMessage('Can not open room which not belong to user')
    );
  }
};

/**
 * Handle request-active-room event
 * @param {*} io socketIO.Server
 * @param {*} socket socketIO.Socket
 * @param {*} uid User id
 * @returns event handler function
 */
const onRequestActiveRoom = (io, socket, uid) => async (data) => {
  try {
    const result = await postHMAC('/vang/room/active', data, { userId: uid });
    const parsedResult = JSON.parse(result);
    const roomId = parsedResult.objectId;
    const members = parsedResult.members;

    let connections = {};
    const $memberSockets = [];
    members.forEach((memberId) => {
      $memberSockets.push(io.in('user:' + memberId).allSockets());
      connections = {
        ...connections,
        [memberId]: true,
      };
    });

    // Get all sockets of room members
    const memberSockets = await Promise.all($memberSockets);

    let connectedSocketIds = [];
    memberSockets.forEach((socketIds) => {
      connectedSocketIds = [...connectedSocketIds, ...socketIds];
    });

    // Join members seckets to the room
    const sockets = io.sockets.sockets;
    connectedSocketIds.forEach((id) => {
      const userSocket = sockets.get(id);
      if (userSocket) {
        userSocket.join('room:' + roomId);
      }
    });

    // Join user to the room
    setChatRoomById(roomId, {
      roomId: roomId,
      connections,
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 * Handle WebSocket events
 */
export const roomWSEventHandlers = [
  {
    key: 'request-chat',
    value: onRequestChat,
  },
  {
    key: 'accept-chat',
    value: onAcceptChat,
  },
  {
    key: 'join-chat',
    value: onJoinChat,
  },
  {
    key: 'cancel-chat',
    value: onCancelChat,
  },
  {
    key: 'ignore-chat',
    value: onIgnoteChat,
  },
  {
    key: 'open-room',
    value: onOpenRoom,
  },
  {
    key: 'request-active-room',
    value: onRequestActiveRoom,
  },
];

/**
 * Get rooms by user ID
 */
export const getRoomsByUserId = async (userId) => {
  const data = {
    userId,
  };
  const result = await postHMAC('/vang/rooms', data, { userId });
  return JSON.parse(result);
};

/**
 * Update read message
 */
export const updateReadMessage = async (
  userId,
  roomId,
  amount,
  messageCreatedDate,
  messageId
) => {
  const data = {
    roomId,
    amount,
    messageCreatedDate,
    messageId,
  };
  const result = await putHMAC('/vang/read', data, { userId });
  return JSON.parse(result);
};

/**
 * Whether user belong to the room
 */
export const socketBelongToRoom = (io, scoketId, roomId) => {
  const sockets = io.sockets.adapter.rooms.get('room:' + roomId);
  return sockets && sockets.has(scoketId);
};
