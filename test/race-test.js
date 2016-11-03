import test from 'ava'
import micro from 'micro'
import listen from 'test-listen'
import request from 'request-promise'
import race from '../race'
import fixtures from './fixtures'
import utils from '../lib/utils'
import config from '../config'

test.beforeEach(async t => {
  let srv = micro(race)
  t.context.url = await listen(srv)
})

test('GET /:labid', async t => {
  let rac = fixtures.getRace()
  let url = t.context.url
  let body = await request({uri: `${url}/${rac.ethniid}`, json: true})
  t.deepEqual(body, rac)
})

test('POST /', async t => {
  let rac = fixtures.getRace()
  let url = t.context.url
  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      id: rac.id,
      description: rac.description,
      ethniid: rac.ethniid
    },
    resolveWithFullResponse: true
  }

  let response = await request(options)

  t.deepEqual(response.body, rac)
  t.is(response.statusCode, 201)
})

test('POST /update', async t => {
  let rac = fixtures.getRace()
  let url = t.context.url
  let token = await utils.signToken({raceid: rac.id}, config.secret)
  rac.description = 'Husky 2'
  let options = {
    method: 'POST',
    uri: `${url}/update`,
    json: true,
    body: {
      id: rac.id,
      description: rac.description,
      ethniid: rac.ethniid
    },
    headers: {
      'Authorization': `Bearer ${token}`
    },
    resolveWithFullResponse: true
  }
  let response = await request(options)

  t.deepEqual(response.body, rac)
  t.is(response.statusCode, 201)
})
