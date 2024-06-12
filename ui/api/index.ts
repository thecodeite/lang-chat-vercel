import express from 'express/index.js'
import Session from 'supertokens-node/recipe/session/index.js'
// // import { verifySession } from 'supertokens-node/recipe/session/framework/express'
import {
  middleware,
  errorHandler,
} from 'supertokens-node/framework/express/index.js'
import '../api-lib/init.js'

export const app = express()

// // app.use(
// //   cors({
// //     origin: websiteDomain, // TODO: Change to your app's website domain
// //     allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
// //     methods: ['GET', 'PUT', 'POST', 'DELETE'],
// //     credentials: true,
// //   })
// // )

// //add morgan to log HTTP requests
// // app.use(morgan('dev'))
// // app.use(
// //   helmet({
// //     contentSecurityPolicy: false,
// //   })
// // )
app.use(middleware())

// // An example API that requires session verification
// // app.get('/api/sessioninfo', verifySession(), async (req, res) => {
// //   let session = req.session
// //   res.send({
// //     sessionHandle: session.getHandle(),
// //     userId: session.getUserId(),
// //     accessTokenPayload: session.getAccessTokenPayload(),
// //   })
// // })

app.get('/hello', async (req, res) => {
  return res.send('Hello, World!')
})
app.get('/api/hello', async (req, res) => {
  // console.log(req.headers)
  const session = await Session.getSession(req, res)
  const userId = session.getUserId()

  return res.status(200).json({ userId })

  res.send('Hello, World!')
})

// app.get('/api/auth', (req, res) => {
//   res.send('auth root')
// })
// app.get('/api/auth/deep', (req, res) => {
//   res.send('auth deep')
// })

app.get('/api', (req, res) => {
  res.send('API root')
})

app.use((req, res) => {
  console.log(req.url)
  res.status(200).send('Everything is fine')
})

app.use(errorHandler())

app.use((err, req, res) => {
  res.status(500).send('Internal error: ' + err.message)
})

// console.log(app._router.stack)

// app.listen(3002, () => console.log(`API Server listening on port 3002`))

// module.exports = app
export default app
