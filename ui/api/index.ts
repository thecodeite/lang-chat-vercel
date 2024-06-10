import express from 'express/index.js'
import supertokens from 'supertokens-node'
import Session from 'supertokens-node/recipe/session/index.js'
// // import { verifySession } from 'supertokens-node/recipe/session/framework/express'
import {
  middleware,
  errorHandler,
} from 'supertokens-node/framework/express/index.js'
import EmailPassword from 'supertokens-node/recipe/emailpassword/index.js'
import EmailVerification from 'supertokens-node/recipe/emailverification/index.js'
import Dashboard from 'supertokens-node/recipe/dashboard/index.js'

const apiDomain =
  process.env.VERCEL_URL !== undefined
    ? process.env.VERCEL_URL
    : `https://lang-chat.local.plews.uk`
const websiteDomain =
  process.env.VERCEL_URL !== undefined
    ? process.env.VERCEL_URL
    : `https://lang-chat.local.plews.uk`

supertokens.init({
  framework: 'express',
  supertokens: {
    connectionURI: process.env.SUPERTOKENS__CONNECTION_URL,
    apiKey: process.env.SUPERTOKENS__API_KEY,
  },
  appInfo: {
    appName: 'Lang Chat Vercel',
    apiDomain,
    websiteDomain,
    apiBasePath: '/api/auth',
    websiteBasePath: '/',
  },
  recipeList: [
    EmailVerification.init({ mode: 'REQUIRED' }),
    EmailPassword.init(),
    Session.init(),
    Dashboard.init(),
  ],
})

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

app.get('/api/hello', (req, res) => {
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
