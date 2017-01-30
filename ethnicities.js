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

hash.set('GET /', async function getEthni (req, res, param) {
  await db.connect()
  let ethni = await db.getEthnicities()
  await db.disconnect()
  send(res, 200, ethni)
})

hash.set('POST /', async function saveEthni (req, res, param) {
  let ethni = await json(req)
  await db.connect()
  let created = await db.saveEthnicities(ethni)
  await db.disconnect()
  send(res, 201, created)
})

hash.set('POST /update', async function updateEthni (req, res, param) {
  let ethni = await json(req)
  await db.connect()
  let updated = await db.updateEthnicities(ethni)
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
