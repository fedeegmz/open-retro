export interface IHashService {
  hash(value: string): string
  verify(value: string, hash: string): boolean
}
