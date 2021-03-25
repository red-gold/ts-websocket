/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/actions.js":
/*!************************!*\
  !*** ./src/actions.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nvar setUserOffline = function setUserOffline(userId) {\n  return {\n    type: 'SET_USER_OFFLINE',\n    payload: {\n      userId: userId\n    }\n  };\n};\n\nvar setChatRequest = function setChatRequest(userId) {\n  return {\n    type: 'ADD_CHAT_REQUEST',\n    payload: {\n      userId: userId\n    }\n  };\n};\n\nvar setCallingUser = function setCallingUser(userId) {\n  return {\n    type: 'ADD_CHAT_CALLING',\n    payload: {\n      userId: userId\n    }\n  };\n};\n\nvar asyncAcceptChatRequest = function asyncAcceptChatRequest(userId, roomId) {\n  return {\n    type: 'ASYNC_ACCEPT_CHAT_REQUEST',\n    payload: {\n      userId: userId,\n      roomId: roomId\n    }\n  };\n};\n\nvar asyncJoinChatRoom = function asyncJoinChatRoom(roomId) {\n  return {\n    type: 'ASYNC_JOIN_CHAT_ROOM',\n    payload: {\n      roomId: roomId\n    }\n  };\n};\n\nvar addChatConnect = function addChatConnect(userId, room) {\n  return {\n    type: 'ADD_CHAT_CONNECT',\n    payload: {\n      userId: userId,\n      room: room\n    }\n  };\n};\n\nvar removeChatConnect = function removeChatConnect(userId) {\n  return {\n    type: 'REMOVE_CHAT_CONNECT',\n    payload: {\n      userId: userId\n    }\n  };\n};\n/**\n * Add user information\n */\n\n\nvar addUserInfo = function addUserInfo(uid, info) {\n  return {\n    type: 'ADD_PLAIN_USER_INFO',\n    payload: {\n      uid: uid,\n      info: info\n    }\n  };\n};\n/**\n * Set current chat\n */\n\n\nvar setCurrentChat = function setCurrentChat(userId) {\n  return {\n    type: 'SET_CURRENT_CHAT',\n    payload: {\n      userId: userId\n    }\n  };\n};\n/**\n * Remove chat request\n */\n\n\nvar removeChatRequest = function removeChatRequest(userId) {\n  return {\n    type: 'REMOVE_CHAT_REQUEST',\n    payload: {\n      userId: userId\n    }\n  };\n};\n/**\n * Add plain chat messages\n */\n\n\nvar addPlainChatRoomMessages = function addPlainChatRoomMessages(messages, roomId) {\n  return {\n    type: 'ADD_PLAIN_CHAT_ROOM_MESSAGES',\n    payload: {\n      messages: messages,\n      roomId: roomId\n    }\n  };\n};\n/**\n * Remove chat calling\n */\n\n\nvar removeChatCalling = function removeChatCalling(userId) {\n  return {\n    type: 'REMOVE_CHAT_CALLING',\n    payload: {\n      userId: userId\n    }\n  };\n};\n\nvar showMessage = function showMessage(message) {\n  return {\n    type: 'SHOW_MESSAGE_GLOBAL',\n    payload: {\n      message: message\n    }\n  };\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  setUserOffline: setUserOffline,\n  setChatRequest: setChatRequest,\n  asyncAcceptChatRequest: asyncAcceptChatRequest,\n  asyncJoinChatRoom: asyncJoinChatRoom,\n  setCallingUser: setCallingUser,\n  setCurrentChat: setCurrentChat,\n  addUserInfo: addUserInfo,\n  showMessage: showMessage,\n  addChatConnect: addChatConnect,\n  removeChatConnect: removeChatConnect,\n  removeChatRequest: removeChatRequest,\n  removeChatCalling: removeChatCalling,\n  addPlainChatRoomMessages: addPlainChatRoomMessages\n});\n\n//# sourceURL=webpack://websockets-socket.io/./src/actions.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ \"@babel/runtime/helpers/asyncToGenerator\");\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ \"@babel/runtime/helpers/defineProperty\");\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ \"@babel/runtime/regenerator\");\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _utils_hmac__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/hmac */ \"./utils/hmac.js\");\n\n\n\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\n\n\nvar request = __webpack_require__(/*! request */ \"request\");\n\nvar _require = __webpack_require__(/*! uuid */ \"uuid\"),\n    uuidv4 = _require.v4;\n\nvar express = __webpack_require__(/*! express */ \"express\");\n\nvar socketIO = __webpack_require__(/*! socket.io */ \"socket.io\");\n\nvar cookieParser = __webpack_require__(/*! cookie-parser */ \"cookie-parser\")();\n\nvar Actions = __webpack_require__(/*! ./actions */ \"./src/actions.js\");\n\nvar _require2 = __webpack_require__(/*! ./store */ \"./src/store.js\"),\n    getUserByUID = _require2.getUserByUID,\n    setUserByUID = _require2.setUserByUID,\n    setChatRoomById = _require2.setChatRoomById,\n    getChatRoomById = _require2.getChatRoomById; // Environment Variables\n\n\nvar appConfig = {\n  payloadSecret: \"\".concat(process.env.PAYLOAD_SECRET),\n  originEnv: \"\".concat(process.env.ORIGIN),\n  gateway: process.env.GATEWAY || 'http://www.app.localhost:31112',\n  baseRoute: process.env.BASE_ROUTE || ''\n};\nconsole.log('Payload Secret: ', appConfig.payloadSecret);\nvar XCloudSignature = 'X-Cloud-Signature';\n\nfunction getPrettyURLf(url) {\n  return \"\".concat(appConfig.gateway).concat(appConfig.baseRoute).concat(url);\n} // *************************\n// Initialize express server\n// *************************\n\n\nvar PORT = process.env.PORT || 3001;\nvar app = express();\n\nif (appConfig.originEnv && appConfig.originEnv.length > 0) {\n  var cors = __webpack_require__(/*! cors */ \"cors\");\n\n  var whitelist = appConfig.originEnv.split(',').map(function (url) {\n    return url.trim();\n  });\n  console.log('Origin whitelist: ', whitelist);\n  var corsOptions = {\n    origin: function origin(_origin, callback) {\n      if (whitelist.indexOf(_origin) !== -1) {\n        callback(null, true);\n      } else {\n        console.error('Origin is not defined! ', _origin);\n        callback(new Error('Not allowed by CORS'));\n      }\n    }\n  };\n  app.use(cors(corsOptions));\n} else {\n  console.error('Origin is not defined!');\n}\n\napp.disable('x-powered-by');\napp.use(function (req, res, next) {\n  console.log('Rquest origin URL: ', req.originalUrl);\n  res.header('Access-Control-Allow-Origin', '*'); // res.header(\"Access-Control-Allow-Credentials\", true);\n\n  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');\n  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');\n  next();\n});\napp.use(cookieParser);\napp.use(function (req, res, next) {\n  var data = '';\n  req.setEncoding('utf8');\n  req.on('data', function (chunk) {\n    data += chunk;\n  });\n  req.on('end', function () {\n    req.rawBody = data;\n    next();\n  });\n});\nvar server = app.listen(PORT, function () {\n  return console.log(\"Listening on \".concat(PORT));\n}); // *************************\n// Initialize websocket\n// *************************\n\nvar io = socketIO(server);\nio.use(function (socket, next) {\n  var handshakeData = socket.request;\n  var accessKey = handshakeData._query.accessKey;\n  var uid = handshakeData._query.uid;\n  console.log('middleware: ', accessKey, 'uid: ', uid); // Check if user already verified\n\n  var user = getUserByUID(uid);\n\n  if (user && user.verified) {\n    console.log('user is verified: ', uid);\n\n    if (!user.connections[socket.id]) {\n      console.log('user is not in connection: ', uid); // TODO: Check access key with server\n\n      checkAccessKey(uid, accessKey, function (errorData) {// socket.disconnect(true)\n      }, function (data) {\n        console.log('user is verified join to room: ', uid);\n        socket.join(uid);\n        next();\n      });\n    } else {\n      next();\n    }\n  } else {\n    // TODO: Check access key with server\n    checkAccessKey(uid, accessKey, function (errorData) {\n      setUserByUID(uid, {\n        verified: false\n      });\n      next();\n    }, function (data) {\n      console.log('First access accepted.', data);\n      var user = getUserByUID(uid);\n\n      if (!user || user && user.connections && !user.connections[socket.id]) {\n        console.log('user is not verified join to room: ', uid);\n      }\n\n      if (!data.isVerified) {\n        setUserByUID(uid, {\n          verified: false\n        });\n        next();\n        return;\n      }\n\n      socket.join(uid);\n      setUserByUID(uid, {\n        verified: true,\n        connections: _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()({}, socket.id, true)\n      });\n      next();\n    });\n  }\n});\n/**\n * On connection\n */\n\nio.on('connection', function (socket) {\n  console.log('Client connected');\n  var uid = socket.handshake.query.uid;\n  var user = getUserByUID(uid);\n  console.log('uid: ', uid, 'user: ', user);\n\n  if (!user || user && !user.verified) {\n    socket.emit('dispatch', 'not authorized..');\n    socket.disconnect(true);\n  }\n  /**\n   * On request chat\n   */\n\n\n  socket.on('request-chat', function (data) {\n    console.log('Request chat: ', data); // The person who should receive the request\n\n    var recUser = getUserByUID(data.recUserId);\n\n    if (!recUser) {\n      console.log('Dispatch offline person: ', Actions.setUserOffline(data.recUserId));\n      io.to(uid).emit('dispatch', Actions.setUserOffline(data.recUserId));\n    } else {\n      console.log('Dispatch Request chat: ', Actions.setChatRequest(uid));\n      socket.emit('dispatch', Actions.setChatRequest(data.recUserId));\n      getUserProfile(uid, function (errorData) {\n        console.log('Error on getting user profile ', errorData);\n      }, function (currentUser) {\n        io.to(data.recUserId).emit('dispatch', Actions.addUserInfo(uid, currentUser));\n        io.to(data.recUserId).emit('dispatch', Actions.setCallingUser(uid));\n      });\n    }\n  });\n  /**\n   * On accept chat\n   */\n\n  socket.on('accept-chat', function (data) {\n    console.log('Accept chat: ', data); // The person whos request accepted\n\n    var reqUser = getUserByUID(data.reqUserId);\n\n    if (!reqUser) {\n      io.to(uid).emit('dispatch', Actions.setUserOffline(data.reqUserId));\n    } else {\n      var _connections2;\n\n      var newRoomId = uuidv4();\n      console.log('New chatroom: ', data);\n      setChatRoomById(newRoomId, {\n        roomId: newRoomId,\n        connections: (_connections2 = {}, _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_connections2, data.reqUserId, true), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_connections2, uid, true), _connections2)\n      });\n      socket.join(newRoomId);\n      socket.emit('dispatch-list', [Actions.removeChatCalling(data.reqUserId), Actions.addChatConnect(data.reqUserId, {\n        roomId: newRoomId\n      }), Actions.setCurrentChat(data.reqUserId)]); // Send room id to the user who requested for chat to join the room by sending room id as a `join` event\n\n      io.to(data.reqUserId).emit('dispatch-list', [Actions.removeChatRequest(uid), Actions.addChatConnect(uid, {\n        roomId: newRoomId\n      }), Actions.asyncJoinChatRoom(newRoomId), Actions.setCurrentChat(uid)]);\n    }\n  });\n  socket.on('join-chat', function (data) {\n    console.log('Join chat: ', data); // The person whos request accepted\n\n    var chatRoom = getChatRoomById(data.roomId);\n\n    if (chatRoom && chatRoom.connections[uid]) {\n      socket.join(data.roomId);\n    } else {\n      io.to(uid).emit('dispatch', Actions.showMessage('Can not connect to room, due to wrong room id.'));\n    }\n  });\n  socket.on('chatroom-message', function (data) {\n    console.log('Send chat message: ', data); // The person whos request accepted\n\n    var message = data.message;\n    var chatRoomId = message.chatRoomId;\n    var chatRoom = getChatRoomById(chatRoomId);\n\n    if (chatRoom && chatRoom.connections[uid]) {\n      io.to(chatRoomId).emit('dispatch', Actions.addPlainChatRoomMessages([message], chatRoomId));\n    } else {\n      io.to(uid).emit('dispatch', Actions.showMessage('Can not connect to room, due to wrong room id.'));\n    }\n  });\n  socket.on('cancel-chat', function (data) {\n    console.log('Cancel chat: ', data); // The person who should receive the request\n\n    var recUser = getUserByUID(data.recUserId);\n\n    if (!recUser) {\n      console.log('Dispatch offline person: ', Actions.setUserOffline(data.recUserId));\n      io.to(uid).emit('dispatch', Actions.setUserOffline(data.recUserId));\n    } else {\n      socket.emit('dispatch', Actions.removeChatRequest(data.recUserId));\n      io.to(data.recUserId).emit('dispatch', Actions.removeChatCalling(uid));\n    }\n  });\n  socket.on('ignore-chat', function (data) {\n    console.log('Ignore chat: ', data); // The person who should receive the request\n\n    var reqUser = getUserByUID(data.reqUserId);\n\n    if (!reqUser) {\n      console.log('Dispatch offline person: ', Actions.setUserOffline(data.reqUserId));\n      io.to(uid).emit('dispatch', Actions.setUserOffline(data.reqUserId));\n    } else {\n      socket.emit('dispatch', Actions.removeChatCalling(data.reqUserId));\n      io.to(data.reqUserId).emit('dispatch', Actions.removeChatRequest(uid));\n    }\n  });\n  socket.on('disconnect', function () {\n    var user = getUserByUID(uid);\n\n    if (user.connections) {\n      var conKeys = Object.keys(user.connections);\n      var newCons = {};\n      var newConCounter = 0;\n      conKeys.forEach(function (key) {\n        if (key !== socket.id) {\n          ++newConCounter;\n          newCons = _objectSpread(_objectSpread({}, newCons), {}, _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()({}, key, true));\n        }\n      });\n\n      if (newConCounter > 0) {\n        user.connections = _objectSpread({}, newCons);\n      } else {\n        setUserByUID(uid, {\n          verified: false\n        });\n      }\n    }\n  });\n});\nsetInterval(function () {\n  return io.emit('time', new Date().toTimeString());\n}, 1000); // *************************\n// Http Requests\n// *************************\n\n/**\n * Check user access key\n */\n\nfunction checkAccessKey(userId, accessKey, onError, onSuccess) {\n  var hashData = _utils_hmac__WEBPACK_IMPORTED_MODULE_3__.GateKeeper.sign('', appConfig.payloadSecret);\n  var url = getPrettyURLf(\"/actions/room/verify/\".concat(accessKey));\n  var options = {\n    uri: url,\n    method: 'GET',\n    headers: {}\n  };\n  options.headers[XCloudSignature] = hashData;\n  options.headers.uid = userId;\n  console.log('Check access ...');\n  console.log('Request Options: ', options);\n  request(options, function (error, response, body) {\n    console.log('Error: ', error);\n    console.log('Body: ', body);\n\n    if (error) {\n      console.log('Error!');\n      console.log('error: ', error);\n      onError(error);\n    } else if (response && response.statusCode && response.statusCode === 200) {\n      console.log('Authorized!');\n      console.log('body: ', body);\n      onSuccess(JSON.parse(body));\n    }\n  });\n}\n/**\n * Get user profile\n */\n\n\nfunction getUserProfile(userId, onError, onSuccess) {\n  var hashData = _utils_hmac__WEBPACK_IMPORTED_MODULE_3__.GateKeeper.sign('', appConfig.payloadSecret);\n  var url = getPrettyURLf(\"/profile/id/\".concat(userId));\n  var options = {\n    uri: url,\n    method: 'GET',\n    headers: {}\n  };\n  options.headers[XCloudSignature] = hashData;\n  options.headers.uid = userId;\n  console.log('Get User Profile...');\n  console.log('Request Options: ', options);\n  request(options, function (error, response, body) {\n    console.log('Response: ');\n    console.log('Status: ', response.statusCode);\n    console.log('Body: ', body);\n\n    if (error) {\n      console.log('error: ', error);\n      onError(error);\n    } else if (response && response.statusCode && response.statusCode === 200) {\n      console.log('body: ', body);\n      onSuccess(JSON.parse(body));\n    }\n  });\n} // *************************\n// Controllers\n// *************************\n\n/**\n * Ping controller\n */\n\n\nvar ping = function ping(req, res) {\n  io.emit('dispatch', 'pong');\n  return res.status(200).send({\n    success: true\n  });\n};\n/**\n * Dispatch controller\n */\n\n\nvar dispatch = /*#__PURE__*/function () {\n  var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee(req, res) {\n    var hash, room, isValidReq, user;\n    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            console.log('Start Dispatching!');\n            hash = req.header(XCloudSignature);\n\n            if (!(!hash || hash && hash === '')) {\n              _context.next = 4;\n              break;\n            }\n\n            return _context.abrupt(\"return\", res.status(400).send({\n              code: 'HMACError',\n              message: 'HMAC is not presented!'\n            }));\n\n          case 4:\n            console.log('Dispatch - HMAC presented!');\n            room = req.params.room;\n            console.log('Dispatch - Room :', room);\n            isValidReq = false;\n            _context.prev = 8;\n            console.log('Dispatch - Start Validaiton', req.body, ' - ', req.rawBody, ' - ', appConfig.payloadSecret, ' - ', hash);\n            _context.next = 12;\n            return _utils_hmac__WEBPACK_IMPORTED_MODULE_3__.GateKeeper.validate(req.rawBody, appConfig.payloadSecret, hash);\n\n          case 12:\n            isValidReq = _context.sent;\n            _context.next = 19;\n            break;\n\n          case 15:\n            _context.prev = 15;\n            _context.t0 = _context[\"catch\"](8);\n            console.log('Dispatch - HMAC Error: ', _context.t0);\n            return _context.abrupt(\"return\", res.status(400).send({\n              code: 'HMACError',\n              message: _context.t0\n            }));\n\n          case 19:\n            console.log('isValidReq: ', isValidReq);\n\n            if (!isValidReq) {\n              _context.next = 28;\n              break;\n            }\n\n            user = getUserByUID(room);\n\n            if (!user) {\n              _context.next = 27;\n              break;\n            }\n\n            io.to(room).emit('dispatch', JSON.parse(req.rawBody));\n            return _context.abrupt(\"return\", res.status(200).send({\n              success: true\n            }));\n\n          case 27:\n            return _context.abrupt(\"return\", res.status(400).send({\n              code: 'roomNotFundError',\n              message: 'Room not found'\n            }));\n\n          case 28:\n            return _context.abrupt(\"return\", res.status(400).send({\n              code: 'HMACError',\n              message: 'HMAC is not valid!'\n            }));\n\n          case 29:\n          case \"end\":\n            return _context.stop();\n        }\n      }\n    }, _callee, null, [[8, 15]]);\n  }));\n\n  return function dispatch(_x, _x2) {\n    return _ref.apply(this, arguments);\n  };\n}();\n/**\n * Dispatch list controller\n */\n\n\nvar dispatchList = /*#__PURE__*/function () {\n  var _ref2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee2(req, res) {\n    var hash, room, isValidReq, user;\n    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee2$(_context2) {\n      while (1) {\n        switch (_context2.prev = _context2.next) {\n          case 0:\n            console.log('Start Dispatching!');\n            hash = req.header(XCloudSignature);\n\n            if (!(!hash || hash && hash === '')) {\n              _context2.next = 4;\n              break;\n            }\n\n            return _context2.abrupt(\"return\", res.status(400).send({\n              code: 'HMACError',\n              message: 'HMAC is not presented!'\n            }));\n\n          case 4:\n            console.log('Dispatch - HMAC presented!');\n            room = req.params.room;\n            console.log('Dispatch - Room :', room);\n            isValidReq = false;\n            _context2.prev = 8;\n            console.log('Dispatch - Start Validaiton', req.body, ' - ', req.rawBody, ' - ', appConfig.payloadSecret, ' - ', hash);\n            _context2.next = 12;\n            return _utils_hmac__WEBPACK_IMPORTED_MODULE_3__.GateKeeper.validate(req.rawBody, appConfig.payloadSecret, hash);\n\n          case 12:\n            isValidReq = _context2.sent;\n            _context2.next = 19;\n            break;\n\n          case 15:\n            _context2.prev = 15;\n            _context2.t0 = _context2[\"catch\"](8);\n            console.log('Dispatch - HMAC Error: ', _context2.t0);\n            return _context2.abrupt(\"return\", res.status(400).send({\n              code: 'HMACError',\n              message: _context2.t0\n            }));\n\n          case 19:\n            console.log('isValidReq: ', isValidReq);\n\n            if (!isValidReq) {\n              _context2.next = 28;\n              break;\n            }\n\n            user = getUserByUID(room);\n\n            if (!user) {\n              _context2.next = 27;\n              break;\n            }\n\n            io.to(room).emit('dispatch-list', req.rawBody);\n            return _context2.abrupt(\"return\", res.status(200).send({\n              success: true\n            }));\n\n          case 27:\n            return _context2.abrupt(\"return\", res.status(400).send({\n              code: 'roomNotFundError',\n              message: 'Room not found'\n            }));\n\n          case 28:\n            return _context2.abrupt(\"return\", res.status(400).send({\n              code: 'HMACError',\n              message: 'HMAC is not valid!'\n            }));\n\n          case 29:\n          case \"end\":\n            return _context2.stop();\n        }\n      }\n    }, _callee2, null, [[8, 15]]);\n  }));\n\n  return function dispatchList(_x3, _x4) {\n    return _ref2.apply(this, arguments);\n  };\n}(); // *************************\n// Routing\n// *************************\n// app.get('/', home)\n\n\napp.get('/ping', ping);\napp.post('/api/dispatch/:room', dispatch);\napp.post('/api/dispatch-list/:room', dispatchList);\n\n//# sourceURL=webpack://websockets-socket.io/./src/index.js?");

/***/ }),

/***/ "./src/store.js":
/*!**********************!*\
  !*** ./src/store.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getChatRoomById\": () => (/* binding */ getChatRoomById),\n/* harmony export */   \"setChatRoomById\": () => (/* binding */ setChatRoomById),\n/* harmony export */   \"getUserByUID\": () => (/* binding */ getUserByUID),\n/* harmony export */   \"setUserByUID\": () => (/* binding */ setUserByUID)\n/* harmony export */ });\n// States\nvar chatRooms = {};\nvar users = {};\n/**\n * Get room by id\n * @param {string} roomId Room id\n * @returns Room\n */\n\nvar getChatRoomById = function getChatRoomById(roomId) {\n  return chatRooms[roomId];\n};\n/**\n * Set room by id\n * @param {string} roomId Room id\n * @param {*} data Room information\n * @returns void\n */\n\nvar setChatRoomById = function setChatRoomById(roomId, data) {\n  chatRooms[roomId] = data;\n};\n/**\n * Get user by id\n * @param {string} uid User id\n * @returns User\n */\n\nvar getUserByUID = function getUserByUID(uid) {\n  return users[uid];\n};\n/**\n * Set user by id\n * @param {string} uid User id\n * @param {*} data User information\n * @returns void\n */\n\nvar setUserByUID = function setUserByUID(uid, data) {\n  users[uid] = data;\n};\n\n//# sourceURL=webpack://websockets-socket.io/./src/store.js?");

/***/ }),

/***/ "./utils/hmac.js":
/*!***********************!*\
  !*** ./utils/hmac.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"GateKeeper\": () => (/* binding */ GateKeeper)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ \"@babel/runtime/helpers/asyncToGenerator\");\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ \"@babel/runtime/regenerator\");\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\n/**\n * Reference https://github.com/cabrerabywaters/faas-node-gatekeeper/blob/master/index.js\n */\nvar crypto = __webpack_require__(/*! crypto */ \"crypto\");\n\nvar GateKeeper = function () {\n  var sign = function sign(data, sharedSecret) {\n    var hash = crypto.createHmac('sha1', sharedSecret).update(data, 'utf8').digest('hex');\n    return 'sha1=' + hash;\n  };\n  /**\n   * Removes 'sha1=' from hash string\n   * @param {String} hash\n   */\n\n\n  var getHashedMessage = function getHashedMessage(hash) {\n    if (!hash) {\n      throw new Error('We could not get the HASH from your message. Did you sign it? (--sign)');\n    }\n\n    if (hash.includes('sha1=')) {\n      hash = hash.replace('sha1=', '');\n    }\n\n    return hash;\n  };\n  /**\n   * Verifies that the message was hashed with\n   * the proper shared key\n   *\n   * @param {String} hashedMessage\n   * @param {String} sharedSecret\n   * @param {String} message\n   */\n\n\n  var verify = function verify(hashedMessage, sharedSecret, message) {\n    var expectedHash = crypto.createHmac('sha1', sharedSecret).update(message, 'utf8').digest('hex');\n    return hashedMessage === expectedHash;\n  };\n  /**\n   *  Pulls the Hash and Secret assuming you are\n   *  running the function with OpenFaaS,\n   *  and verifies the message\n   *\n   * @param {String} message Original message, without hashing\n   * @param {String} secret Name of the secret to  generate\n   *                        the Hash\n   */\n\n\n  var validate = /*#__PURE__*/function () {\n    var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee(message, secret, hash) {\n      var hashedMessage;\n      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee$(_context) {\n        while (1) {\n          switch (_context.prev = _context.next) {\n            case 0:\n              hashedMessage = getHashedMessage(hash);\n              return _context.abrupt(\"return\", verify(hashedMessage, secret, message));\n\n            case 2:\n            case \"end\":\n              return _context.stop();\n          }\n        }\n      }, _callee);\n    }));\n\n    return function validate(_x, _x2, _x3) {\n      return _ref.apply(this, arguments);\n    };\n  }();\n\n  return Object.freeze({\n    validate: validate,\n    verify: verify,\n    sign: sign\n  });\n}();\n\n\n\n//# sourceURL=webpack://websockets-socket.io/./utils/hmac.js?");

/***/ }),

/***/ "@babel/runtime/helpers/asyncToGenerator":
/*!**********************************************************!*\
  !*** external "@babel/runtime/helpers/asyncToGenerator" ***!
  \**********************************************************/
/***/ ((module) => {

module.exports = require("@babel/runtime/helpers/asyncToGenerator");;

/***/ }),

/***/ "@babel/runtime/helpers/defineProperty":
/*!********************************************************!*\
  !*** external "@babel/runtime/helpers/defineProperty" ***!
  \********************************************************/
/***/ ((module) => {

module.exports = require("@babel/runtime/helpers/defineProperty");;

/***/ }),

/***/ "@babel/runtime/regenerator":
/*!*********************************************!*\
  !*** external "@babel/runtime/regenerator" ***!
  \*********************************************/
/***/ ((module) => {

module.exports = require("@babel/runtime/regenerator");;

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("cookie-parser");;

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("cors");;

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");;

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");;

/***/ }),

/***/ "request":
/*!**************************!*\
  !*** external "request" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("request");;

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("socket.io");;

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("uuid");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;