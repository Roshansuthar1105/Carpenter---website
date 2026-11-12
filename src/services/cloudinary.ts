export interface CloudinaryUploadResult {
  url: string
  secure_url: string
  public_id: string
  format: string
  resource_type: string
  bytes: number
  width?: number
  height?: number
  duration?: number
}

export interface UploadOptions {
  onProgress?: (progress: number) => void
  folder?: string
}

/**
 * Uploads an image or video file directly from the browser to Cloudinary
 * using an unsigned upload preset.
 */
export async function uploadToCloudinary(
  file: File,
  options?: UploadOptions
): Promise<CloudinaryUploadResult> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName) {
    throw new Error('VITE_CLOUDINARY_CLOUD_NAME is not configured in .env')
  }
  if (!uploadPreset) {
    throw new Error('VITE_CLOUDINARY_UPLOAD_PRESET is not configured in .env')
  }

  const isVideo = file.type.startsWith('video/')
  const resourceType = isVideo ? 'video' : 'image'
  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  if (options?.folder) {
    formData.append('folder', options.folder)
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', endpoint)

    if (xhr.upload && options?.onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100)
          options.onProgress?.(percent)
        }
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText) as CloudinaryUploadResult
          resolve(data)
        } catch (err) {
          reject(new Error('Failed to parse Cloudinary response: ' + (err instanceof Error ? err.message : String(err))))
        }
      } else {
        try {
          const errData = JSON.parse(xhr.responseText)
          reject(new Error(errData?.error?.message || `Cloudinary upload failed with status ${xhr.status}`))
        } catch {
          reject(new Error(`Cloudinary upload failed with status ${xhr.status}: ${xhr.statusText}`))
        }
      }
    }

    xhr.onerror = () => {
      reject(new Error('Network error occurred during Cloudinary upload.'))
    }

    xhr.send(formData)
  })
}
