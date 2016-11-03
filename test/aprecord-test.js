import test from 'ava'
import micro from 'micro'
import listen from 'test-listen'
import request from 'request-promise'
import aprecord from '../aprecord'
import fixtures from './fixtures'
import utils from '../lib/utils'
import config from '../config'

test.beforeEach(async t => {
  let srv = micro(aprecord)
  t.context.url = await listen(srv)
})

test('GET /:apid', async t => {
  let aprec = fixtures.getAprecord()
  let url = t.context.url
  let body = await request({uri: `${url}/${aprec.apid}`, json: true})
  t.deepEqual(body, aprec)
})

test('POST /', async t => {
  let aprec = fixtures.getAprecord()
  let url = t.context.url
  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      id: aprec.id,
      apId: aprec.apId,
      medicineId: aprec.medicineId,
      note: aprec.note
    },
    resolveWithFullResponse: true
  }

  let response = await request(options)

  t.deepEqual(response.body, aprec)
  t.is(response.statusCode, 201)
})

test('POST /update', async t => {
  let aprec = fixtures.getAprecord()
  let url = t.context.url
  let token = await utils.signToken({apid: aprec.apid}, config.secret)
  aprec.note = 'Good Job'
  let options = {
    method: 'POST',
    uri: `${url}/update`,
    json: true,
    body: {
      id: aprec.id,
      apId: aprec.apId,
      medicineId: aprec.medicineId,
      note: aprec.note
    },
    headers: {
      'Authorization': `Bearer ${token}`
    },
    resolveWithFullResponse: true
  }
  let response = await request(options)

  t.deepEqual(response.body, aprec)
  t.is(response.statusCode, 201)
})
