export class AuthPayload {
  userId: string
  username: string
  type: 'access' | 'refresh'
  roles: string[]
}
