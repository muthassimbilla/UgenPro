import { Loader2 } from "lucide-react"

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin" />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Loading...</p>
      </div>
    </div>
  )
}
