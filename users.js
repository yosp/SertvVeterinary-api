'use strict'

import HttpHash from 'http-hash'
import { send, json } from 'micro'
import Db from 'sertvveterinary-db'
import config from './config'
import gravatar from 'gravatar'
import DbStub from './test/stub/db'
import utils from './lib/utils'

const env = process.env.NODE_ENV || 'produccion'
let db = new Db(config.db)

if (env === 'test') {
  db = new DbStub()
}

const hash = HttpHash()

hash.set('POST /', async function saveUser (req, res, params) {
  let user = await json(req)
  await db.connect()
  let created = await db.saveNewUser(user)
  await db.disconnect()
  delete created.password
  delete created.email
  send(res, 201, created)
})

hash.set('POST /update', async function updateUser (req, res, params) {
  let user = await json(req)

  try {
    let token = await utils.extractToken(req)
    let encode = await utils.verifyToken(token, config.secret)
    if (encode && encode.userId !== user.id) {
      throw new Error('invalid Token')
    }
  } catch (e) {
    send(res, 401, {message: 'invalid Token'})
  }
  await db.connect()
  let updUser = await db.updateUser(user)
  await db.disconnect()
  delete updUser.password
  delete updUser.email
  send(res, 201, updUser)
})

hash.set('GET /:username', async function getUser (req, res, params) {
  let username = params.username
  await db.connect()
  let user = await db.getUser(username)
  user.avatar = gravatar.url(user.email)

  delete user.password
  delete user.email

  send(res, 200, user)
})

export default async function main (req, res) {
  let { method, url } = req
  let match = hash.get(`${method.toUpperCase()} ${url}`)

  if (match.handler) {
    try {
      await match.handler(req, res, match.params)
    } catch (e) {
      send(res, 500, { error: e.message })
    }
  } else {
    send(res, 404, { error: 'route not found' })
  }
}
