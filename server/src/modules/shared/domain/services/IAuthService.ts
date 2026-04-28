export interface IAuthUser {
  id: string
  username: string
  avatarUrl?: string
}

export interface IAuthService {
  verifyToken(token: string): Promise<IAuthUser | null>
}
