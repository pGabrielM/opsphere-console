import { format, formatDistanceStrict, formatDistanceToNowStrict } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const relative = (date: Date | string) => formatDistanceToNowStrict(new Date(date), { locale: ptBR, addSuffix: true })
export const duration = (from: Date | string | number, to: Date | string | number) => formatDistanceStrict(new Date(from), new Date(to), { locale: ptBR })
export const formatDate = (date: Date | string, pattern = "dd/MM/yyyy 'às' HH:mm") => format(new Date(date), pattern, { locale: ptBR })
