import test from 'ava'
import micro from 'micro'
import listen from 'test-listen'
import request from 'request-promise'
import ethnicities from '../ethnicities'
import fixtures from './fixtures'
import utils from '../lib/utils'
import config from '../config'

test.beforeEach(async t => {
  let srv = micro(ethnicities)
  t.context.url = await listen(srv)
})

test('GET /:ethniid', async t => {
  let ethni = fixtures.getEthni()
  let url = t.context.url
  let body = await request({uri: `${url}/${ethni.ethniid}`, json: true})
  t.deepEqual(body, ethni)
})

test('POST /', async t => {
  let ethni = fixtures.getEthni()
  let url = t.context.url
  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      id: ethni.id,
      description: ethni.description
    },
    resolveWithFullResponse: true
  }

  let response = await request(options)

  t.deepEqual(response.body, ethni)
  t.is(response.statusCode, 201)
})

test('POST /update', async t => {
  let ethni = fixtures.getEthni()
  let url = t.context.url
  let token = await utils.signToken({intrecid: ethni.id}, config.secret)
  ethni.description = 'Dog 2'
  let options = {
    method: 'POST',
    uri: `${url}/update`,
    json: true,
    body: {
      id: ethni.id,
      description: ethni.description
    },
    headers: {
      'Authorization': `Bearer ${token}`
    },
    resolveWithFullResponse: true
  }
  let response = await request(options)

  t.deepEqual(response.body, ethni)
  t.is(response.statusCode, 201)
})
