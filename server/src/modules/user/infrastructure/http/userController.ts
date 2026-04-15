import { Elysia } from 'elysia'
import { GenerateRandomNameUseCase } from '../../application/GenerateRandomNameUseCase'
import { ApiResponse } from '@open-retro/shared/types/api'

export function userController() {
  const generateRandomNameUseCase = new GenerateRandomNameUseCase()

  return new Elysia({ prefix: '/users' }).get('/generate-name', () => {
    const username = generateRandomNameUseCase.execute()
    return ApiResponse.success({ username })
  })
}
