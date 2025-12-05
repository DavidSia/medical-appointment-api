const MONTHS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
]

/**
 * Formata data para o padrão: "9 de Set, 2025"
 */
export function formatDate(date: Date): string {
  const day = date.getDate()
  const month = MONTHS[date.getMonth()]
  const year = date.getFullYear()
  return `${day} de ${month}, ${year}`
}

/**
 * Formata hora para o padrão: "14h30"
 */
export function formatTime(date: Date): string {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return minutes > 0 ? `${hours}h${minutes.toString().padStart(2, '0')}` : `${hours}h`
}

/**
 * Formata valor para o padrão: "R$ 100,00"
 */
export function formatPrice(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numValue)
}

/**
 * Converte string de horário "HH:MM:SS" para minutos desde meia-noite
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * Verifica se um dia da semana está dentro de um range
 */
export function isWeekDayInRange(day: number, from: number, to: number): boolean {
  if (from <= to) {
    return day >= from && day <= to
  }
  // Caso de range que cruza o fim de semana (ex: Sexta a Segunda)
  return day >= from || day <= to
}

/**
 * Verifica se um horário está dentro de um range
 */
export function isTimeInRange(time: string, fromTime: string, toTime: string): boolean {
  const timeMinutes = timeToMinutes(time)
  const fromMinutes = timeToMinutes(fromTime)
  const toMinutes = timeToMinutes(toTime)
  return timeMinutes >= fromMinutes && timeMinutes < toMinutes
}

/**
 * Formata data e hora de um Date para string de horário "HH:MM:SS"
 */
export function dateToTimeString(date: Date): string {
  return date.toTimeString().slice(0, 8)
}
