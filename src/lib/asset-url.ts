// Public assets retain their filenames; Vite supplies the deployment prefix.
export function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}
