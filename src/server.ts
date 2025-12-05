import { buildApp } from './app'
import { env } from './config/env'

async function main() {
  const app = await buildApp()

  try {
    await app.listen({
      host: env.HOST,
      port: env.PORT,
    })

    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🏥 Medical Appointment API                              ║
║                                                           ║
║   Server running at: http://localhost:${env.PORT}             ║
║                                                           ║
║   📚 Documentation:                                       ║
║   • Swagger UI:  http://localhost:${env.PORT}/docs            ║
║   • Scalar:      http://localhost:${env.PORT}/reference       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `)
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

main()
