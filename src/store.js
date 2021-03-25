// States
const chatRooms = {}
const users = {}

/**
 * Get room by id
 * @param {string} roomId Room id
 * @returns Room
 */
export const getChatRoomById = (roomId) => {
  return chatRooms[roomId]
}

/**
 * Set room by id
 * @param {string} roomId Room id
 * @param {*} data Room information
 * @returns void
 */
export const setChatRoomById = (roomId, data) => {
  chatRooms[roomId] = data
}

/**
 * Get user by id
 * @param {string} uid User id
 * @returns User
 */
export const getUserByUID = (uid) => {
  return users[uid]
}

/**
 * Set user by id
 * @param {string} uid User id
 * @param {*} data User information
 * @returns void
 */
export const setUserByUID = (uid, data) => {
  users[uid] = data
}
