import test from 'ava'
import micro from 'micro'
import listen from 'test-listen'
import request from 'request-promise'
import clients from '../client'
import fixtures from './fixtures'
import utils from '../lib/utils'
import config from '../config'

test.beforeEach(async t => {
  let srv = micro(clients)
  t.context.url = await listen(srv)
})

test('GET /clientList', async t => {
  let clients = fixtures.getClients()
  let url = t.context.url
  let body = await request({uri: `${url}/clientList`, json: true})
  t.deepEqual(body, clients)
})

test('GET /client/:id', async t => {
  let client = fixtures.getClients()
  let url = t.context.url
  let body = await request({uri: `${url}/${client.id}`, json: true})
  t.deepEqual(body, client)
})

test('GET /client/:phone', async t => {
  let client = fixtures.getClients()
  let url = t.context.url
  let body = await request({uri: `${url}/byPhone/${client.phone}`, json: true})
  t.deepEqual(body, client)
})

test('GET /client:email', async t => {
  let client = fixtures.getClients()
  let url = t.context.url
  let body = await request({uri: `${url}/byEmail/${client.email}`, json: true})
  t.deepEqual(body, client)
})

test('POST /createClient', async t => {
  let client = fixtures.getClients()
  let url = t.context.url

  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      id: client.id,
      fullname: client.fullname,
      gender: client.gender,
      direction: client.direction,
      email: client.email,
      phone: client.phone,
      phone2: client.phone2
    },
    resolveWithFullResponse: true

  }

  let response = await request(options)

  t.is(response.statusCode, 201)
  t.deepEqual(response.body, client)
})

test('POST /updateClient', async t => {
  let client = fixtures.getClients()
  let url = t.context.url
  let token = await utils.signToken({clientId: client.id}, config.secret)

  client.phone = '809-414-8434'

  let options = {
    method: 'POST',
    uri: `${url}/updateClient`,
    json: true,
    body: {
      id: client.id,
      fullname: client.fullname,
      gender: client.gender,
      direction: client.direction,
      email: client.email,
      phone: client.phone,
      phone2: client.phone2
    },
    headers: {
      'Authorization': `Bearer ${token}`
    },
    resolveWithFullResponse: true

  }

  let response = await request(options)

  t.is(response.statusCode, 201)
  t.deepEqual(response.body, client)
})
