import nodemailer from 'nodemailer'
import { Decimal } from '@prisma/client/runtime/library'
import { env } from '../../config/env'
import { formatDate, formatTime, formatPrice } from '../utils/formatters'

interface SendAppointmentConfirmationParams {
  patientName: string
  patientEmail: string
  doctorName: string
  specialty: string
  appointmentAt: Date
  price: number | string | Decimal
}

const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  },
})

export async function sendAppointmentConfirmationEmail(
  params: SendAppointmentConfirmationParams
): Promise<void> {
  const { patientName, patientEmail, doctorName, specialty, appointmentAt, price } = params

  const formattedDate = formatDate(appointmentAt)
  const formattedTime = formatTime(appointmentAt)
  const formattedPrice = formatPrice(price)

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
        .info-row { display: flex; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e2e8f0; }
        .info-label { font-weight: bold; color: #64748b; min-width: 120px; }
        .info-value { color: #1e293b; }
        .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-radius: 0 0 8px 8px; }
        .highlight { background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Consulta Confirmada</h1>
        </div>
        <div class="content">
          <p>Olá, <strong>${patientName}</strong>!</p>
          <p>Sua consulta foi agendada com sucesso. Confira os detalhes abaixo:</p>
          
          <div class="highlight">
            <div class="info-row">
              <span class="info-label">📅 Data:</span>
              <span class="info-value">${formattedDate}</span>
            </div>
            <div class="info-row">
              <span class="info-label">🕐 Horário:</span>
              <span class="info-value">${formattedTime}</span>
            </div>
            <div class="info-row">
              <span class="info-label">👨‍⚕️ Médico:</span>
              <span class="info-value">${doctorName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">🏥 Especialidade:</span>
              <span class="info-value">${specialty}</span>
            </div>
            <div class="info-row" style="border-bottom: none; margin-bottom: 0; padding-bottom: 0;">
              <span class="info-label">💰 Valor:</span>
              <span class="info-value"><strong>${formattedPrice}</strong></span>
            </div>
          </div>
          
          <p>⚠️ <strong>Importante:</strong> Caso precise cancelar, faça-o com pelo menos 2 horas de antecedência.</p>
          <p>Até breve!</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
    Olá, ${patientName}!

    Sua consulta foi agendada com sucesso. Confira os detalhes:

    📅 Data: ${formattedDate}
    🕐 Horário: ${formattedTime}
    👨‍⚕️ Médico: ${doctorName}
    🏥 Especialidade: ${specialty}
    💰 Valor: ${formattedPrice}

    ⚠️ Importante: Caso precise cancelar, faça-o com pelo menos 2 horas de antecedência.

    Até breve!
  `

  try {
    await transporter.sendMail({
      from: `"<${env.MAIL_FROM}>`,
      to: patientEmail,
      subject: `Consulta Confirmada - ${formattedDate} às ${formattedTime}`,
      text,
      html,
    })
    console.log(`📧 Email de confirmação enviado para ${patientEmail}`)
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error)
    // Não lança o erro para não bloquear o agendamento
  }
}
