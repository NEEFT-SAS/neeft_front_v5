import { computed, readonly, ref } from 'vue'
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject, type FirebaseStorage } from 'firebase/storage'
import { useNuxtApp } from '#app'

export type UploadProgress = {
  fileName: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  downloadUrl?: string
  path?: string
}

type MarketplaceServiceMediaInput = {
  file: File
  serviceName: string
  target: 'banner' | 'gallery'
  index?: number
}

const sanitizePathSegment = (value: string) => {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const resolveExtension = (file: File) => {
  const byType: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/avif': 'avif'
  }

  if (byType[file.type]) return byType[file.type]

  const nameExtension = file.name.split('.').pop()?.toLowerCase()
  return nameExtension || 'bin'
}

const createUploadId = () => {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

const resolveErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) return error.message
  return 'Erreur inconnue pendant l upload.'
}

const ensureStorage = (storage: FirebaseStorage | null | undefined) => {
  if (storage) return storage
  throw new Error('Firebase Storage n est pas configure.')
}

export function useFirebaseUpload() {
  const { $fireStorage } = useNuxtApp() as { $fireStorage?: FirebaseStorage | null }
  const uploads = ref<Map<string, UploadProgress>>(new Map())
  const isUploading = ref(false)
  const isConfigured = computed(() => Boolean($fireStorage))

  const refreshUploadingState = () => {
    isUploading.value = Array.from(uploads.value.values()).some(entry => entry.status === 'uploading')
  }

  const setUploadState = (key: string, patch: UploadProgress) => {
    uploads.value.set(key, patch)
    refreshUploadingState()
  }

  const uploadFileToPath = async (file: File, path: string): Promise<string> => {
    if (!file) {
      throw new Error('Aucun fichier a uploader.')
    }

    const storage = ensureStorage($fireStorage)
    const uploadKey = `${path}:${createUploadId()}`
    const fileRef = storageRef(storage, path)

    setUploadState(uploadKey, {
      fileName: file.name,
      progress: 0,
      status: 'uploading',
      path
    })

    try {
      const task = uploadBytesResumable(fileRef, file, { contentType: file.type })

      const downloadUrl = await new Promise<string>((resolve, reject) => {
        task.on(
          'state_changed',
          (snapshot) => {
            const progress = snapshot.totalBytes > 0
              ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
              : 0

            setUploadState(uploadKey, {
              fileName: file.name,
              progress,
              status: 'uploading',
              path
            })
          },
          error => reject(error),
          async () => {
            const url = await getDownloadURL(task.snapshot.ref)
            resolve(url)
          }
        )
      })

      setUploadState(uploadKey, {
        fileName: file.name,
        progress: 100,
        status: 'success',
        path,
        downloadUrl
      })

      return downloadUrl
    } catch (error) {
      const message = resolveErrorMessage(error)
      setUploadState(uploadKey, {
        fileName: file.name,
        progress: 0,
        status: 'error',
        path,
        error: message
      })
      throw new Error(message)
    }
  }

  const uploadMarketplaceServiceImage = async ({ file, serviceName, target, index = 0 }: MarketplaceServiceMediaInput) => {
    const safeServiceName = sanitizePathSegment(serviceName) || 'service'
    const safeTarget = target === 'gallery' ? `gallery-${index + 1}` : 'banner'
    const extension = resolveExtension(file)
    const path = `marketplace/services/${safeServiceName}/${safeTarget}-${createUploadId()}.${extension}`
    return await uploadFileToPath(file, path)
  }

  const uploadMarketplaceOrderFile = async (orderId: string, file: File) => {
    const safeOrderId = sanitizePathSegment(orderId) || 'order'
    const safeName = sanitizePathSegment(file.name.replace(/\.[^.]+$/, '')) || 'file'
    const extension = resolveExtension(file)
    const path = `marketplace/orders/${safeOrderId}/deliveries/${safeName}-${createUploadId()}.${extension}`
    return await uploadFileToPath(file, path)
  }

  const deleteFileByUrl = async (downloadUrl: string): Promise<void> => {
    const storage = ensureStorage($fireStorage)
    const fileRef = storageRef(storage, downloadUrl)
    await deleteObject(fileRef)
  }

  const clearUploads = () => {
    uploads.value.clear()
    isUploading.value = false
  }

  return {
    uploads: readonly(uploads),
    isUploading: readonly(isUploading),
    isConfigured,
    uploadFileToPath,
    uploadMarketplaceServiceImage,
    uploadMarketplaceOrderFile,
    deleteFileByUrl,
    clearUploads
  }
}
