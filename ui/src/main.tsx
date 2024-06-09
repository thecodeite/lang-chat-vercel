import React from 'react'
import ReactDOM from 'react-dom/client'

import SuperTokens from 'supertokens-web-js'
import Session from 'supertokens-web-js/recipe/session'
import ThirdParty from 'supertokens-web-js/recipe/thirdparty'
import EmailPassword from 'supertokens-web-js/recipe/emailpassword'

import { MainRouter } from './MainRouter.tsx'
import './index.css'

SuperTokens.init({
  appInfo: {
    // apiDomain: 'http://localhost:3001',
    apiDomain: 'https://lang-chat.local.plews.uk',
    // apiDomain: 'https://lang-chat-ggbc.onrender.com',
    apiBasePath: '/auth',
    appName: 'Lang Chat',
  },
  recipeList: [Session.init(), EmailPassword.init(), ThirdParty.init()],
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MainRouter />
  </React.StrictMode>
)
