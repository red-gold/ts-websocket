const setUserOffline = (userId) => ({
    type: "SET_USER_OFFLINE",
    payload: {userId: userId}
})

const setChatRequest = (userId) => ({
    type: "ADD_CHAT_REQUEST",
    payload: {userId: userId}
})

const setAcceptChatRequest = (userId,roomId) => ({
    type: "SET_ACCEPT_CHAT_REQUEST",
    payload: {userId: userId, roomId: roomId}
})

const addChatConnect = (userId,room) => ({
    type: "ADD_CHAT_CONNECT",
    payload: {userId: userId, room: room}
})

const removeChatConnect = (userId) => ({
    type: "REMOVE_CHAT_CONNECT",
    payload: {userId: userId}
})

const showMessage = (message) => {
    return {
      type: "SHOW_MESSAGE_GLOBAL",
      payload: {message}
    }
  
  }
  
  module.exports = {
    setUserOffline,
    setChatRequest,
    setAcceptChatRequest,
    showMessage,
    addChatConnect,
    removeChatConnect
  }