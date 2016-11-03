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

  getInternment () {
    return Promise.resolve(fixtures.getIntern())
  }

  saveInternment () {
    return Promise.resolve(fixtures.getIntern())
  }

  updateInternment (intern) {
    intern = fixtures.getIntern()
    intern.description = 'Changed'
    return Promise.resolve(intern)
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

  getUser (user) {
    return Promise.resolve(fixtures.getUser())
  }

  updateUser (user) {
    user = fixtures.getUser()
    user.password = 'Tinton1212'
    return Promise.resolve(user)
  }

  authenticate () {
    return Promise.resolve(true)
  }

  getInterecord () {
    return Promise.resolve(fixtures.getInteRecord())
  }

  saveInterecord () {
    let inter = fixtures.getInteRecord()
    return Promise.resolve(inter)
  }

  updateInterecord () {
    let interecord = fixtures.getInteRecord()
    interecord.description = 'Changed'
    return Promise.resolve(interecord)
  }

  getEthnicities () {
    return Promise.resolve(fixtures.getEthni())
  }

  saveEthnicities () {
    return Promise.resolve(fixtures.getEthni())
  }

  updateEthnicities () {
    let ethni = fixtures.getEthni()
    ethni.description = 'Dog 2'
    return Promise.resolve(ethni)
  }

  saveLaboratory () {
    return Promise.resolve(fixtures.getLab())
  }

  updateLaboratory () {
    let lab = fixtures.getLab()
    lab.description = 'Lab y'
    return Promise.resolve(lab)
  }

  getLaboratorys () {
    return Promise.resolve(fixtures.getLab())
  }

  getRaceByEthni () {
    return Promise.resolve(fixtures.getRace())
  }

  updateRace () {
    let rac = fixtures.getRace()
    rac.description = 'Husky 2'
    return Promise.resolve(rac)
  }

  saveRace () {
    return Promise.resolve(fixtures.getRace())
  }

  getPetsByClient () {
    return Promise.resolve(fixtures.getPet())
  }

  getPetImages () {
    return Promise.resolve(fixtures.getPetImg())
  }

  savePet () {
    return Promise.resolve(fixtures.getPet())
  }

  savePetImage () {
    return Promise.resolve(fixtures.getPetImg())
  }
}
