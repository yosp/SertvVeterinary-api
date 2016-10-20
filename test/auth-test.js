import test from 'ava'
import micro from 'micro'
import listen from 'test-listen'
import request from 'request-promise'
import auth from '../auth'
import fixtures from './fixtures'
import config from '../config'
import utils from '../lib/utils'

test.beforeEach(async t => {
  let srv = micro(auth)
  t.context.url = await listen(srv)
})

test('success POST /', async t => {
  let user = fixtures.getUser()
  let url = t.context.url

  let options = {
    method: 'POST',
    uri: url,
    body: {
      username: user.username,
      password: user.password
    },
    json: true
  }

  let token = await request(options)
  let decoder = await utils.verifyToken(token, config.secret)

  t.is(decoder.username, user.username)
})
