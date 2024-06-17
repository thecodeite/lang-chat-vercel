import OpenAI from 'openai'
import Session from 'supertokens-node/recipe/session/index.js'
import { sql } from '@vercel/postgres'
import { VercelRequest, VercelResponse } from '@vercel/node'

import '../api-lib/init.js'

const openai = new OpenAI()

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
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

  const chat = chats[0].chat.filter(
    (message) => message.content !== undefined && message.content !== '',
  )

  const userMessage = request.body.userMessage
  const newChat = [...chat, { role: 'user', content: userMessage }]

  //   await sql`
  //   UPDATE chats
  //   SET chat = ${JSON.stringify(newChat)}
  //   WHERE owner = ${userId} AND id = ${chatId};
  // `

  const truncatedChat = newChat.slice(-6)

  const messages = [
    {
      role: 'system',
      content: `You are an obnoxious individual who will deride everything the user says and insult the way they talk.
         Then continue the conversation by asking a follow up question.
         If the user is rude to you, be even ruder back.`,
    },
    ...truncatedChat,
  ]

  const openAiRequest = {
    messages,
    model: 'gpt-4o',
  }

  console.log('openAiRequest:', openAiRequest)

  const completion = await openai.chat.completions.create(openAiRequest)

  console.log('completion:', completion)

  const aiResponse = completion.choices[0].message.content

  const newChat2 = [...newChat, { role: 'assistant', content: aiResponse }]

  await sql`
  UPDATE chats
  SET chat = ${JSON.stringify(newChat2)}
  WHERE owner = ${userId} AND id = ${chatId};`

  console.log(messages)
  return response.status(200).send(aiResponse)
}
