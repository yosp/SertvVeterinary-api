import test from 'ava'
import micro from 'micro'
import listen from 'test-listen'
import request from 'request-promise'
import internment from '../internment'
import fixtures from './fixtures'
import utils from '../lib/utils'
import config from '../config'

test.beforeEach(async t => {
  let srv = micro(internment)
  t.context.url = await listen(srv)
})

test('GET /:petid', async t => {
  let intern = fixtures.getIntern()
  let url = t.context.url
  let body = await request({uri: `${url}/${intern.petid}`, json: true})
  t.deepEqual(body, intern)
})

test('POST /', async t => {
  let intern = fixtures.getIntern()
  let url = t.context.url
  let token = await utils.signToken({internid: intern.id}, config.secret)
  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      id: intern.id,
      petid: intern.petid,
      description: intern.description,
      status: intern.status
    },
    headers: {
      'Authorization': `Bearer ${token}`
    },
    resolveWithFullResponse: true
  }

  let response = await request(options)

  t.deepEqual(response.body, intern)
  t.is(response.statusCode, 201)
})

test('POST /update', async t => {
  let intern = fixtures.getIntern()
  let url = t.context.url
  let token = await utils.signToken({internid: intern.id}, config.secret)
  intern.description = 'Changed'
  let options = {
    method: 'POST',
    uri: `${url}/update`,
    json: true,
    body: {
      id: intern.id,
      petid: intern.petid,
      description: intern.description,
      status: intern.status
    },
    headers: {
      'Authorization': `Bearer ${token}`
    },
    resolveWithFullResponse: true
  }
  let response = await request(options)

  t.deepEqual(response.body, intern)
  t.is(response.statusCode, 201)
})
