import test from 'ava'
import micro from 'micro'
import listen from 'test-listen'
import request from 'request-promise'
import billdetail from '../billdetail'
import fixtures from './fixtures'
import utils from '../lib/utils'
import config from '../config'

test.beforeEach(async t => {
  let srv = micro(billdetail)
  t.context.url = await listen(srv)
})

test('GET /:billid', async t => {
  let bld = fixtures.billDetail()
  let url = t.context.url
  let body = await request({uri: `${url}/${bld.id}`, json: true})
  t.deepEqual(body, bld)
})

test('POST /', async t => {
  let bld = fixtures.billDetail()
  let url = t.context.url
  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      id: bld.id,
      productId: bld.productId,
      amount: bld.amount,
      unitPrice: bld.unitPrice,
      subPrice: bld.subPrice
    },
    resolveWithFullResponse: true
  }

  let response = await request(options)

  t.deepEqual(response.body, bld)
  t.is(response.statusCode, 201)
})

test('POST /update', async t => {
  let bld = fixtures.billDetail()
  let url = t.context.url
  let token = await utils.signToken({bdid: bld.id}, config.secret)
  bld.unitPrice = '10'
  let options = {
    method: 'POST',
    uri: `${url}/update`,
    json: true,
    body: {
      id: bld.id,
      productId: bld.productId,
      amount: bld.amount,
      unitPrice: bld.unitPrice,
      subPrice: bld.subPrice
    },
    headers: {
      'Authorization': `Bearer ${token}`
    },
    resolveWithFullResponse: true
  }
  let response = await request(options)

  t.deepEqual(response.body, bld)
  t.is(response.statusCode, 201)
})
