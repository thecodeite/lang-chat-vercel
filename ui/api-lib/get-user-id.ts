import Session from 'supertokens-node/recipe/session/index.js'
import { VercelRequest, VercelResponse } from '@vercel/node'
import { Error as SuperTokensError } from 'supertokens-node'

export async function getUserId(
  req: VercelRequest,
  res: VercelResponse,
  doNotRefresh?: boolean,
): Promise<string> {
  try {
    const session = await Session.getSession(req, res)
    const userId = session.getUserId()
    return userId
  } catch (err) {
    if (SuperTokensError.isErrorFromSuperTokens(err)) {
      if (err.type === Session.Error.TRY_REFRESH_TOKEN) {
        if (doNotRefresh) {
          res.status(401).json({ message: 'Tried to refresh but failed' })
          return
        }
        await Session.refreshSession(req, res)
        return getUserId(req, res, true)
      } else if (err.type === Session.Error.UNAUTHORISED) {
        res.status(401).json({ message: 'Unauthorized' })
        return
      } else if (err.type === Session.Error.INVALID_CLAIMS) {
        res.status(401).json({ message: 'Invalid claims' })
        return
      }
    } else {
      console.error(err)
    }
  }
}
