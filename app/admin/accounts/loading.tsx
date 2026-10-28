import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-7 h-7 animate-spin text-lime-600" />
      <p className="text-xs font-semibold text-slate-500">
        Loading Enterprise Accounts & Financial Reports...
      </p>
    </div>
  )
}

