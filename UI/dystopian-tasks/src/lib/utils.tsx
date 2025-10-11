import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format seconds to MM:SS
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Star rating component (1-10)
export function StarRating({ rating, maxRating = 10 }: { rating: number; maxRating?: number }) {
  return (
    <>
      {Array.from({ length: maxRating }, (_, i) => i + 1).map(i => (
        <span key={i} className={i <= rating ? "text-yellow-500" : "text-zinc-600"}>
          ★
        </span>
      ))}
    </>
  )
}

// Format date to a consistent format (YYYY-MM-DD) to avoid hydration issues
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

