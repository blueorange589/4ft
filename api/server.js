/** @license
 * 4ft <https://github.com/blueorange589/4ft>
 * Author: Ozgur Arslan | MIT License
 * v0.1 (2023/10/07)
 */
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const {query, auth} = require('./supabase.js')
const server = express()
const hostname = '0.0.0.0'
const port = 3000

server.use(cors())
server.use(express.json());
server.use(session({ secret: 'atu19.', resave: false, saveUninitialized: true }))

// middleware to test if authenticated
function isAuthenticated (req, res, next) {
  //console.log(req.session)
  if (req.session.user) next()
  else res.send('auth required')
}

server.get('/', (req, res) => {
  res.send('hello world')
})


// server.post('/api/sb/query', isAuthenticated, async(req, res) => {
server.post('/api/sb/query', async(req, res) => {
  
  const result = await query(req.body)
  res.send(result)
})

server.post('/api/sb/signin', async (req, res) => {
  const {data} = await auth.signIn(req.body)
  
  if(data.session) {
    req.session.save(function (err) {
      if (err) next(err)
  
      const {access_token, refresh_token, expires_at} = data.session
      // store user information in session, typically a user id
      req.session.user = data.user
      req.session.data = {access_token, refresh_token, expires_at}
  
      // save the session before redirection to ensure page
      // load does not happen before session is saved
      req.session.save(function (err) {
        if (err) return next(err)
        res.send(data.user)
      })
    })
  }
})
server.post('/api/sb/social', async (req, res) => {
  const result = await auth.signInSocial(req.body)
  res.send(result)
})

server.post('/api/sb/signout', async (req, res) => {
  const result = await auth.signOut(req.body)
  req.session.user = null
  req.session.data = null
  req.session.save(function (err) {
    if (err) next(err)
    req.session.regenerate(function (err) {
      if (err) next(err)
    })
  })
  res.send(result)
})

server.post('/api/sb/signup', async (req, res) => {
  const result = await auth.signUp(req.body)
  res.send(result)
})

server.post('/api/sb/resetpwd', async (req, res) => {
  const result = await auth.resetPassword(req.body)
  res.send(result)
})



server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})


// Export the Express API
module.exports = server;