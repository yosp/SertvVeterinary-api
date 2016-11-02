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

test('GET /:internid', async t => {
  let interecord = fixtures.getInteRecord()
  let url = t.context.url
  let body = await request({uri: `${url}/${interecord.internid}`, json: true})
  t.deepEqual(body, interecord)
})

test('POST /', async t => {
  let interecord = fixtures.getInteRecord()
  let url = t.context.url
  let token = await utils.signToken({intrecid: interecord.id}, config.secret)
  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      id: interecord.id,
      medicineId: interecord.medicineId,
      description: interecord.description,
      internid: interecord.internid
    },
    headers: {
      'Authorization': `Bearer ${token}`
    },
    resolveWithFullResponse: true
  }

  let response = await request(options)

  t.deepEqual(response.body, interecord)
  t.is(response.statusCode, 201)
})

test('POST /update', async t => {
  let interecord = fixtures.getInteRecord()
  let url = t.context.url
  let token = await utils.signToken({intrecid: interecord.id}, config.secret)
  interecord.description = 'Changed'
  let options = {
    method: 'POST',
    uri: `${url}/update`,
    json: true,
    body: {
      id: interecord.id,
      medicineId: interecord.medicineId,
      description: interecord.description,
      internid: interecord.internid
    },
    headers: {
      'Authorization': `Bearer ${token}`
    },
    resolveWithFullResponse: true
  }
  let response = await request(options)

  t.deepEqual(response.body, interecord)
  t.is(response.statusCode, 201)
})
