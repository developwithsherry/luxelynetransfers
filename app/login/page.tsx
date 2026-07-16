// File: /app/admin/login/page.tsx
import Image from "next/image"
import { LoginForm } from "@/components/admin/login/login-form"

export default function StaticLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center justify-center space-y-4 mb-6">

          <p className="text-gray-500 text-center">Login into admin portal.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
