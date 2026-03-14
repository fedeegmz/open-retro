import Elysia from 'elysia'
import NotFoundError from '../../domain/errors/NotFoundError'
import AlreadyExistError from '../../domain/errors/AlreadyExistError'
import { ApiResponse } from '@shared/types/api'
import InvalidArgError from '../../domain/errors/InvalidArgError'

export const globalErrorHandler = new Elysia()
  .error({
    NotFoundError,
    AlreadyExistError,
    InvalidArgError,
  })
  .onError({ as: 'global' }, ({ code, error, set }) => {
    switch (code) {
      case 'NotFoundError':
        set.status = 404
        return ApiResponse.error(error.message)
      case 'AlreadyExistError':
        set.status = 409
        return ApiResponse.error(error.message)
      case 'InvalidArgError':
        set.status = 400
        return ApiResponse.error(error.message)
      case 'VALIDATION': {
        set.status = 400
        return ApiResponse.error(error.message)
      }
      default:
        set.status = 500
        const message = error instanceof Error ? error.message : 'Internal server error'
        return ApiResponse.error(message)
    }
  })
