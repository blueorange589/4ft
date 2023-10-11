/** @license
 * 4ft <https://github.com/blueorange589/4ft>
 * Author: Ozgur Arslan | MIT License
 * v0.1 (2023/10/07)
 */
import express from 'express'
import {query, auth} from './supabase.js'

const server = express()

server.post('/query', async(req, res) => {
  const result = await query(req.body)
  res.send(result)
})

server.post('/signin', async (req, res) => {
  const result = await auth.signIn(req.body)
  res.send(result)
})

server.post('/signout', async (req, res) => {
  const result = await auth.signOut(req.body)
  res.send(result)
})

server.post('/signup', async (req, res) => {
  const result = await auth.signUp(req.body)
  res.send(result)
})

server.post('/resetpwd', async (req, res) => {
  const result = await auth.resetPassword(req.body)
  res.send(result)
})