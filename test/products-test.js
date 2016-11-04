import test from 'ava'
import micro from 'micro'
import listen from 'test-listen'
import request from 'request-promise'
import products from '../products'
import fixtures from './fixtures'
import utils from '../lib/utils'
import config from '../config'

test.beforeEach(async t => {
  let srv = micro(products)
  t.context.url = await listen(srv)
})

test('GET /:product', async t => {
  let pr = fixtures.getProduct()
  let url = t.context.url
  let body = await request({uri: `${url}/${pr.description}`, json: true})
  t.deepEqual(body, pr)
})

test('POST /', async t => {
  let pr = fixtures.getProduct()
  let url = t.context.url
  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      id: pr.id,
      description: pr.description,
      stock: pr.stock,
      cost: pr.cost,
      price: pr.price
    },
    resolveWithFullResponse: true
  }

  let response = await request(options)

  t.deepEqual(response.body, pr)
  t.is(response.statusCode, 201)
})

test('POST /update', async t => {
  let pr = fixtures.getProduct()
  let url = t.context.url
  let token = await utils.signToken({prodid: pr.id}, config.secret)
  pr.cost = 30
  let options = {
    method: 'POST',
    uri: `${url}/update`,
    json: true,
    body: {
      id: pr.id,
      description: pr.description,
      stock: pr.stock,
      cost: pr.cost,
      price: pr.price
    },
    headers: {
      'Authorization': `Bearer ${token}`
    },
    resolveWithFullResponse: true
  }
  let response = await request(options)

  t.deepEqual(response.body, pr)
  t.is(response.statusCode, 201)
})
