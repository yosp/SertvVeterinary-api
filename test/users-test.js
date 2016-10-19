import test from 'ava'
import micro from 'micro'
import listen from 'test-listen'
import request from 'request-promise'
import users from '../users'
import fixtures from './fixtures'

test.beforeEach(async t => {
  let srv = micro(users)
  t.context.url = await listen(srv)
})

test('POST /', async t => {
  let user = fixtures.getUser()
  let url = t.context.url

  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      username: user.username,
      fullname: user.fullname,
      password: user.password,
      email: user.email
    },
    resolveWithFullResponse: true
  }

  let response = await request(options)

  delete user.email
  delete user.password

  t.is(response.statusCode, 200)
  t.deepEqual(response.body, user)
})

test('post /:username', async t => {
  let user = fixtures.getUser()
  let url = t.context.url

  user.password = 'Tinton1212'
  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      username: user.username,
      fullname: user.fullname,
      password: user.password,
      email: user.email
    },
    resolveWithFullResponse: true
  }

  let response = await request(options)

  delete user.password
  delete user.email

  t.deepEqual(response, user)
})
