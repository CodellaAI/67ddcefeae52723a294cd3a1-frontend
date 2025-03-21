
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaCalendarAlt, FaArrowLeft } from 'react-icons/fa'
import { format } from 'date-fns'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import TweetList from '@/components/tweet/TweetList'
import FollowButton from '@/components/user/FollowButton'
import Spinner from '@/components/ui/Spinner'

export default function ProfilePage() {
  const { username } = useParams()
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('tweets')
  const { user } = useAuth()
  const isOwnProfile = user?.username === username

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/${username}`)
        setProfile(response.data.user)
      } catch (error) {
        toast.error('Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [username])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">User not found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The user you're looking for doesn't exist or may have been removed.
        </p>
        <Link href="/home" className="btn btn-primary">
          Return to Home
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-dark-100/80 backdrop-blur-md p-4 flex items-center">
        <Link href="/home" className="mr-6">
          <FaArrowLeft className="text-xl" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">{profile.name}</h1>
          <p className="text-sm text-gray-500">{profile.tweetsCount} Tweets</p>
        </div>
      </div>

      <div className="relative">
        <div className="h-48 bg-primary-100 dark:bg-primary-900">
          {profile.coverImage && (
            <Image
              src={profile.coverImage}
              alt="Cover"
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="absolute -bottom-16 left-4">
          <div className="w-32 h-32 rounded-full border-4 border-white dark:border-dark-100 bg-gray-200 overflow-hidden">
            <Image
              src={profile.profileImage || 'https://via.placeholder.com/128'}
              alt={profile.name}
              width={128}
              height={128}
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mt-20 px-4">
        <div className="flex justify-end mb-4">
          {isOwnProfile ? (
            <Link href="/profile/edit" className="btn btn-outline">
              Edit profile
            </Link>
          ) : (
            <FollowButton userId={profile._id} isFollowing={profile.isFollowing} />
          )}
        </div>

        <div className="mb-4">
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-gray-500">@{profile.username}</p>
          
          {profile.bio && (
            <p className="mt-2">{profile.bio}</p>
          )}
          
          <div className="flex items-center mt-2 text-gray-500">
            <FaCalendarAlt className="mr-2" />
            <span>Joined {format(new Date(profile.createdAt), 'MMMM yyyy')}</span>
          </div>
          
          <div className="flex mt-4">
            <Link href={`/profile/${username}/following`} className="mr-4 hover:underline">
              <span className="font-bold">{profile.followingCount}</span>{' '}
              <span className="text-gray-500">Following</span>
            </Link>
            <Link href={`/profile/${username}/followers`} className="hover:underline">
              <span className="font-bold">{profile.followersCount}</span>{' '}
              <span className="text-gray-500">Followers</span>
            </Link>
          </div>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-800">
          <div className="flex">
            <button
              className={`px-4 py-4 font-medium ${
                activeTab === 'tweets'
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('tweets')}
            >
              Tweets
            </button>
            <button
              className={`px-4 py-4 font-medium ${
                activeTab === 'replies'
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('replies')}
            >
              Tweets & replies
            </button>
            <button
              className={`px-4 py-4 font-medium ${
                activeTab === 'media'
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('media')}
            >
              Media
            </button>
            <button
              className={`px-4 py-4 font-medium ${
                activeTab === 'likes'
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('likes')}
            >
              Likes
            </button>
          </div>
        </div>

        <TweetList
          username={profile.username}
          type={activeTab}
        />
      </div>
    </div>
  )
}
