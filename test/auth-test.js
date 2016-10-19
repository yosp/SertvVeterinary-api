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
