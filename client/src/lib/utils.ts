import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Converts yyyy-MM-dd to dd-mm-yyyy for display
export function formatDate(date: string | null | undefined): string {
  if (!date) return '-';
  const parts = date.split('T')[0].split('-'); // handles both "yyyy-MM-dd" and ISO timestamps
  if (parts.length !== 3) return date;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}
