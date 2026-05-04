import type {
  UserLoginDto,
  UserRegisteredPresenter,
  UserRegisterRequestDto,
  UserSessionPresenter
} from '@neeft-sas/shared'
import { createAuthenticatedApi } from '~/utils/createAuthenticatedApi'

export default defineNuxtPlugin(() => {
  const auth = useAuth()
  const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl

  const api = createAuthenticatedApi(apiBaseUrl, auth.token)

  const register = async (data: UserRegisterRequestDto) => {
    return await api<UserRegisteredPresenter>('/auth/register', {
      method: 'POST',
      body: data
    })
  }

  const getMySession = async () => {
    return await auth.getSession({ force: true }) as UserSessionPresenter | null
  }

  const login = async (data: UserLoginDto) => {
    try {
      await auth.signIn(
        { email: data.email, password: data.password },
        { redirect: false, callGetSession: false }
      )
    } catch (error: any) {
      throw error?.data ?? error?.response?._data ?? error
    }

    const session = await getMySession()
    if (!session) throw new Error('Login failed')

    return session
  }

  const askPasswordReset = async (email: string) => {
    return await api('/auth/password/reset/ask', {
      method: 'POST',
      body: { email }
    })
  }

  return {
    provide: {
      authAPI: {
        register,
        login,
        getMySession,
        askPasswordReset
      }
    }
  }
})
