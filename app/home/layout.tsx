
import Sidebar from '@/components/layout/Sidebar'
import RightSidebar from '@/components/layout/RightSidebar'
import AuthCheck from '@/components/auth/AuthCheck'

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthCheck>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 border-x border-gray-200 dark:border-gray-800 min-h-screen">
          {children}
        </main>
        <RightSidebar />
      </div>
    </AuthCheck>
  )
}
