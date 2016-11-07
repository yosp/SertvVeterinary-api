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

hash.set('GET /', async function getLab (req, res, param) {
  let labid = param.labid
  await db.connect()
  let lab = await db.getLaboratorys()
  await db.disconnect()
  send(res, 200, lab)
})

hash.set('GET /:labid', async function getLab (req, res, param) {
  let labid = param.labid
  await db.connect()
  let lab = await db.getLaboratoryById(labid)
  await db.disconnect()
  send(res, 200, lab)
})


hash.set('POST /', async function saveLab (req, res, param) {
  let lab = await json(req)
  await db.connect()
  let created = await db.saveLaboratory(lab)
  await db.disconnect()
  send(res, 201, created)
})

hash.set('POST /update', async function updateLab (req, res, param) {
	let lab = await json(req)
	try{
		let token = await utils.extractToken(req)
		let encode = await utils.verifyToken(token, config.secret)
		if ( encode && encode.labid !== lab.id) {
			throw new Error('invalid Token')
		}
	} catch (e) {
		send(res, 401, {message: 'invalid token'})
	}

	await db.connect()
	let updated = await db.updateLaboratory(lab)
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
