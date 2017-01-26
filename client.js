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

hash.set('GET /', async function getClients (req, res, param) {
  await db.connect()
  let clients = await db.getClientList()
  await db.disconnect()
  send(res, 200, clients)
})

hash.set('GET /:id', async function getClient (req, res, param) {
  let id = param.id
  await db.connect()
  let client = await db.getClient(id)
  await db.disconnect()
  send(res, 200, client)
})

hash.set('GET /byPhone/:phone', async function getClientByPhone (req, res, param) {
  let phone = param.phone
  await db.connect()
  let client = await db.getClientByPhone(phone)
  await db.disconnect()
  send(res, 200, client)
})

hash.set('GET /byEmail/:email', async function getClientByEmail (req, res, param) {
  let email = param.email
  await db.connect()
  let client = await db.getClientByEmail(email)
  await db.disconnect()
  send(res, 200, client)
})

hash.set('POST /', async function saveClient (req, res, param) {
  let client = await json(req)
  await db.connect()
  let created = await db.saveClient(client)
  await db.disconnect()
  send(res, 201, created)
})

hash.set('POST /updateClient', async function updateClient (req, res, param) {
  let client = await json(req)

  await db.connect()
  let updated = await db.updateClient(client)
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
