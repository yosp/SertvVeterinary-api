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

hash.set('GET /:petid', async function getIntern (req, res, param) {
  let petid = param.petid
  await db.connect()
  let intern = await db.getInternment(petid)
  await db.disconnect()
  send(res, 200, intern)
})

hash.set('POST /', async function saveIntern (req, res, param) {
  let intern = await json(req)
  try {
    let token = await utils.extractToken(req) 
    let encode = await utils.verifyToken(token, config.secret)
    if (encode && encode.internid !== intern.id) {
      throw new Error('invalid Token')
    }
  } catch (e) {
    send(res, 401, {message: 'invalid Token'})
  }

  await db.connect()
  let created = await db.saveInternment(intern)
  await db.disconnect()
  send(res, 201, created)
})

hash.set('POST /update', async function updateIntern (req, res, param) {
	let intern = await json(req)
	try{
		let token = await utils.extractToken(req)
		let encode = await utils.verifyToken(token, config.secret)
		if ( encode && encode.internid !==intern.id) {
			throw new Error('invalid Token')
		}
	} catch (e) {
		send(res, 401, {message: 'invalid token'})
	}

	await db.connect()
	let updated = await db.updateInternment(intern)
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
