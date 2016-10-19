'use strict'

import HttpHash from 'http-hash'
import { send, json } from 'micro'
import Db from 'sertvveterinary-db'
import config from './config'
import DbStub from './test/stub/db'
import utils from './lib/utils'

const env = process.env.NODE_ENV || 'produccion'
let db = new Db(config.db)

if (env === 'test') {
  db = new DbStub()
}

const hash = HttpHash()

hash.set('POST /', async function authenticate (req, res, param) {
  let credentials = json(req)
  await db.connect()
  let auth = await db.authenticate(credentials.username, credentials.password)

  if (!auth) {
    return send(res, 401, {error: 'invelid credentials'})
  }

  let token = await utils.singToken({username: credentials.username}, config.secret)

  send(res, 200, token)

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
