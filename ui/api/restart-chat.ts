import Session from 'supertokens-node/recipe/session/index.js'
import { sql } from '@vercel/postgres'
import { VercelRequest, VercelResponse } from '@vercel/node'

import './_st/init.js'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const session = await Session.getSession(request, response)
  const userId = session.getUserId()

  const chatId = request.query.id as string

  const result =
    await sql`SELECT * FROM chats WHERE owner = ${userId} AND id = ${chatId};`

  const chats = result.rows

  if (chats.length === 0) {
    return response.status(404).json({ message: 'Chat not found' })
  }

  const newChat = [{ role: 'assistant', content: chats[0].summary }]

  await sql`
    UPDATE chats
    SET chat = ${JSON.stringify(newChat)}
    WHERE owner = ${userId} AND id = ${chatId};
`

  const r =
    await sql`SELECT * FROM chats WHERE owner = ${userId} AND id = ${chatId};`

  if (r.rows.length === 0) {
    return response.status(404).json({ message: 'Chat not found' })
  } else {
    return response.status(200).json(result.rows[0])
  }
}
