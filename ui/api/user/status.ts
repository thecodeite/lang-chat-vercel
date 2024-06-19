import Session from 'supertokens-node/recipe/session/index.js'
import UserRoles from 'supertokens-node/recipe/userroles/index.js'
import { sql } from '@vercel/postgres'
import { VercelRequest, VercelResponse } from '@vercel/node'

import '../../api-lib/init.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const session = await Session.getSession(req, res)
  const userId = session.getUserId()

  const result = await sql`SELECT * FROM users WHERE id = ${userId};`

  const roles = await UserRoles.removeUserRole('public', userId, 'hasDetails')

  return res.status(200).json({ result, roles })
}
