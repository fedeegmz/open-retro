import Elysia from 'elysia'
import NotFoundError from '../../domain/errors/NotFoundError'
import AlreadyExistError from '../../domain/errors/AlreadyExistError'
import { ApiResponse } from '@open-retro/shared/types/api'
import InvalidArgError from '../../domain/errors/InvalidArgError'
import { i18n } from '../services/i18nPlugin'
import { I18nKeys } from '@open-retro/shared/i18n'

export const globalErrorHandler = new Elysia()
  .use(i18n)
  .error({
    NotFoundError,
    AlreadyExistError,
    InvalidArgError,
  })
  .onError({ as: 'global' }, ({ code, error, set, i18n }) => {
    const t = (key: I18nKeys) => (i18n ? i18n.t(key) : (key as string))

    switch (code) {
      case 'NotFoundError':
        set.status = 404
        return ApiResponse.error(t('errors.not_found'))
      case 'AlreadyExistError':
        set.status = 409
        return ApiResponse.error(t('errors.already_exists'))
      case 'InvalidArgError':
        set.status = 400
        return ApiResponse.error(t('errors.invalid_arg'))
      case 'VALIDATION': {
        set.status = 400
        return ApiResponse.error(t('errors.validation_error'))
      }
      default:
        set.status = 500
        const message = error instanceof Error ? error.message : t('errors.internal_server_error')
        return ApiResponse.error(message)
    }
  })
