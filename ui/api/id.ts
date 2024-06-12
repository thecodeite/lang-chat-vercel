import { makeId } from './_st/make-id.js'

export default async function handler(req, res) {
  res.send({ id: makeId() })
}
