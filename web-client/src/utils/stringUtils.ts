export function newUUID(): string {
  return crypto.randomUUID()
}

export function joinPath(segments: string[]): string {
  return segments.join('/').replace(/([^:])\/+/g, '$1/')
}
