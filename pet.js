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

hash.set('GET /:clientid', async function getLab (req, res, param) {
  let clientid = param.clientid
  await db.connect()
  let pet = await db.getPetsByClient(clientid)
  await db.disconnect()
  send(res, 200, pet)
})

hash.set('GET /petimage/:petid', async function getLab (req, res, param) {
  let petid = param.petid
  await db.connect()
  let petpic = await db.getPetImages(petid)
  await db.disconnect()
  send(res, 200, petpic)
})

hash.set('POST /', async function saveLab (req, res, param) {
  let pet = await json(req)
  await db.connect()
  let created = await db.savePet(pet)
  await db.disconnect()
  send(res, 201, created)
})

hash.set('POST /petimage', async function saveLab (req, res, param) {
  let petimg = await json(req)
  await db.connect()
  let created = await db.savePetImage(petimg)
  await db.disconnect()
  send(res, 201, created)
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
