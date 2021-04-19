const setUserOffline = (userId) => ({
  type: 'SET_USER_OFFLINE',
  payload: { userId: userId }
})

const setChatRequest = (userId) => ({
  type: 'ADD_CHAT_REQUEST',
  payload: { userId: userId }
})

const setCallingUser = (userId) => ({
  type: 'ADD_CHAT_CALLING',
  payload: { userId: userId }
})

const asyncAcceptChatRequest = (userId, roomId) => ({
  type: 'ASYNC_ACCEPT_CHAT_REQUEST',
  payload: { userId: userId, roomId: roomId }
})

const asyncJoinChatRoom = (roomId) => ({
  type: 'ASYNC_JOIN_CHAT_ROOM',
  payload: { roomId: roomId }
})

const addChatConnect = (userId, room) => ({
  type: 'ADD_CHAT_CONNECT',
  payload: { userId: userId, room: room }
})

const removeChatConnect = (userId) => ({
  type: 'REMOVE_CHAT_CONNECT',
  payload: { userId: userId }
})

/**
 * Add user information
 */
const addUserInfo = (uid, info) => {
  return {
    type: 'ADD_PLAIN_USER_INFO',
    payload: { uid: uid, info: info }
  }
}

/**
 * Set current chat
 */
const setCurrentChat = (userId) => {
  return {
    type: 'SET_CURRENT_CHAT', payload: { userId }
  }
}

/**
 * Remove chat request
 */
const removeChatRequest = (userId) => {
  return {
    type: 'REMOVE_CHAT_REQUEST', payload: { userId: userId }
  }
}

/**
 * Add plain chat messages
 */
const addRoomMessages = (messages, roomId, requestId) => {
  return {
    type: 'SG_ADD_ROOM_MESSAGES', payload: { messages, roomId, requestId }
  }
}

/**
 * Add new chat messages
 */
const addRoomNewMessages = (messages, roomId) => {
  return {
    type: 'SG_ADD_ROOM_NEW_MESSAGES', payload: { messages, roomId }
  }
}

/**
 * Remove chat calling
 */
const removeChatCalling = (userId) => {
  return {
    type: 'REMOVE_CHAT_CALLING', payload: { userId: userId }
  }
}

const showMessage = (message) => {
  return {
    type: 'SHOW_MESSAGE_GLOBAL',
    payload: { message }
  }
}

const errorRequest = (requestId, code, message) => {
  return {
    type: 'ERROR_REQUEST',
    payload: { id: requestId, error: { code, message } }
  }
}

export default {
  setUserOffline,
  setChatRequest,
  asyncAcceptChatRequest,
  asyncJoinChatRoom,
  setCallingUser,
  setCurrentChat,
  addUserInfo,
  showMessage,
  addChatConnect,
  removeChatConnect,
  removeChatRequest,
  removeChatCalling,
  addRoomMessages,
  addRoomNewMessages,
  errorRequest
}
