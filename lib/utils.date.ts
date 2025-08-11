import { format } from 'date-fns'

export function formatDatePPpp(dateString: string) : string {
  return format((new Date(dateString)), 'PPpp')
}