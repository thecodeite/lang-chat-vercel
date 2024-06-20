import UserRoles from 'supertokens-node/recipe/userroles/index.js'
import Session from 'supertokens-node/recipe/session/index.js'
import { sql } from '@vercel/postgres'
import { VercelRequest, VercelResponse } from '@vercel/node'

import '../api-lib/init.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const session = await Session.getSession(req, res)
  const roles = await session.getClaimValue(UserRoles.UserRoleClaim)

  if (roles === undefined || !roles.includes('admin')) {
    // this error tells SuperTokens to return a 403 to the frontend.
    return res.status(403).json({ message: 'Forbidden' })
  }

  const { id, field } = req.query

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Bad request' })
  }

  if (
    typeof field !== 'string' ||
    !['summary', 'instructions'].includes(field)
  ) {
    return res.status(400).json({ message: 'Bad request' })
  }

  console.log('id:', id)
  console.log('req.body:', req.body)

  if (field === 'summary') {
    const updateResult = await sql`
      UPDATE chats
      SET summary = ${req.body}
      WHERE id = ${id}
    ;`
    console.log('updateResult:', updateResult)
    return res.status(200).send('OK')
  }

  if (field === 'instructions') {
    await sql`UPDATE chats
      SET instructions = ${req.body}
      WHERE id = ${id}
    ;`
    return res.status(200).send('OK')
  }

  return res.status(400).json({ message: 'Bad request' })
}
