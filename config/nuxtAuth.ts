import { apiBaseUrl } from './env'

export const nuxtAuthConfig = {
  isEnabled: true,
  baseURL: `${apiBaseUrl}/auth`,
  globalAppMiddleware: false,
  provider: {
    type: 'local',
    endpoints: {
      signIn: { path: 'login', method: 'post' },
      signUp: { path: 'register', method: 'post' },
      signOut: false,
      getSession: { path: 'session', method: 'get' }
    },
    refresh: {
      isEnabled: false,
      endpoint: { path: 'auth/refresh', method: 'get' },
      token: {
        signInResponseRefreshTokenPointer: '/data/refresh_token',
        cookieName: 'auth.refresh.token'
      }
    },
    token: {
      signInResponseTokenPointer: '/data/access_token',
      type: 'Bearer',
      cookieName: 'auth.token',
      headerName: 'Authorization',
      maxAgeInSeconds: 2592000,
      sameSiteAttribute: 'lax',
      cookieDomain: '',
      secureCookieAttribute: false,
      httpOnlyCookieAttribute: false
    },
    session: {
      dataType: {
        credentialsId: 'string',
        profileId: 'string',
        email: 'string',
        username: 'string',
        slug: 'string',
        status: 'active | suspended'
      },
      dataResponsePointer: '/'
    }
  }
}
