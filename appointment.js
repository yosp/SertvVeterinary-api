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

hash.set('GET /', async function getAppointment (req, res, param) {
  await db.connect()
  let appoint = await db.getAppointments()
  await db.disconnect()
  send(res, 200, appoint)
})

hash.set('GET /:petid', async function getAppointmentByPet (req, res, param) {
  let petid = param.petid
  await db.connect()
  let appoint = await db.getAppointmentByPet(petid)
  await db.disconnect()
  send(res, 200, appoint)
})

hash.set('POST /', async function saveAppointment (req, res, param) {
  let appoint = await json(req)
  await db.connect()
  let created = await db.saveAppointment(appoint)
  await db.disconnect()
  send(res, 201, created)
})

hash.set('POST /update', async function updateAppointment (req, res, param) {
	let appoint = await json(req)
	try{
		let token = await utils.extractToken(req)
		let encode = await utils.verifyToken(token, config.secret)
		if ( encode && encode.apid !== appoint.id) {
			throw new Error('invalid Token')
		}
	} catch (e) {
		send(res, 401, {message: 'invalid token'})
	}

	await db.connect()
	let updated = await db.updateAppointment(appoint)
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
