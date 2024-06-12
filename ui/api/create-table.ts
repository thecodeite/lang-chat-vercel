import { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from '@vercel/postgres'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // return response.status(200).json({ message: process.env.POSTGRES_HOST })
  try {
    const result =
      await sql`CREATE TABLE chats ( Owner varchar(255), Created timestamp,  Summary varchar(255), Chat text );`
    return response.status(200).json({ result })
  } catch (error) {
    return response.status(500).json({ error })
  }
}
