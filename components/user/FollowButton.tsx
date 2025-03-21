
'use client'

import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

interface FollowButtonProps {
  userId: string
  isFollowing: boolean
  onFollowChange?: (isFollowing: boolean) => void
  compact?: boolean
}

export default function FollowButton({ 
  userId, 
  isFollowing, 
  onFollowChange,
  compact = false
}: FollowButtonProps) {
  const [following, setFollowing] = useState(isFollowing)
  const [isLoading, setIsLoading] = useState(false)
  const [showUnfollow, setShowUnfollow] = useState(false)

  const toggleFollow = async () => {
    setIsLoading(true)
    
    try {
      const endpoint = following ? 'unfollow' : 'follow'
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/${endpoint}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      
      setFollowing(!following)
      
      if (onFollowChange) {
        onFollowChange(!following)
      }
    } catch (error) {
      toast.error(`Failed to ${following ? 'unfollow' : 'follow'} user`)
    } finally {
      setIsLoading(false)
    }
  }

  if (compact) {
    return (
      <button
        onClick={toggleFollow}
        disabled={isLoading}
        className={`text-sm font-bold px-3 py-1 rounded-full ${
          following
            ? 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400'
            : 'bg-black dark:bg-white text-white dark:text-black'
        }`}
      >
        {isLoading
          ? '...'
          : following
          ? 'Following'
          : 'Follow'}
      </button>
    )
  }

  return (
    <button
      onClick={toggleFollow}
      disabled={isLoading}
      onMouseEnter={() => following && setShowUnfollow(true)}
      onMouseLeave={() => setShowUnfollow(false)}
      className={`font-bold px-4 py-2 rounded-full transition-colors ${
        following
          ? showUnfollow
            ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700'
            : 'bg-white dark:bg-dark-100 text-black dark:text-white border border-gray-300 dark:border-gray-700'
          : 'bg-black dark:bg-white text-white dark:text-black'
      }`}
    >
      {isLoading
        ? 'Loading...'
        : following
        ? showUnfollow
          ? 'Unfollow'
          : 'Following'
        : 'Follow'}
    </button>
  )
}
