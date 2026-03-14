import Elysia from 'elysia'
import NotFoundError from '../../domain/errors/NotFoundError'
import AlreadyExistError from '../../domain/errors/AlreadyExistError'
import { ApiResponse } from './ApiResponse'

export const globalErrorHandler = new Elysia()
  .error({
    NotFoundError,
    AlreadyExistError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'NotFoundError':
        set.status = 404
        return ApiResponse.error(error.message)
      case 'AlreadyExistError':
        set.status = 409
        return ApiResponse.error(error.message)
    }
  })
