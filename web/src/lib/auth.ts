import jwtDecode from 'jwt-decode'
import { cookies } from 'next/headers'

interface IUser {
  name: string
  avatarUrl: string
  sub: string
}

export function getUser(): IUser {
  const token = cookies().get('token')?.value

  if (!token) {
    throw new Error('Unauthenticated')
  }

  const user: IUser = jwtDecode(token)

  return user
}
