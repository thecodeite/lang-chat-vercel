import { sql } from '@vercel/postgres'
import { VercelRequest, VercelResponse } from '@vercel/node'

import '../api-lib/init.js'
import { getUserId } from '../api-lib/get-user-id.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = await getUserId(req, res)

  const result = await sql`SELECT * FROM chats WHERE Owner = ${userId};`

  const chats = result.rows

  return res.status(200).json({ chats })
}
