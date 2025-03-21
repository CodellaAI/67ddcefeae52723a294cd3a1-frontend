
import './globals.css'
import { Inter } from 'next/font/google'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from '@/context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Chirp Social',
  description: 'Connect with friends and the world around you on Chirp Social',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 dark:bg-dark-200 text-gray-900 dark:text-gray-100`}>
        <AuthProvider>
          {children}
          <ToastContainer position="bottom-right" theme="colored" />
        </AuthProvider>
      </body>
    </html>
  )
}
