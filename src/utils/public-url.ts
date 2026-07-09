const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '')

export function publicUploadUrl(path?: string | null): string {
  if (!path) return ''
  return `${API_ORIGIN}${path}`
}