import { appConfig } from './appConfig'
import { initRouter } from './routing'
import { initWebSocket } from './websocket'

const express = require('express')
const cookieParser = require('cookie-parser')()

console.log('Payload Secret: ', appConfig.payloadSecret)

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

initWebSocket(server)
initRouter(app)
