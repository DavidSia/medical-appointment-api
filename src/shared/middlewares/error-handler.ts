import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'
import { AppError } from '../errors/app-error'

interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
): void {
  const response: ErrorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Erro interno do servidor',
    },
  }

  // Erro de validação Zod
  if (error instanceof ZodError) {
    response.error.code = 'VALIDATION_ERROR'
    response.error.message = 'Erro de validação'
    response.error.details = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }))
    reply.status(422).send(response)
    return
  }

  // Erro customizado da aplicação
  if (error instanceof AppError) {
    response.error.code = error.code
    response.error.message = error.message
    reply.status(error.statusCode).send(response)
    return
  }

  // Erro de constraint única do Prisma
  if (error.message?.includes('Unique constraint')) {
    response.error.code = 'CONFLICT'
    response.error.message = 'Registro já existe'
    reply.status(409).send(response)
    return
  }

  // Log do erro não tratado
  console.error('Unhandled error:', error)

  reply.status(500).send(response)
}
