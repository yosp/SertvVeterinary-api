import test from 'ava'
import micro from 'micro'
import listen from 'test-listen'
import request from 'request-promise'
import medicine from '../medicine'
import fixtures from './fixtures'
import utils from '../lib/utils'
import config from '../config'

test.beforeEach(async t => {
  let srv = micro(medicine)
  t.context.url = await listen(srv)
})

test('GET /:labid', async t => {
  let med = fixtures.getMedicine()
  let url = t.context.url
  let body = await request({uri: `${url}/${med.id}`, json: true})
  t.deepEqual(body, med)
})

test('POST /', async t => {
  let med = fixtures.getMedicine()
  let url = t.context.url
  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      id: med.id,
      labid: med.labid,
      description: med.description
    },
    resolveWithFullResponse: true
  }

  let response = await request(options)

  t.deepEqual(response.body, med)
  t.is(response.statusCode, 201)
})

test('POST /update', async t => {
  let med = fixtures.getMedicine()
  let url = t.context.url
  let token = await utils.signToken({medid: med.id}, config.secret)
  med.description = 'Medicine y'
  let options = {
    method: 'POST',
    uri: `${url}/update`,
    json: true,
    body: {
      id: med.id,
      labid: med.labid,
      description: med.description
    },
    headers: {
      'Authorization': `Bearer ${token}`
    },
    resolveWithFullResponse: true
  }
  let response = await request(options)

  t.deepEqual(response.body, med)
  t.is(response.statusCode, 201)
})
