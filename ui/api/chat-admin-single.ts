import UserRoles from 'supertokens-node/recipe/userroles/index.js'
import Session from 'supertokens-node/recipe/session/index.js'
import { sql } from '@vercel/postgres'
import { VercelRequest, VercelResponse } from '@vercel/node'

import '../api-lib/init.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const session = await Session.getSession(req, res)
  const roles = await session.getClaimValue(UserRoles.UserRoleClaim)

  if (roles === undefined || !roles.includes('admin')) {
    // this error tells SuperTokens to return a 403 to the frontend.
    return res.status(403).json({ message: 'Forbidden' })
  }

  const id = req.query.id

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Bad request' })
  }

  const result = await sql`SELECT chats.*, users.name
    FROM chats
    LEFT JOIN users ON chats.owner = users.id
    WHERE chats.id = ${id}
  ;`

  const chat = result.rows[0]

  return res.status(200).json(chat)
}
