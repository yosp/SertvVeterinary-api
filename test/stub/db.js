'use strict'

import fixtures from '../fixtures/'

export default class Db {
  connect () {
    return Promise.resolve(true)
  }

  disconnect () {
    return Promise.resolve(true)
  }

  getClientList () {
    return Promise.resolve(fixtures.getClients())
  }

  saveClient () {
    return Promise.resolve(fixtures.getClients())
  }

  getClientByPhone () {
    return Promise.resolve(fixtures.getClients())
  }

  getClientByEmail () {
    return Promise.resolve(fixtures.getClients())
  }

  updateClient () {
    let client = fixtures.getClients()
    client.phone = '809-414-8434'
    return Promise.resolve(fixtures.getClients())
  }
}
