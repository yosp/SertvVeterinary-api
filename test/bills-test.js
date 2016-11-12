import test from 'ava'
import micro from 'micro'
import listen from 'test-listen'
import request from 'request-promise'
import bills from '../bills'
import fixtures from './fixtures'
import utils from '../lib/utils'
import config from '../config'

test.beforeEach(async t => {
  let srv = micro(bills)
  t.context.url = await listen(srv)
})

test('GET /:billid', async t => {
  let bl = fixtures.bills()
  let url = t.context.url
  let body = await request({uri: `${url}/${bl.id}`, json: true})
  t.deepEqual(body, bl)
})

test('GET /byDate/', async t => {
  let bl = fixtures.bills()
  let dates = {
    dateA: '11/01/2016',
    dateB: '11/30/2016'
  }

  let url = t.context.url
  let options = {
    method: 'POST',
    uri: `${url}/byDate/`,
    body: dates,
    resolveWithFullResponse: true,
    json: true
  }
  let reg = await request(options)
  t.deepEqual(reg.body, bl)
})

test('POST /', async t => {
  let bl = fixtures.bills()
  let url = t.context.url
  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      id: bl.id,
      client: bl.client,
      note: bl.note,
      createAt: bl.createAt
    },
    resolveWithFullResponse: true
  }

  let response = await request(options)

  t.deepEqual(response.body, bl)
  t.is(response.statusCode, 201)
})

test('POST /update', async t => {
  let bl = fixtures.bills()
  let url = t.context.url
  let token = await utils.signToken({billid: bl.id}, config.secret)
  bl.note = 'Naaa'
  let options = {
    method: 'POST',
    uri: `${url}/update`,
    json: true,
    body: {
      id: bl.id,
      client: bl.client,
      note: bl.note,
      createAt: bl.createAt
    },
    headers: {
      'Authorization': `Bearer ${token}`
    },
    resolveWithFullResponse: true
  }
  let response = await request(options)

  t.deepEqual(response.body, bl)
  t.is(response.statusCode, 201)
})
