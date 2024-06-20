import UserRoles from 'supertokens-node/recipe/userroles/index.js'
import Session from 'supertokens-node/recipe/session/index.js'
import { sql } from '@vercel/postgres'
import { VercelRequest, VercelResponse } from '@vercel/node'

import '../api-lib/init.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const session = await Session.getSession(req, res)
  const roles = await session.getClaimValue(UserRoles.UserRoleClaim)

  console.log('roles:', roles)
  if (roles === undefined || !roles.includes('admin')) {
    // this error tells SuperTokens to return a 403 to the frontend.
    return res.status(403).json({ message: 'Forbidden' })
  }

  const result =
    await sql`SELECT chats.id as id, owner, created, summary, instructions, name
    FROM chats
    LEFT JOIN users ON chats.owner = users.id
    ORDER BY created DESC
  ;`

  const chats = result.rows

  return res.status(200).json(chats)
}
