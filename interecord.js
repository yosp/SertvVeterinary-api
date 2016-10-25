'use strict'

import HttpHash from 'http-hash'
import { send, json } from 'micro'
import Db from 'sertvveterinary-db'
import config from './config'
import DbStub from './test/stub/db'
import utils from './lib/utils'

const env = process.env.NODE_ENV || 'production'
let db = new Db(config.db)

if (env === 'test') {
  db = new DbStub()
}

const hash = HttpHash()

hash.set('GET /', async function getInteRecord (req, res, params) {
  await db.connect()
  let interecord = await db.getInterecord()
  await db.disconnect()
  send(res, 200, interecord)
})

hash.set('POST /', async function saveInteRecord (req, res, params) {
  let interecord = json(req)
  try {
    let token = await utils.extractToken(req)
    let encode = await utils.verifyToken(token, secret)
    if (encode && encode.interecordid !== interecord.id) {
      throw new Error ('invalid Token')
    }
  } catch (e) {
    send(res, 401, {message: 'invalid token'})
  }

  await db.connect()
  let saved = db.saveInterecord(interecord)
  await db.disconnect()
  send(res, 201, saved)
})

hash.set('POST /updateInterecord', async function saveInteRecord (req, res, params) {
  let interecord = json(req)
  try {
    let token = await utils.extractToken(req)
    let encode = await utils.verifyToken(token, secret)
    if (encode && encode.interecordid !== interecord.id) {
      throw new Error ('invalid Token')
    }
  } catch (e) {
    send(res, 401, {message: 'invalid token'})
  }

  await db.connect()
  let updated = db.updateInterecord(interecord)
  await db.disconnect()
  send(res, 201, updated)
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
