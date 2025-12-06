import fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import scalarReference from '@scalar/fastify-api-reference'
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './shared/middlewares'
import { patientRoutes } from './modules/patient'
import { doctorRoutes } from './modules/doctor'
import { agendaRoutes } from './modules/agenda'
import { appointmentRoutes } from './modules/appointment'

export async function buildApp() {
  const app = fastify({
    logger: true,
  }).withTypeProvider<ZodTypeProvider>()

  // Configurar validadores Zod
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  // Configurar CORS
  await app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })

  // Configurar Swagger
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Medical Appointment API',
        description: 'API para agendamento de consultas médicas',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3333',
          description: 'Servidor de desenvolvimento',
        },
      ],
      tags: [
        { name: 'Pacientes', description: 'Endpoints de pacientes' },
        { name: 'Médicos', description: 'Endpoints de médicos' },
        { name: 'Agenda', description: 'Endpoints de agenda' },
        { name: 'Agendamentos', description: 'Endpoints de agendamentos' },
      ],
    },
  })

  // Configurar Swagger UI
  await app.register(swaggerUi, {
    routePrefix: '/docs',
  })

  // Configurar Scalar API Reference
  await app.register(scalarReference, {
    routePrefix: '/reference',
  })

  // Configurar error handler
  app.setErrorHandler(errorHandler)

  // Registrar rotas
  await app.register(async (api) => {
    await api.register(patientRoutes)
    await api.register(doctorRoutes)
    await api.register(agendaRoutes)
    await api.register(appointmentRoutes)
  }, { prefix: '/api' })

  // Rota de health check
  app.get('/health', {
    schema: {
      description: 'Health check',
      tags: ['Health'],
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string' },
          },
        },
      },
    },
  }, async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    }
  })

  return app
}
