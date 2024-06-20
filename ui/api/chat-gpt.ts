import OpenAI from 'openai'
import { sql } from '@vercel/postgres'
import { VercelRequest, VercelResponse } from '@vercel/node'

import '../api-lib/init.js'
import { getUserId } from '../api-lib/get-user-id.js'

const openai = new OpenAI()

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const userId = await getUserId(request, response)

  const chatId = request.query.id as string
  const userMessage = request.body

  const result =
    await sql`SELECT * FROM chats WHERE owner = ${userId} AND id = ${chatId};`

  const chats = result.rows

  if (chats.length === 0) {
    return response.status(404).json({ message: 'Chat not found' })
  }

  const chat = chats[0].chat.filter(
    (message) => message.content !== undefined && message.content !== '',
  )

  console.log('userMessage:', userMessage)
  if (userMessage === '' || userMessage === undefined || userMessage === null) {
    return response.status(400).json({ message: 'Empty message' })
  }

  const newChat = [...chat, { role: 'user', content: userMessage }]

  //   await sql`
  //   UPDATE chats
  //   SET chat = ${JSON.stringify(newChat)}
  //   WHERE owner = ${userId} AND id = ${chatId};
  // `

  const truncatedChat = newChat.filter((c) => c.role !== 'teacher').slice(-6)

  const instructions = chats[0].instructions

  const messages = [
    {
      role: 'system',
      content: instructions,
      // content: `You are a very busy business person who has been interrupted by this chat.
      // You are very impatient and want to get back to work as soon as possible but need to make sure the user is happy first before you can do so.
      // As the chat goes on, you will become more and more impatient and rude.`,
      // content: `You are an over enthusiastic sales person very desperate to make a sale and you will do or say anything to make the user buy your product.
      // You are willing to lie and make things up to get the sale.
      // If the sale is not going well, try to make the user feel guilty for not buying.`,
      // content: `You have a split personality and will switch between two different personalities every message.
      // If you were rude in the last message, be nice in this one. If you were nice in the last message, be rude in this one.
      // It the user makes grammatical errors, correct them.`,
      // content: `You are an obnoxious individual who will deride everything the user says and insult the way they talk.
      //    Then continue the conversation by asking a follow up question.
      //    If the user is rude to you, be even ruder back.`,
    },
    ...truncatedChat,
  ]

  const openAiRequest: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming =
    {
      messages,
      model: 'gpt-4o',
    }

  console.log('openAiRequest:', openAiRequest)

  const completion = await openai.chat.completions.create(openAiRequest)

  console.log('completion:', completion)

  const chatResponse = completion.choices[0].message.content

  const teacherInstructions = `
  If the user makes no spelling or grammar mistakes, say "Ok" and do not respond further.
  You are a language teacher who is testing the user who is learning English. 
  If they make a mistake, correct them and explain why.
  If they use a word you think they don't know, explain it to them.
  The user should be using business English so point out any mistakes they make.
  Do not ask follow up questions.`

  const teacherMessages = [
    {
      role: 'system',
      content: teacherInstructions,
    },
    ...truncatedChat,
  ]

  const openAiRequest2: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming =
    {
      messages: teacherMessages,
      model: 'gpt-4o',
    }

  const completion2 = await openai.chat.completions.create(openAiRequest2)

  const teacherResponse = completion2.choices[0].message.content

  const newChat2 = [
    ...newChat,
    { role: 'teacher', content: teacherResponse },
    { role: 'assistant', content: chatResponse },
  ]

  await sql`
  UPDATE chats
  SET chat = ${JSON.stringify(newChat2)}
  WHERE owner = ${userId} AND id = ${chatId};`

  console.log(messages)
  return response.status(200).send({ chatResponse, teacherResponse })
}
