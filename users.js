'use strict'

import HttpHash from 'http-hash'
import { send, json } from 'micro'
import Db from 'sertvveterinary-db'
import config from './config'
import DbStub from './test/stub/db'

const env = process.env.NODE_ENV || 'produccion'
let db = new Db(config.db)

if (env === 'test') {
  db = new DbStub()
}

const hash = HttpHash()

hash.set('POST /', async function saveUser (req, res, params) {
  let user = await json(req)

  try {
    let token = await utils.extractToken(req)
    let enconde = await utils.veryfyToken(token, config.secret)
    if (enconde && enconde.userId != user.id) {
      throw new Error('invalid Token')
    }
  } catch (e) {
    send(res, 401, {message: 'invalid Token'})
  }

  await db.connect()
  let created = await db.saveNewUser(user)
  await db.disconnect()
  delete created.password
  delete created.email
  send(res, 201, created)
})

hash('POST /update', async function updateUser (req, res, params) {
  let user = await json(req)

  try {
    let token = await utils.extractToken(req)
    let enconde = await utils.veryfyToken(token, config.secret)
    if (enconde && enconde.userId != user.id) {
      throw new Error('invalid Token')
    }
  } catch (e) {
    send(res, 401, {message: 'invalid Token'})
  }
  
  await db.connect()
  let user = db.updateUser(user)
  await db.disconnect()

  delete user.password
  delete user.email

  send(res, 201, user)
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
