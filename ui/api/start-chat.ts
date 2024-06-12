import { sql } from '@vercel/postgres'
import Session from 'supertokens-node/recipe/session/index.js'

import './_st/init.js'

import { VercelRequest, VercelResponse } from '@vercel/node'
import { makeId } from './_st/make-id.js'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const session = await Session.getSession(request, response)
  const userId = session.getUserId()

  const promptsResult = await sql`SELECT * FROM prompts`
  const prompts = promptsResult.rows
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)]
    .prompt as string

  const id = makeId()
  const created = new Date().toISOString()
  const summary = randomPrompt
  const chat = JSON.stringify([
    {
      role: 'assistant',
      content: randomPrompt,
    },
  ])
  try {
    await sql`
    INSERT INTO chats  (id, owner, created, summary, chat) 
    VALUES (${id}, ${userId}, ${created}, ${summary}, ${chat});`
  } catch (error) {
    return response.status(500).json({ error })
  }

  const chats = await sql`SELECT * FROM chats WHERE id=${id};`
  return response.status(200).json({ chat: chats.rows[0] })
}
