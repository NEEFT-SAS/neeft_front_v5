import type {
  FeedApi,
  FeedCreateCommentInput,
  FeedCreatePostInput,
  FeedEnvelope,
  FeedListParams,
  FeedPostComment,
  FeedPostItem
} from '~/components/app/feed/types'
import { createAuthenticatedApi } from '~/utils/createAuthenticatedApi'

const normalizePagination = <TData>(response: FeedEnvelope<TData>): FeedEnvelope<TData> => {
  return {
    data: response.data,
    pagination: response.pagination ?? response.meta?.pagination
  }
}

export default defineNuxtPlugin(() => {
  const auth = useAuth()
  const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl
  const api = createAuthenticatedApi(apiBaseUrl, auth.token, { unwrapData: false })

  const getFeed = async (type: 'DISCOVER' | 'FOLLOWING', params: FeedListParams = {}) => {
    const response = await api<FeedEnvelope<FeedPostItem[]>>('/feed', {
      method: 'GET',
      query: {
        type,
        limit: params.limit,
        offset: params.offset,
        gameId: params.gameId,
        authorType: params.authorType
      },
      cache: 'no-store'
    })

    return normalizePagination(response)
  }

  const feedAPI: FeedApi = {
    getGeneralFeed: async (params = {}) => {
      return await getFeed('DISCOVER', params)
    },

    getFollowingFeed: async (params = {}) => {
      return await getFeed('FOLLOWING', params)
    },

    createPost: async (payload: FeedCreatePostInput) => {
      return await api<FeedEnvelope<FeedPostItem>>('/feed/post', {
        method: 'POST',
        body: {
          content: payload.content,
          gameId: payload.gameId ?? null,
          medias: payload.medias ?? [],
          authorType: payload.authorType ?? 'PLAYER',
          authorSlug: payload.authorSlug ?? ''
        },
        cache: 'no-store'
      })
    },

    toggleLike: async (postId: string) => {
      return await api<FeedEnvelope<{ liked: boolean }>>(`/feed/post/${encodeURIComponent(postId)}/like`, {
        method: 'POST',
        cache: 'no-store'
      })
    },

    fetchComments: async (postId: string, params = {}) => {
      return await api<FeedEnvelope<FeedPostComment[]>>(`/feed/post/${encodeURIComponent(postId)}/comments`, {
        method: 'GET',
        query: {
          limit: params.limit,
          offset: params.offset
        },
        cache: 'no-store'
      })
    },

    createComment: async (postId: string, payload: FeedCreateCommentInput) => {
      return await api<FeedEnvelope<FeedPostComment>>(`/feed/post/${encodeURIComponent(postId)}/comments`, {
        method: 'POST',
        body: payload,
        cache: 'no-store'
      })
    },

    deleteComment: async (postId: string, commentId: string) => {
      return await api<FeedEnvelope<{ deleted: boolean }>>(`/feed/post/${encodeURIComponent(postId)}/comments/${encodeURIComponent(commentId)}`, {
        method: 'DELETE',
        cache: 'no-store'
      })
    }
  }

  return {
    provide: {
      feedAPI
    }
  }
})

declare module '#app' {
  interface NuxtApp {
    $feedAPI: FeedApi
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $feedAPI: FeedApi
  }
}
