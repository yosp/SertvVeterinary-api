export default {
  getClients () {
    return {
      id: '6a238b19-3ee3-4d5c-acb5-944a3c1fb407',
      fullname: 'Yeison Segura',
      gender: 'Hombre',
      direction: 'Calle 1ra #4',
      email: 'yeisp1011@gmail.com',
      phone: '809-414-8433',
      phone2: '829-926-6545'
    }
  },

  getUser () {
    return {
      id: '6a238b19-3ee3-4d5c-acb5-944a3c1fb407',
      username: 'ysegura',
      fullname: 'Yeison Segura',
      email: 'yeisp1011@gmail.com',
      password: 'Tinton1234'
    }
  },

  getIntern () {
    return {
      id: '6a238b19-3ee3-4d5c-acb5-53432323234',
      petid: '6a238b19-3ee3-4d5c-acb5-944a3c1fb407',
      description: 'Pasiente con fiebre',
      status: 'A'
    }
  },

  getInteRecord () {
    return {
      id: '6a238b19-3ee3-4d5c-acb5-944a3c1f',
      description: 'Vacuna para tratar la fiebre',
      medicineId: 21212,
      internid: '4d5c-acb5-944a3c1fb407'
    }
  },

  getEthni () {
    return {
      id: '6a238b19-3ee3-4d5c-acb5-944a3c1f',
      description: 'Dog'
    }
  },

  getLab () {
    return {
      id: '6a238b19-3ee3-4d5c-acb5-944a3c1f',
      description: 'lab X'
    }
  },

  getRace () {
    return {
      id: '6a238b19-3ee3-4d5c-acb5-944a3c1f',
      description: 'Husky',
      ethniid: '6a238b19-3ee3-4d5c'
    }
  },

  getPet () {
    return {
      id: '6a238b19-3ee3-4d5c-acb5-944a3c1f',
      fullname: 'Eli Segura',
      sex: 'H',
      color: 'Blanco, Gris, Negro',
      borndate: '01/25/2015',
      weight: '45',
      alive: true
    }
  },

  getPetImg () {
    return {
      id: '232121-1212',
      petid: '6a238b19-3ee3-4d5c-acb5-944a3c1f',
      url: 'https://www.google.com.do/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwijrsaeuIvQAhWJ34MKHUlVDm4QjRwIBw&url=http%3A%2F%2Fwww.boredpanda.es%2Finstagram-perros-husky-siberiano-erica-tcogoeva%2F&psig=AFQjCNEOwDgm-jCSqRQgWt8YMObeknqdTQ&ust=1478223038197704'
    }
  },

  getMedicine () {
    return {
      id: '6a238b19-3ee3-4d5c-acb5-944a3c1f',
      labid: '232121-1212',
      description: 'Pulgoso'
    }
  },

  getAppoint () {
    return {
      id: '6a238b19-3ee3-4d5c-acb5-944a3c1f',
      petid: '232121-1212',
      description: 'Vacunacion de parasitos',
      appointmentDate: '07/24/2015',
      status: 'A'
    }
  },

  getAprecord () {
    return {
      id: '6a238b19-3ee3-4d5c-acb5-944a3c1f',
      apid: '232121-1212',
      medicineId: '54654sa5s46a54-a5s4a-as654adassdas45',
      note: 'Blablablablablablablabla'
    }
  },

  getProducts () {
    return {
      id: '6a238b19-3ee3-4d5c-acb5-944a3c1f',
      description: 'Bonabid',
      stock: 8,
      cost: 100,
      price: 180
    }
  }
}
