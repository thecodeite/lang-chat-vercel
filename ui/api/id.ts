import { makeId } from '../api-lib/make-id.js'
import { test } from '../api-lib/test.js'

export default async function handler(req, res) {
  res.send({ id: makeId(), test: test() })
}
