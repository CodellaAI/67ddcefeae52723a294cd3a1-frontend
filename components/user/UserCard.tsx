
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import FollowButton from './FollowButton'

interface UserCardProps {
  user: any
  onFollowAction?: (isFollowing: boolean) => void
  compact?: boolean
}

export default function UserCard({ user, onFollowAction, compact = false }: UserCardProps) {
  const { user: currentUser } = useAuth()
  const isCurrentUser = currentUser?._id === user._id

  return (
    <div className="flex items-start">
      <Link href={`/profile/${user.username}`} className="flex-shrink-0 mr-3">
        <Image
          src={user.profileImage || 'https://via.placeholder.com/48'}
          alt={user.name}
          width={48}
          height={48}
          className="rounded-full"
        />
      </Link>
      
      <div className="flex-grow min-w-0">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <Link href={`/profile/${user.username}`} className="font-bold hover:underline block truncate">
              {user.name}
            </Link>
            <Link href={`/profile/${user.username}`} className="text-gray-500 hover:underline block truncate">
              @{user.username}
            </Link>
          </div>
          
          {!isCurrentUser && (
            <FollowButton 
              userId={user._id} 
              isFollowing={user.isFollowing}
              onFollowChange={onFollowAction}
              compact={compact}
            />
          )}
        </div>
        
        {!compact && user.bio && (
          <p className="mt-1 text-gray-800 dark:text-gray-200">{user.bio}</p>
        )}
      </div>
    </div>
  )
}
