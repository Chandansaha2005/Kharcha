import { formatINR, formatDateDMY } from './format'

interface SmsReminderInput {
  personName: string
  amount: number
  dueDate: number
  phoneNumber: string
}

/**
 * Build an `sms:` URI that opens the device SMS app with a pre-filled reminder.
 * PRD §9 template.
 */
export function buildSmsUri({ personName, amount, dueDate, phoneNumber }: SmsReminderInput): string {
  const message = `Hi ${personName}, this is a reminder that ${formatINR(
    amount,
  )} is due for repayment. Please return it by ${formatDateDMY(dueDate)}.`
  // The `?body=` separator is the most broadly supported form across Android/iOS.
  return `sms:${phoneNumber}?body=${encodeURIComponent(message)}`
}
