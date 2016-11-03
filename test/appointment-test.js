import test from 'ava'
import micro from 'micro'
import listen from 'test-listen'
import request from 'request-promise'
import appointment from '../appointment'
import fixtures from './fixtures'
import utils from '../lib/utils'
import config from '../config'

test.beforeEach(async t => {
  let srv = micro(appointment)
  t.context.url = await listen(srv)
})

test('GET /', async t => {
  let appoint = fixtures.getAppoint()
  let url = t.context.url
  let body = await request({uri: url, json: true})
  t.deepEqual(body, appoint)
})

test('GET /:petid', async t => {
  let appoint = fixtures.getAppoint()
  let url = t.context.url
  let body = await request({uri: `${url}/${appoint.petid}`, json: true})
  t.deepEqual(body, appoint)
})

test('POST /', async t => {
  let appoint = fixtures.getAppoint()
  let url = t.context.url
  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      id: appoint.id,
      appointmentDate: appoint.appointmentDate,
      status: appoint.status
    },
    resolveWithFullResponse: true
  }

  let response = await request(options)

  t.deepEqual(response.body, appoint)
  t.is(response.statusCode, 201)
})

test('POST /update', async t => {
  let appoint = fixtures.getAppoint()
  let url = t.context.url
  let token = await utils.signToken({apid: appoint.id}, config.secret)
  appoint.description = 'Vacunacion antirabico'
  let options = {
    method: 'POST',
    uri: `${url}/update`,
    json: true,
    body: {
      id: appoint.id,
      appointmentDate: appoint.appointmentDate,
      status: appoint.status
    },
    headers: {
      'Authorization': `Bearer ${token}`
    },
    resolveWithFullResponse: true
  }
  let response = await request(options)

  t.deepEqual(response.body, appoint)
  t.is(response.statusCode, 201)
})
