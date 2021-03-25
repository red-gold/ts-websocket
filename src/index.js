import { GateKeeper } from '../utils/hmac'

const request = require('request')
const { v4: uuidv4 } = require('uuid')
const express = require('express')
const socketIO = require('socket.io')
const cookieParser = require('cookie-parser')()
const Actions = require('./actions')
const { getUserByUID, setUserByUID, setChatRoomById, getChatRoomById } = require('./store')

// Environment Variables
const appConfig = {
  payloadSecret: `${process.env.PAYLOAD_SECRET}`,
  originEnv: `${process.env.ORIGIN}`,
  gateway: process.env.GATEWAY || 'http://www.app.localhost:31112',
  baseRoute: process.env.BASE_ROUTE || ''
}
console.log('Payload Secret: ', appConfig.payloadSecret)
const XCloudSignature = 'X-Cloud-Signature'

function getPrettyURLf (url) {
  return `${appConfig.gateway}${appConfig.baseRoute}${url}`
}

// *************************
// Initialize express server
// *************************
const PORT = process.env.PORT || 3001

const app = express()
if (appConfig.originEnv && appConfig.originEnv.length > 0) {
  const cors = require('cors')
  const whitelist = appConfig.originEnv.split(',').map((url) => url.trim())
  console.log('Origin whitelist: ', whitelist)

  const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        console.error('Origin is not defined! ', origin)
        callback(new Error('Not allowed by CORS'))
      }
    }
  }
  app.use(cors(corsOptions))
} else {
  console.error('Origin is not defined!')
}
app.disable('x-powered-by')

app.use(function (req, res, next) {
  console.log('Rquest origin URL: ', req.originalUrl)
  res.header('Access-Control-Allow-Origin', '*')
  // res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json'
  )
  next()
})
app.use(cookieParser)
app.use(function (req, res, next) {
  let data = ''
  req.setEncoding('utf8')
  req.on('data', function (chunk) {
    data += chunk
  })

  req.on('end', function () {
    req.rawBody = data
    next()
  })
})

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`))

// *************************
// Initialize websocket
// *************************

const io = socketIO(server)
io.use(function (socket, next) {
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
      checkAccessKey(
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
    checkAccessKey(
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
          (user &&
            user.connections &&
            !user.connections[socket.id])
        ) {
          console.log('user is not verified join to room: ', uid)
        }
        if (!data.isVerified) {
          setUserByUID(uid, { verified: false })
          next()
          return
        }
        socket.join(uid)
        setUserByUID(uid, { verified: true, connections: { [socket.id]: true } })
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
  const uid = socket.handshake.query.uid
  const user = getUserByUID(uid)

  console.log('uid: ', uid, 'user: ', user)
  if (!user || (user && !user.verified)) {
    socket.emit('dispatch', 'not authorized..')
    socket.disconnect(true)
  }

  /**
   * On request chat
   */
  socket.on('request-chat', (data) => {
    console.log('Request chat: ', data)
    // The person who should receive the request
    const recUser = getUserByUID(data.recUserId)
    if (!recUser) {
      console.log(
        'Dispatch offline person: ',
        Actions.setUserOffline(data.recUserId)
      )

      io.to(uid).emit('dispatch', Actions.setUserOffline(data.recUserId))
    } else {
      console.log('Dispatch Request chat: ', Actions.setChatRequest(uid))

      socket.emit('dispatch', Actions.setChatRequest(data.recUserId))
      getUserProfile(
        uid,
        (errorData) => {
          console.log('Error on getting user profile ', errorData)
        },
        (currentUser) => {
          io.to(data.recUserId).emit(
            'dispatch',
            Actions.addUserInfo(uid, currentUser)
          )
          io.to(data.recUserId).emit('dispatch', Actions.setCallingUser(uid))
        }
      )
    }
  })

  /**
   * On accept chat
   */
  socket.on('accept-chat', (data) => {
    console.log('Accept chat: ', data)

    // The person whos request accepted
    const reqUser = getUserByUID(data.reqUserId)

    if (!reqUser) {
      io.to(uid).emit('dispatch', Actions.setUserOffline(data.reqUserId))
    } else {
      const newRoomId = uuidv4()
      console.log('New chatroom: ', data)
      setChatRoomById(newRoomId, {
        roomId: newRoomId,
        connections: { [data.reqUserId]: true, [uid]: true }
      })
      socket.join(newRoomId)

      socket.emit('dispatch-list', [
        Actions.removeChatCalling(data.reqUserId),
        Actions.addChatConnect(data.reqUserId, { roomId: newRoomId }),
        Actions.setCurrentChat(data.reqUserId)
      ])

      // Send room id to the user who requested for chat to join the room by sending room id as a `join` event
      io.to(data.reqUserId).emit('dispatch-list', [
        Actions.removeChatRequest(uid),
        Actions.addChatConnect(uid, { roomId: newRoomId }),
        Actions.asyncJoinChatRoom(newRoomId),
        Actions.setCurrentChat(uid)
      ])
    }
  })

  socket.on('join-chat', (data) => {
    console.log('Join chat: ', data)

    // The person whos request accepted
    const chatRoom = getChatRoomById(data.roomId)
    if (chatRoom && chatRoom.connections[uid]) {
      socket.join(data.roomId)
    } else {
      io.to(uid).emit(
        'dispatch',
        Actions.showMessage('Can not connect to room, due to wrong room id.')
      )
    }
  })

  socket.on('chatroom-message', (data) => {
    console.log('Send chat message: ', data)

    // The person whos request accepted
    const message = data.message
    const chatRoomId = message.chatRoomId
    const chatRoom = getChatRoomById(chatRoomId)
    if (chatRoom && chatRoom.connections[uid]) {
      io.to(chatRoomId).emit(
        'dispatch',
        Actions.addPlainChatRoomMessages([message], chatRoomId)
      )
    } else {
      io.to(uid).emit(
        'dispatch',
        Actions.showMessage('Can not connect to room, due to wrong room id.')
      )
    }
  })

  socket.on('cancel-chat', (data) => {
    console.log('Cancel chat: ', data)

    // The person who should receive the request
    const recUser = getUserByUID(data.recUserId)
    if (!recUser) {
      console.log(
        'Dispatch offline person: ',
        Actions.setUserOffline(data.recUserId)
      )

      io.to(uid).emit('dispatch', Actions.setUserOffline(data.recUserId))
    } else {
      socket.emit('dispatch', Actions.removeChatRequest(data.recUserId))
      io.to(data.recUserId).emit('dispatch', Actions.removeChatCalling(uid))
    }
  })

  socket.on('ignore-chat', (data) => {
    console.log('Ignore chat: ', data)
    // The person who should receive the request
    const reqUser = getUserByUID(data.reqUserId)
    if (!reqUser) {
      console.log(
        'Dispatch offline person: ',
        Actions.setUserOffline(data.reqUserId)
      )

      io.to(uid).emit('dispatch', Actions.setUserOffline(data.reqUserId))
    } else {
      socket.emit('dispatch', Actions.removeChatCalling(data.reqUserId))
      io.to(data.reqUserId).emit('dispatch', Actions.removeChatRequest(uid))
    }
  })

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

// *************************
// Http Requests
// *************************

/**
 * Check user access key
 */
function checkAccessKey (userId, accessKey, onError, onSuccess) {
  const hashData = GateKeeper.sign('', appConfig.payloadSecret)
  const url = getPrettyURLf(`/actions/room/verify/${accessKey}`)
  const options = {
    uri: url,
    method: 'GET',
    headers: {}
  }
  options.headers[XCloudSignature] = hashData
  options.headers.uid = userId
  console.log('Check access ...')
  console.log('Request Options: ', options)

  request(options, function (error, response, body) {
    console.log('Error: ', error)
    console.log('Body: ', body)

    if (error) {
      console.log('Error!')

      console.log('error: ', error)
      onError(error)
    } else if (response && response.statusCode && response.statusCode === 200) {
      console.log('Authorized!')
      console.log('body: ', body)
      onSuccess(JSON.parse(body))
    }
  })
}

/**
 * Get user profile
 */
function getUserProfile (userId, onError, onSuccess) {
  const hashData = GateKeeper.sign('', appConfig.payloadSecret)
  const url = getPrettyURLf(`/profile/id/${userId}`)
  const options = {
    uri: url,
    method: 'GET',
    headers: {}
  }
  options.headers[XCloudSignature] = hashData
  options.headers.uid = userId
  console.log('Get User Profile...')
  console.log('Request Options: ', options)

  request(options, function (error, response, body) {
    console.log('Response: ')
    console.log('Status: ', response.statusCode)
    console.log('Body: ', body)

    if (error) {
      console.log('error: ', error)
      onError(error)
    } else if (response && response.statusCode && response.statusCode === 200) {
      console.log('body: ', body)
      onSuccess(JSON.parse(body))
    }
  })
}

// *************************
// Controllers
// *************************

/**
 * Ping controller
 */
const ping = (req, res) => {
  io.emit('dispatch', 'pong')

  return res.status(200).send({ success: true })
}

/**
 * Dispatch controller
 */
const dispatch = async (req, res) => {
  console.log('Start Dispatching!')
  const hash = req.header(XCloudSignature)
  if (!hash || (hash && hash === '')) {
    return res
      .status(400)
      .send({ code: 'HMACError', message: 'HMAC is not presented!' })
  }

  console.log('Dispatch - HMAC presented!')
  const room = req.params.room
  console.log('Dispatch - Room :', room)

  let isValidReq = false
  try {
    console.log(
      'Dispatch - Start Validaiton',
      req.body,
      ' - ',
      req.rawBody,
      ' - ',
      appConfig.payloadSecret,
      ' - ',
      hash
    )
    isValidReq = await GateKeeper.validate(req.rawBody, appConfig.payloadSecret, hash)
  } catch (error) {
    console.log('Dispatch - HMAC Error: ', error)

    return res.status(400).send({ code: 'HMACError', message: error })
  }

  console.log('isValidReq: ', isValidReq)
  if (isValidReq) {
    const user = getUserByUID(room)
    if (user) {
      io.to(room).emit('dispatch', JSON.parse(req.rawBody))
      return res.status(200).send({ success: true })
    } else {
      return res
        .status(400)
        .send({ code: 'roomNotFundError', message: 'Room not found' })
    }
  }
  return res
    .status(400)
    .send({ code: 'HMACError', message: 'HMAC is not valid!' })
}

/**
 * Dispatch list controller
 */
const dispatchList = async (req, res) => {
  console.log('Start Dispatching!')
  const hash = req.header(XCloudSignature)
  if (!hash || (hash && hash === '')) {
    return res
      .status(400)
      .send({ code: 'HMACError', message: 'HMAC is not presented!' })
  }

  console.log('Dispatch - HMAC presented!')
  const room = req.params.room
  console.log('Dispatch - Room :', room)

  let isValidReq = false
  try {
    console.log(
      'Dispatch - Start Validaiton',
      req.body,
      ' - ',
      req.rawBody,
      ' - ',
      appConfig.payloadSecret,
      ' - ',
      hash
    )
    isValidReq = await GateKeeper.validate(req.rawBody, appConfig.payloadSecret, hash)
  } catch (error) {
    console.log('Dispatch - HMAC Error: ', error)

    return res.status(400).send({ code: 'HMACError', message: error })
  }

  console.log('isValidReq: ', isValidReq)
  if (isValidReq) {
    const user = getUserByUID(room)
    if (user) {
      io.to(room).emit('dispatch-list', req.rawBody)
      return res.status(200).send({ success: true })
    } else {
      return res
        .status(400)
        .send({ code: 'roomNotFundError', message: 'Room not found' })
    }
  }
  return res
    .status(400)
    .send({ code: 'HMACError', message: 'HMAC is not valid!' })
}

// *************************
// Routing
// *************************
// app.get('/', home)

app.get('/ping', ping)

app.post('/api/dispatch/:room', dispatch)
app.post('/api/dispatch-list/:room', dispatchList)
