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

hash.set('GET /:ethniid', async function getLab (req, res, param) {
  let ethniid = param.ethniid
  await db.connect()
  let race = await db.getRaceByEthni(ethniid)
  await db.disconnect()
  send(res, 200, race)
})

hash.set('POST /', async function saveLab (req, res, param) {
  let race = await json(req)
  await db.connect()
  let created = await db.saveRace(race)
  await db.disconnect()
  send(res, 201, created)
})

hash.set('POST /update', async function updateLab (req, res, param) {
	let race = await json(req)
  
	await db.connect()
	let updated = await db.updateRace(race)
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
