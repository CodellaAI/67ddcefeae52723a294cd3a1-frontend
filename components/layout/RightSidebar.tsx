
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { FaSearch } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import UserCard from '@/components/user/UserCard'

export default function RightSidebar() {
  const [trends, setTrends] = useState([
    { id: 1, name: '#JavaScript', tweets: '123K' },
    { id: 2, name: '#ReactJS', tweets: '89K' },
    { id: 3, name: '#NextJS', tweets: '42K' },
    { id: 4, name: '#TailwindCSS', tweets: '37K' },
    { id: 5, name: '#WebDevelopment', tweets: '21K' },
  ])
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([])
  const { user } = useAuth()

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/suggestions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        setSuggestedUsers(response.data.users)
      } catch (error) {
        console.error('Failed to fetch suggested users:', error)
      }
    }

    if (user) {
      fetchSuggestedUsers()
    }
  }, [user])

  return (
    <aside className="hidden lg:block w-80 h-screen sticky top-0 p-4 overflow-y-auto">
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Twitter"
            className="input pl-10"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-dark-100 rounded-2xl mb-6">
        <h2 className="font-bold text-xl p-4">Trends for you</h2>
        <ul>
          {trends.map((trend) => (
            <li key={trend.id} className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors">
              <Link href={`/search?q=${encodeURIComponent(trend.name)}`} className="block">
                <p className="text-sm text-gray-500">Trending</p>
                <p className="font-bold">{trend.name}</p>
                <p className="text-sm text-gray-500">{trend.tweets} Tweets</p>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/explore" className="block p-4 text-primary-500 hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors rounded-b-2xl">
          Show more
        </Link>
      </div>

      {suggestedUsers.length > 0 && (
        <div className="bg-gray-50 dark:bg-dark-100 rounded-2xl">
          <h2 className="font-bold text-xl p-4">Who to follow</h2>
          <ul>
            {suggestedUsers.map((suggestedUser) => (
              <li key={suggestedUser._id} className="px-4 py-3">
                <UserCard user={suggestedUser} compact />
              </li>
            ))}
          </ul>
          <Link href="/connect" className="block p-4 text-primary-500 hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors rounded-b-2xl">
            Show more
          </Link>
        </div>
      )}
    </aside>
  )
}
