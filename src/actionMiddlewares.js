import { getUserStatus } from './userService'
import { OnlineStatus } from './constants'
export const actionMiddlewares = (io, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_ROOM':
      action = setActiveRoom(io, action)
      break
    case 'SET_USER_ENTITIES':
      action = setUserEntities(io, action)
      break

    default:
      break
  }
  return action
}

/**
 * Set active room middleware
 */
const setActiveRoom = (io, action) => {
  const { payload } = action
  const { room, users } = payload
  const { members } = room

  members.forEach((userId) => {
    const userStatus = getUserStatus(io, userId)
    if (userStatus === OnlineStatus) {
      users[userId].lastSeen = 1
    }
  })
  return action
}

/**
 * Set user entities
 */
const setUserEntities = (io, action) => {
  const { payload } = action
  const { users } = payload

  Object.keys(users).forEach((userId) => {
    const userStatus = getUserStatus(io, userId)
    if (userStatus === OnlineStatus) {
      users[userId].lastSeen = 1
    }
  })
  return action
}
