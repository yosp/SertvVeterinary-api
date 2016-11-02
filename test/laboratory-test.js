import test from 'ava'
import micro from 'micro'
import listen from 'test-listen'
import request from 'request-promise'
import laboratory from '../laboratory'
import fixtures from './fixtures'
import utils from '../lib/utils'
import config from '../config'

test.beforeEach(async t => {
  let srv = micro(laboratory)
  t.context.url = await listen(srv)
})

test('GET /:labid', async t => {
  let lab = fixtures.getLab()
  let url = t.context.url
  let body = await request({uri: `${url}/${lab.id}`, json: true})
  t.deepEqual(body, lab)
})

test('POST /', async t => {
  let lab = fixtures.getLab()
  let url = t.context.url
  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      id: lab.id,
      description: lab.description
    },
    resolveWithFullResponse: true
  }

  let response = await request(options)

  t.deepEqual(response.body, lab)
  t.is(response.statusCode, 201)
})

test('POST /update', async t => {
  let lab = fixtures.getLab()
  let url = t.context.url
  let token = await utils.signToken({labid: lab.id}, config.secret)
  lab.description = 'Lab y'
  let options = {
    method: 'POST',
    uri: `${url}/update`,
    json: true,
    body: {
      id: lab.id,
      description: lab.description
    },
    headers: {
      'Authorization': `Bearer ${token}`
    },
    resolveWithFullResponse: true
  }
  let response = await request(options)

  t.deepEqual(response.body, lab)
  t.is(response.statusCode, 201)
})
