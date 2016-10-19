'use strict'

import HttpHash from 'http-hash'
import {send} from 'micro'
import Db from 'sertvveterinary-db'
import config from './config'
import DbStub from './test/stub/db'

const env = process.env.NODE_ENV || 'produccion'
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

export default async function main (req, res) {
  let {method, url} = req
  let match = hash.get(`${method.toUpperCase()} ${url}`)

  if (match.handler) {
    try {
      await match.handler(req, res, match.param)
    }
    catch (e) {
      send(res, 500, {error: e.message})
    }
  }
  else {
    send(res, 404, {error: 'route not foud'})
  }
}
