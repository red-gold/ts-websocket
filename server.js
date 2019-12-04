'use strict';

const request = require('request')
const uuidv4 = require('uuid/v4')
const path = require('path');
const express = require('express')
const socketIO = require('socket.io')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')()
const GateKeeper = require('./utils/hmac')
const Actions = require('./actions')

// States
const chatRooms = {}
const users = {}

// Environment Variables
// const adminAccessKey = process.env.ADMIN_ACCESS_KEY
// const actionAccessKey = process.env.ACTION_ACCESS_KEY
// const gateway = process.env.GATEWAY
// const prettyURL = process.env.PRETTY_URL
// const getActionRoomAPI = process.env.GET_ACTION_ROOM_API
// const payloadSecret = process.env.PAYLOAD_SECRET
const adminAccessKey = process.env.ADMIN_ACCESS_KEY
const actionAccessKey = process.env.ACTION_ACCESS_KEY
const prettyURL = process.env.PRETTY_URL
const gateway = "http://localhost:31112"
const getActionRoomAPI = process.env.GET_ACTION_ROOM_API
const payloadSecret = '70bc03d019a6250e5731655e8d2528c68dd27318'

const X_Cloud_Signature = "X-Cloud-Signature"


function getPrettyURLf(url) {
  if (prettyURL) {
    return `${gateway}/${url}`
  }
  return `${gateway}/function/${url}`
}

// *************************
// Initialize express server
// *************************
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const app = express()
const cors = require('cors')({ origin: true })
app.disable('x-powered-by')
app.use(cors)
app.use(cookieParser)
const rawBodySaver = function (req, res, buf, encoding) {

  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
}

app.use(bodyParser.json({ verify: rawBodySaver }));

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

// *************************
// Initialize websocket
// *************************

const io = socketIO(server);
io.use(function (socket, next) {
  var handshakeData = socket.request;
  const accessKey = handshakeData._query['accessKey']
  const uid = handshakeData._query['uid']
  console.log("middleware: ", accessKey, 'uid: ', uid);

  // Check if user already verified
  if (users[uid] && users[uid].verified) {
    console.log('users[uid] is verified: ', uid)
    if (!users[uid].connections[socket.id]) {
      console.log('users[uid] is not in connection: ', uid)

      // TODO: Check access key with server
      checkAccessKey(uid, accessKey, (errorData) => {

      },
        (data) => {
          next()
        })
      socket.join(uid)
    } else {
      next()
    }
  } else {

    // TODO: Check access key with server
    checkAccessKey(uid, accessKey, (errorData) => {
      if (!users[uid] || (users[uid] && users[uid].connections && !users[uid].connections[socket.id])) {
        console.log('user is not verified join to room: ', uid)
        socket.join(uid)
      }
      users[uid] = { verified: true, connections: { [socket.id]: true } }
      console.log('User object: ', JSON.stringify(users[uid]))
      next()
    },
      (data) => {
        users[uid] = { verified: false }
        next()
      })
  }

});

io.on('connection', (socket) => {
  console.log('Client connected');
  const uid = socket.handshake.query.uid

  if (!users[uid] || (users[uid] && !users[uid].verified)) {
    socket.emit('dispatch', 'not authorized..')
    socket.disconnect(true)
  }
  socket.on('request-chat', (data) => {

    // The person who should receive the request
    const recUser = users[data.recUserId]
    if (!recUser) {
      io.to(uid).emit('dispatch', Actions.setUserOffline(data.recUserId));
    } else {
      io.to(data.withUserId).emit('dispatch', Actions.setChatRequest(uid));
    }

  });

  socket.on('accept-chat', (data) => {

    // The person whos request accepted
    const reqUser = users[data.reqUserId]
    if (!reqUser) {
      io.to(uid).emit('dispatch', Actions.setUserOffline(data.reqUserId));
    } else {
      const newRoomId = uuidv4()
      chatRooms[newRoomId] = { roomId: newRoomId, connections: { [data.reqUserId]: true, [uid]: true } }
      socket.join(newRoomId)

      socket.emit('dispatch', Actions.addChatConnect(data.reqUserId, { roomId: newRoomId }))

      // Send room id to the user who requested for chat to join the room by sending room id as a `join` event 
      io.to(data.recUserId).emit('dispatch', Actions.setAcceptChatRequest(uid, newRoomId));

    }


  });

  socket.on('join-chat', (data) => {

    // The person whos request accepted
    if (chatRooms[data.roomId] && chatRooms[data.roomId].connections[uid]) {
      socket.join(data.roomId)
    } else {
      io.to(uid).emit('dispatch', Actions.showMessage("Can not connect to room, due to wrong room id."));
    }
  });


  socket.on('cancel-chat', (data) => {

    // The person whos request accepted
    if (chatRooms[data.roomId] && chatRooms[data.roomId].connections[uid]) {
      socket.join(data.roomId)
    } else {
      io.to(uid).emit('dispatch', Actions.showMessage("Can not connect to room, due to wrong room id."));
    }
  });

  socket.on('ignore-chat', (data) => {

    // The person whos request accepted
    if (chatRooms[data.roomId] && chatRooms[data.roomId].connections[uid]) {
      socket.join(data.roomId)
    } else {
      io.to(uid).emit('dispatch', Actions.showMessage("Can not connect to room, due to wrong room id."));
    }
  });



  socket.on('disconnect', () => {
    if (users[uid].connections) {

      const conKeys = Object.keys(users[uid].connections)

      let newCons = {}
      let newConCounter = 0
      conKeys.forEach((key) => {
        if (key !== socket.id) {
          ++newConCounter
          newCons = { ...newCons, [key]: true }
        }
      })

      if (newConCounter > 0) {
        users[uid].connections = { ...newCons }
      } else {
        users[uid] = { verified: false }
      }

    }
  });
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

// *************************
// Http Requests
// *************************
function checkAccessKey(userId, accessKey, onError, onSuccess) {
  const hashData = GateKeeper.sign("", payloadSecret)
  const url = getPrettyURLf(`actions/room/verify/${userId}/${accessKey}`)
  const options = {
    uri: url,
    method: "GET",
    headers: {}
  }
  options.headers[X_Cloud_Signature] = hashData
  options.headers["uid"] = userId
  request(options, function (error, response, body) {
    if (error) {
      console.log("error: ", error)
      onError(error)
    } else if (response && response.statusCode && response.statusCode == 200) {
      console.log("body: ", body)
      onSuccess(body)
    }
  });

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
    const hash = req.header(X_Cloud_Signature)
    var room = req.params.room;
    const isValidReq = await GateKeeper.validate(req.rawBody, payloadSecret, hash)
    console.log('isValidReq: ', isValidReq)
    if (isValidReq) {
      if (users[room]) {
        io.to(room).emit('dispatch', req.body)
        return res.status(200).send({ success: true })

      } else {
        return res.status(400).send({ code: "roomNotFundError", message: "Room not found" })
      }
    }
    return res.status(400).send({ code: "hmacError", message: "Hmac is not valid!" })
  }

  /**
   * Dispatch list controller
   */
  const dispatchList = async (req, res) => {
    const hash = req.header(X_Cloud_Signature)
    var room = req.params.room;
    const isValidReq = await GateKeeper.validate(req.rawBody, payloadSecret, hash)
    console.log('isValidReq: ', isValidReq)
    if (isValidReq) {
      if (users[room]) {
        io.to(room).emit('dispatch-list', req.body)
        return res.status(200).send({ success: true })

      } else {
        return res.status(400).send({ code: "roomNotFundError", message: "Room not found" })
      }
    }
    return res.status(400).send({ code: "hmacError", message: "Hmac is not valid!" })
  }

  // *************************
  // Routing
  // *************************
  // app.get('/', home)

  app.get('/ping', ping)

  app.post('api/dispatch/:room', dispatch)
  app.post('api/dispatch-list/:room', dispatchList)
