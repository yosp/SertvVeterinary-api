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

hash.set('GET /:billid', async function getBill (req, res, param) {
  let billid = param.billid
  await db.connect()
  let bl = await db.getBill(billid)
  await db.disconnect()
  send(res, 200, bl)
})

hash.set('POST /byDate', async function GetBillByDate (req, res, param) {
  let dates = await json(req)
  let dateA = new Date(dates.dateA)
  let dateB = new Date(dates.dateB)

  await db.connect()
  let bl = await db.getBillByDate(dateA, dateB)
  await db.disconnect()
  send(res, 200, bl)
})

hash.set('POST /', async function saveBill (req, res, param) {
  let bl = await json(req)
  await db.connect()
  let created = await db.saveBills(bl)
  await db.disconnect()
  send(res, 201, created)
})

hash.set('POST /update', async function updateBill (req, res, param) {
	let bl = await json(req)
	try{
		let token = await utils.extractToken(req)
		let encode = await utils.verifyToken(token, config.secret)
		if ( encode && encode.billid !== bl.id) {
			throw new Error('invalid Token')
		}
	} catch (e) {
		send(res, 401, {message: 'invalid token'})
	}

	await db.connect()
	let updated = await db.updateBill(bl)
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
