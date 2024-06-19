import Session from 'supertokens-node/recipe/session/index.js'
import { sql } from '@vercel/postgres'
import { VercelRequest, VercelResponse } from '@vercel/node'
import UserRoles, {
  UserRoleClaim,
} from 'supertokens-node/recipe/userroles/index.js'

import '../../api-lib/init.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { name, code } = req.query as { name?: string; code?: string }

  if (!name) {
    return res
      .status(400)
      .json([{ formElement: 'name', errorMessage: 'Name is required' }])
  }

  if (!code) {
    return res
      .status(400)
      .json([{ formElement: 'code', errorMessage: 'Code is required' }])
  }

  // test if code is valid and redeem it, for now check it starts with LC
  if (!code.startsWith('LC')) {
    const result = [{ formElement: 'code', errorMessage: 'Invalid code' }]
    return res.status(200).json(result)
  }

  const session = await Session.getSession(req, res)
  const userId = session.getUserId()

  if (!userId) {
    return res
      .status(400)
      .json([{ formElement: ':global', errorMessage: 'Not logged in' }])
  }

  const result = await sql`SELECT * FROM users WHERE id = ${userId};`

  if (result.rows.length === 0) {
    await sql`INSERT INTO users (id, name, code) VALUES (${userId}, ${name}, ${code});`
  } else {
    await sql`UPDATE users SET name = ${name}, code = ${code} WHERE id = ${userId};`
  }

  const response = await UserRoles.addRoleToUser('public', userId, 'hasDetails')

  if (response.status === 'UNKNOWN_ROLE_ERROR') {
    // No such role exists
    return res.status(500).json([])
  }

  if (response.didUserAlreadyHaveRole === true) {
    // The user already had the role
    // that's fine
  }

  await session.fetchAndSetClaim(UserRoleClaim)

  return res.status(200).json([])
}
