import Session from 'supertokens-node/recipe/session/index.js'
import supertokens from 'supertokens-node'
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
  // debug: true,
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
    EmailVerification.init({ mode: 'OPTIONAL' }),
    EmailPassword.init(),
    Session.init(),
    Dashboard.init(),
  ],
})
