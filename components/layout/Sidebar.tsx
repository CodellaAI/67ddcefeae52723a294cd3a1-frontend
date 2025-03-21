
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { 
  FaTwitter, 
  FaHome, 
  FaHashtag, 
  FaBell, 
  FaEnvelope, 
  FaBookmark, 
  FaList, 
  FaUser, 
  FaEllipsisH,
  FaFeatherAlt
} from 'react-icons/fa'
import Image from 'next/image'

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isActive = (path: string) => {
    if (path === '/home') return pathname === '/home'
    return pathname?.startsWith(path)
  }

  const navItems = [
    { path: '/home', name: 'Home', icon: FaHome },
    { path: '/explore', name: 'Explore', icon: FaHashtag },
    { path: '/notifications', name: 'Notifications', icon: FaBell },
    { path: '/messages', name: 'Messages', icon: FaEnvelope },
    { path: '/bookmarks', name: 'Bookmarks', icon: FaBookmark },
    { path: '/lists', name: 'Lists', icon: FaList },
    { path: `/profile/${user?.username}`, name: 'Profile', icon: FaUser },
    { path: '/more', name: 'More', icon: FaEllipsisH },
  ]

  return (
    <aside className="hidden md:flex flex-col justify-between w-20 xl:w-72 h-screen sticky top-0 p-4">
      <div>
        <Link href="/home" className="flex items-center justify-center xl:justify-start mb-6">
          <FaTwitter className="text-primary-500 text-3xl" />
        </Link>

        <nav className="mb-8">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center py-3 px-4 rounded-full transition-colors ${
                    isActive(item.path)
                      ? 'font-bold text-primary-500'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="text-xl" />
                  <span className="hidden xl:block ml-4">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button className="bg-primary-500 hover:bg-primary-600 text-white rounded-full p-4 xl:py-3 xl:px-8 w-full flex items-center justify-center transition-colors">
          <FaFeatherAlt className="xl:hidden text-xl" />
          <span className="hidden xl:block font-bold">Tweet</span>
        </button>
      </div>

      {user && (
        <button 
          onClick={logout}
          className="flex items-center p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={user.profileImage || 'https://via.placeholder.com/40'}
                alt={user.name}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div className="hidden xl:block ml-3">
              <p className="font-bold">{user.name}</p>
              <p className="text-gray-500">@{user.username}</p>
            </div>
          </div>
          <FaEllipsisH className="hidden xl:block ml-auto text-gray-500" />
        </button>
      )}
    </aside>
  )
}
