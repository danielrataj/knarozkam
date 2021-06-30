const finalHandler = require('finalhandler')
const http = require('http')
const serveStatic = require('serve-static')
const auth = require('http-auth')

const basic = auth.basic({
  realm: 'knarozkam'
}, (username, password, cb) => {
  const result = process.env.BASIC_AUTH_USERNAME === username && process.env.BASIC_AUTH_PASSWORD === password
  return cb(result)
})

// Serve up public/ftp folder
var serve = serveStatic('dist/spa', { 'index': ['index.html'] })

// Create server
var server = http.createServer(
  basic.check((req, res) => {
    return serve(req, res, finalHandler(req, res))
  })
)

// Listen
server.listen(80)
