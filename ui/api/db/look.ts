// import Session from 'supertokens-node/recipe/session/index.js'
import { QueryResultRow, sql } from '@vercel/postgres'
import { VercelRequest, VercelResponse } from '@vercel/node'

// import '../../api-lib/init.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // const session = await Session.getSession(req, res)
  // const userId = session.getUserId()

  // const tables =
  //   await sql`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname=${'public'};`

  const result = await sql`SELECT *
  FROM information_schema.columns
  WHERE table_schema = 'public'
  ORDER BY ordinal_position;`

  const tables = result.rows.reduce(
    (acc, row) => {
      const table = row.table_name
      if (acc[table] === undefined) {
        acc[table] = []
      }
      acc[table].push(row)
      return acc
    },
    {} as Record<string, QueryResultRow[]>,
  )

  const creates = Object.entries(tables).map(([table, columns]) =>
    toSqlCreate(table, columns),
  )

  return res.status(200).json({ creates, tables })
}

function toSqlCreate(table: string, columns: QueryResultRow[]) {
  return `CREATE TABLE ${table} (${columns.map((col) => `  ${col.column_name} ${col.data_type}`).join(',')});`
}

/*
-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."chats" (
    "id" bpchar NOT NULL,
    "owner" varchar,
    "created" timestamp,
    "summary" varchar,
    "chat" json
);
*/

// function pgTypeToCreateType(row: QueryResultRow) {
//   switch (row.data_type) {
//     case 'character':
//       return 'bpchar'
//     default:
//       return type
//   }
// }
