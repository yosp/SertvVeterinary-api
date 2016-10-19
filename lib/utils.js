import jwt from 'jsonwebtoken'
import bearer from 'token-extractor'

export default {
  async singToken (payload, secret, options) {
    return new Promise((resolve, reject) => {
      jwt.sing(payload, secret, options, (err, token) => {
        if (err) return reject(err)

        return resolve(token)
      })
    })
  },

  async veryfyToken (token, secret, options) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, options, (err, decoded) => {
        if (err) return reject(err)

        return resolve(decoded)
      })
    })
  },

  async extractToken (req) {
    return new Promise((resolve, reject) => {
      bearer(req, (err, token) => {
        if (err) return reject(err)

        return resolve(token)
      })
    })
  }
}
