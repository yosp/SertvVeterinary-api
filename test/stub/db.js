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
    let client = fixtures.getClients()
    return Promise.resolve(client)
  }

  getClient (id) {
    let client = fixtures.getClients()
    return Promise.resolve(client)
  }

  saveClient (client) {
    return Promise.resolve(fixtures.getClients())
  }

  getClientByPhone (phone) {
    return Promise.resolve(fixtures.getClients())
  }

  getClientByEmail (email) {
    return Promise.resolve(fixtures.getClients())
  }

  updateClient (client) {
    client = fixtures.getClients()
    client.phone = '809-414-8434'
    return Promise.resolve(client)
  }

  saveNewUser (user) {
    return Promise.resolve(fixtures.getUser())
  }

  updateUser (user) {
    user = fixtures.getUser()
    user.password = 'Tinton1212'
    return Promise.resolve(user)
  }
}
