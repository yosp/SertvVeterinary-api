import test from 'ava'
import micro from 'micro'
import listen from 'test-listen'
import request from 'request-promise'
import clients from '../client'
import fixtures from './fixtures/'

test.beforeEach(async t => {
  let srv = micro(clients)
  t.context.url = await listen(srv)
})

test('GET /', async t => {
  let clients = fixtures.getClients()
  let url = t.context.url
  let body = await request({uri: `${url}/`, json: true})
  t.deepEqual(body, clients)
})
