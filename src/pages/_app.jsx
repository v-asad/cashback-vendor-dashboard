//----------
//  Next Imports
//----------
import Head from 'next/head'
import { Router } from 'next/router'

//----------
//  Store Imports
//----------
import { store } from 'src/store'
import { Provider } from 'react-redux'

//----------
//  Loader Imports
//----------
import NProgress from 'nprogress'

//----------
//  Emotion Imports
//----------
import { CacheProvider } from '@emotion/react'

//----------
//  Local Imports
//----------
import 'src/configs/i18n'
import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig'
import UserLayout from 'src/layouts/UserLayout'
import AclGuard from 'src/@core/components/auth/AclGuard'
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import AuthGuard from 'src/@core/components/auth/AuthGuard'
import GuestGuard from 'src/@core/components/auth/GuestGuard'
import WindowWrapper from 'src/@core/components/window-wrapper'
import Spinner from 'src/@core/components/spinner'
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast'

//----------
//  Other Library Imports
//----------
import { Toaster } from 'react-hot-toast'
import axios from 'axios'

//----------
//  Context
//----------
import { AuthProvider } from 'src/context/AuthContext'

import authConfig from 'src/configs/auth'

//----------
//  Utils
//----------

import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

//----------
//  Prismjs
//----------
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'src/iconify-bundle/icons-bundle-react'

//----------
//  Global CSS Styles
//----------

import '../../styles/globals.css'

const clientSideEmotionCache = createEmotionCache()
// Set application language
if (typeof window !== 'undefined') {
  let setLang = localStorage.localization || process.env.NEXT_PUBLIC_LANG
  localStorage.setItem('localization', setLang)

  var url_string = window.location.href
  var url = new URL(url_string)
  if (url.searchParams.get('__sid') && url.searchParams.get('__uid')) {
    var adminToken = decodeURI(url.searchParams.get('__sid'))
    var user_id = decodeURI(url.searchParams.get('__uid'))
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/controlpanel/vendor/login/${user_id}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      })
      .then(resp => {
        let response = resp.data.data
        const user = {
          id: response.id,
          username: response.username,
          email: response.email,
          name: `${response.first_name} ${response.last_name}`,
          image: response.cmp_logo,
          role: 'ADMIN'
        }

        window.localStorage.setItem(authConfig.storageTokenKeyName, response.accessToken)
        localStorage.setItem('userData', JSON.stringify(user))
        window.location.href = '/dashboard'
      })
      .catch(error => {
        window.location.href = '/login'
      })
  }
}
// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const Guard = ({ children, authGuard, guestGuard }) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
  }
}

// ** Configure JSS & ClassName
const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false

  const getLayout =
    Component.getLayout ?? (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>)
  const setConfig = Component.setConfig ?? undefined
  const authGuard = Component.authGuard ?? true
  const guestGuard = Component.guestGuard ?? false
  const aclAbilities = Component.acl ?? defaultACLObj

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name='viewport' content='initial-scale=1, width=device-width' />
          <title>{`${themeConfig.templateName}`}</title>
          {/* <link rel='shortcut icon' href='' /> */}
        </Head>

        <AuthProvider>
          <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
            <SettingsConsumer>
              {({ settings }) => {
                return (
                  <ThemeComponent settings={settings}>
                    <WindowWrapper>
                      <Guard authGuard={authGuard} guestGuard={guestGuard}>
                        <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard}>
                          {getLayout(<Component {...pageProps} />)}
                        </AclGuard>
                      </Guard>
                    </WindowWrapper>
                    <ReactHotToast>
                      <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                    </ReactHotToast>
                  </ThemeComponent>
                )
              }}
            </SettingsConsumer>
          </SettingsProvider>
        </AuthProvider>
      </CacheProvider>
    </Provider>
  )
}

export default App
