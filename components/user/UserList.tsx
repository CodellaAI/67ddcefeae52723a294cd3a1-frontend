
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import UserCard from './UserCard'
import Spinner from '@/components/ui/Spinner'

interface UserListProps {
  query?: string
  type?: 'followers' | 'following'
  userId?: string
}

export default function UserList({ query, type, userId }: UserListProps) {
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    setUsers([])
    setPage(1)
    setHasMore(true)
    fetchUsers(1, true)
  }, [query, type, userId])

  const fetchUsers = async (pageNum: number, reset: boolean = false) => {
    if (reset) {
      setIsLoading(true)
    } else {
      setLoadingMore(true)
    }

    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/users?page=${pageNum}`
      
      if (query) {
        url += `&query=${encodeURIComponent(query)}`
      }
      
      if (type && userId) {
        url += `&type=${type}&userId=${userId}`
      }
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      const newUsers = response.data.users
      
      if (reset) {
        setUsers(newUsers)
      } else {
        setUsers(prev => [...prev, ...newUsers])
      }
      
      setHasMore(newUsers.length === 10) // Assuming 10 is the page size
    } catch (error) {
      toast.error('Failed to load users')
    } finally {
      setIsLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = () => {
    if (loadingMore || !hasMore) return
    const nextPage = page + 1
    setPage(nextPage)
    fetchUsers(nextPage)
  }

  const handleFollowAction = (userId: string, isFollowing: boolean) => {
    setUsers(users.map(user => 
      user._id === userId 
        ? { ...user, isFollowing } 
        : user
    ))
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner size="lg" />
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">No users found</h2>
        <p className="text-gray-500 mb-6">
          {query 
            ? `No results found for "${query}"`
            : type === 'followers'
            ? "This user doesn't have any followers yet"
            : type === 'following'
            ? "This user isn't following anyone yet"
            : "No users to display"}
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {users.map(user => (
          <div key={user._id} className="py-3">
            <UserCard 
              user={user} 
              onFollowAction={(isFollowing) => handleFollowAction(user._id, isFollowing)} 
            />
          </div>
        ))}
      </div>
      
      {hasMore && (
        <div className="py-4 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="btn btn-outline"
          >
            {loadingMore ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Loading...
              </>
            ) : (
              'Load more'
            )}
          </button>
        </div>
      )}
    </div>
  )
}
