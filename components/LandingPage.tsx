
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaTwitter } from 'react-icons/fa'
import { useAuth } from '@/context/AuthContext'

export default function LandingPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/home')
    }
  }, [user, router])

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="bg-primary-500 md:w-1/2 flex items-center justify-center p-8">
        <FaTwitter className="text-white text-9xl" />
      </div>
      
      <div className="md:w-1/2 flex flex-col justify-center p-8">
        <div className="max-w-md mx-auto">
          <FaTwitter className="text-primary-500 text-5xl mb-6" />
          
          <h1 className="text-4xl font-bold mb-6">Happening now</h1>
          <h2 className="text-3xl font-bold mb-8">Join Chirp today.</h2>
          
          <div className="space-y-4">
            <Link href="/signup" className="btn btn-primary w-full block text-center py-3">
              Create account
            </Link>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-dark-200 text-gray-500">
                  or
                </span>
              </div>
            </div>
            
            <p className="font-medium">Already have an account?</p>
            
            <Link href="/login" className="btn btn-outline w-full block text-center py-3">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
