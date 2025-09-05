/**
 * Utility functions for date formatting that work consistently on server and client
 */

/**
 * Format date to Brazilian format (DD/MM/YYYY) without locale dependencies
 * @param dateString ISO date string
 * @returns Formatted date string in DD/MM/YYYY format
 */
export function formatDateToBR(dateString: string): string {
  try {
    // Extract date part (YYYY-MM-DD) and convert to DD/MM/YYYY
    const datePart = dateString.split('T')[0]
    const [year, month, day] = datePart.split('-')
    return `${day}/${month}/${year}`
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString // Return original string if formatting fails
  }
}

/**
 * Format date to Brazilian format with time (DD/MM/YYYY HH:MM)
 * @param dateString ISO date string
 * @returns Formatted date string in DD/MM/YYYY HH:MM format
 */
export function formatDateTimeToBR(dateString: string): string {
  try {
    const [datePart, timePart] = dateString.split('T')
    const [year, month, day] = datePart.split('-')
    const [hour, minute] = timePart.split(':')
    return `${day}/${month}/${year} ${hour}:${minute}`
  } catch (error) {
    console.error('Error formatting datetime:', error)
    return dateString // Return original string if formatting fails
  }
}

/**
 * Get current date in YYYY-MM-DD format (server-safe)
 * @returns Date string in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
