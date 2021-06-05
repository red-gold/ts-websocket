import { appConfig } from './appConfig'
import { initRouter } from './routing'
import { initWebSocket } from './websocket'
import { runEmailNotifyTask } from './taskManager'

const express = require('express')
const cookieParser = require('cookie-parser')()

console.log('Payload Secret: ', appConfig.payloadSecret)
// *************************
// Initialize express server
// *************************
const PORT = process.env.PORT || 3001

const cors = require('cors')
const whitelist = appConfig.originEnv.split(',').map((url) => url.trim())
const app = express()
app.disable('x-powered-by')

if (appConfig.originEnv && appConfig.originEnv.length > 0) {
  console.log('Origin whitelist: ', whitelist)
  const corsOptionsDelegate = function (req, callback) {
    let corsOptions
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
      console.log('Origin IS valid ')

      corsOptions = { origin: true, credentials: true } // reflect (enable) the requested origin in the CORS response
    } else {
      corsOptions = { origin: false, credentials: true } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
  }

  app.use(cors(corsOptionsDelegate))
} else {
  console.error('Origin is not defined!')
}

// Run task manager
runEmailNotifyTask()

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
const server = require('http').createServer(app)
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
(
  async () => {
    const io = await initWebSocket(server, whitelist)

    initRouter(app, io)
  }
)()
