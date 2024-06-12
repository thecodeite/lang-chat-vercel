import Session from 'supertokens-node/recipe/session/index.js'
import { sql } from '@vercel/postgres'
import { VercelRequest, VercelResponse } from '@vercel/node'

import './_st/init.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const session = await Session.getSession(req, res)
  const userId = session.getUserId()

  const chatId = req.query.id as string

  const result =
    await sql`SELECT * FROM chats WHERE owner = ${userId} AND id = ${chatId};`

  const chats = result.rows

  if (chats.length === 0) {
    return res.status(404).json({ message: 'Chat not found' })
  } else {
    return res.status(200).json(chats[0])
  }
}
