import test from 'ava'
import micro from 'micro'
import listen from 'test-listen'
import request from 'request-promise'
import pet from '../pet'
import fixtures from './fixtures'
import utils from '../lib/utils'
import config from '../config'

test.beforeEach(async t => {
  let srv = micro(pet)
  t.context.url = await listen(srv)
})

test('GET /:clientid', async t => {
  let pt = fixtures.getPet()
  let url = t.context.url
  let body = await request({uri: `${url}/${pt.clientid}`, json: true})
  t.deepEqual(body, pt)
})

test('GET /petimage/:petid', async t => {
  let pt = fixtures.getPetImg()
  let url = t.context.url
  let body = await request({uri: `${url}/petimage/${pt.clientid}`, json: true})
  t.deepEqual(body, pt)
})

test('POST /', async t => {
  let pt = fixtures.getPet()
  let url = t.context.url
  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      id: pt.id,
      fullname: pt.fullname,
      sex: pt.sex,
      color: pt.color,
      borndate: pt.borndate,
      weight: pt.weight,
      alive: pt.alive
    },
    resolveWithFullResponse: true
  }

  let response = await request(options)

  t.deepEqual(response.body, pt)
  t.is(response.statusCode, 201)
})

test('POST /petimage', async t => {
  let pti = fixtures.getPetImg()
  let url = t.context.url
  let token = await utils.signToken({petid: pti.id}, config.secret)
  let options = {
    method: 'POST',
    uri: `${url}/petimage`,
    json: true,
    body: {
      id: pti.id,
      petid: pti.petid,
      url: pti.url
    },
    headers: {
      'Authorization': `Bearer ${token}`
    },
    resolveWithFullResponse: true
  }
  let response = await request(options)

  t.deepEqual(response.body, pti)
  t.is(response.statusCode, 201)
})
