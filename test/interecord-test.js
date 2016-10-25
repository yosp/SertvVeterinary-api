import test from 'ava'
import micro from 'micro'
import listen from 'test-listen'
import request from 'request-promise'
import interecord from '../interecord'
import fixtures from './fixtures'
import utils from '../lib/utils'
import config from '../config'

test.beforeEach(async t => {
  let srv = micro(interecord)
  t.context.url = await listen(srv)
})

test('GET /', async t => {
  let url = t.context.url
  let interR = fixtures.getInteRecord()
  let body = await request({uri: url, json: true})
  t.deepEqual(body, interR)
})

test('POST /', async t => {
  let url = t.context.url
  let interR = fixtures.getInteRecord()
  let token = await utils.signToken({interecordid: interR.id}, config.secret)
  let options = {
    uri: url,
    json: true,
    body: {
      description: interR.description,
      medicineId: interR.medicineId,
      appointid: interR.appointid
    },
    headers: {
      'Authorization': `Bearer ${token}`
    },
    ResolveWithFullResponse: true
  }
  let response = request(options)

  t.deepEqual(interR, response.body)
  t.is(response.statusCode, 201)
})

test('POST /updateInterecord', async t => {
  let url = t.context.url
  let interR = fixtures.getInteRecord()
  let token = await utils.signToken({interecordid: interR.id}, config.secret)
  interR.description = 'Vacunado'
  let options = {
    uri: `${url}/updateInterecord`,
    json: true,
    body: {
      description: interR.description,
      medicineId: interR.medicineId,
      appointid: interR.appointid
    },
    headers: {
      'Authorization': `Bearer ${token}`
    },
    ResolveWithFullResponse: true
  }
  let response = request(options)

  t.deepEqual(response.body, interR)
  t.is(response.statusCode, 201)
})
