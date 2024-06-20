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
          res.status(401).json({ message: 'Unauthorized' })
          throw new Error('Unauthorized')
        }
        await Session.refreshSession(req, res)
        return getUserId(req, res, true)
      } else if (err.type === Session.Error.UNAUTHORISED) {
        res.status(401).json({ message: 'Unauthorized' })
        throw new Error('Unauthorized')
      } else if (err.type === Session.Error.INVALID_CLAIMS) {
        // The user is missing some required claim.
        // You can pass the missing claims to the frontend and handle it there. Send a 403 to the frontend.
      }
    } else {
      console.error(err)
    }
    throw new Error('Internal Server Error')
  }
}
