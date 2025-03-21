
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { 
  FaRegComment, 
  FaRetweet, 
  FaRegHeart, 
  FaHeart, 
  FaShare, 
  FaEllipsisH,
  FaTrash
} from 'react-icons/fa'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

interface TweetDetailProps {
  tweet: any
  onActionComplete?: () => void
}

export default function TweetDetail({ tweet, onActionComplete }: TweetDetailProps) {
  const [isLiked, setIsLiked] = useState(tweet.isLiked)
  const [likesCount, setLikesCount] = useState(tweet.likesCount)
  const [isRetweeted, setIsRetweeted] = useState(tweet.isRetweeted)
  const [retweetsCount, setRetweetsCount] = useState(tweet.retweetsCount)
  const [showActions, setShowActions] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  
  const isOwnTweet = user?._id === tweet.user._id

  const toggleLike = async () => {
    try {
      const endpoint = isLiked ? 'unlike' : 'like'
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tweets/${tweet._id}/${endpoint}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      
      setIsLiked(!isLiked)
      setLikesCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1)
      
      if (onActionComplete) {
        onActionComplete()
      }
    } catch (error) {
      toast.error('Failed to like tweet')
    }
  }

  const toggleRetweet = async () => {
    try {
      const endpoint = isRetweeted ? 'unretweet' : 'retweet'
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tweets/${tweet._id}/${endpoint}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      
      setIsRetweeted(!isRetweeted)
      setRetweetsCount(prevCount => isRetweeted ? prevCount - 1 : prevCount + 1)
      
      if (onActionComplete) {
        onActionComplete()
      }
    } catch (error) {
      toast.error('Failed to retweet')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this tweet?')) return
    
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tweets/${tweet._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      
      toast.success('Tweet deleted')
      router.push('/home')
    } catch (error) {
      toast.error('Failed to delete tweet')
    } finally {
      setShowActions(false)
    }
  }

  const toggleActions = () => {
    setShowActions(!showActions)
  }

  return (
    <article className="p-4 border-b border-gray-200 dark:border-gray-800">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <Link href={`/profile/${tweet.user.username}`} className="mr-3">
            <Image
              src={tweet.user.profileImage || 'https://via.placeholder.com/48'}
              alt={tweet.user.name}
              width={48}
              height={48}
              className="rounded-full"
            />
          </Link>
          
          <div>
            <Link href={`/profile/${tweet.user.username}`} className="font-bold hover:underline block">
              {tweet.user.name}
            </Link>
            <Link href={`/profile/${tweet.user.username}`} className="text-gray-500 hover:underline block">
              @{tweet.user.username}
            </Link>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={toggleActions}
            className="text-gray-500 hover:text-primary-500 p-2 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/30"
          >
            <FaEllipsisH />
          </button>
          
          {showActions && (
            <div className="absolute right-0 top-10 bg-white dark:bg-dark-100 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 z-10">
              {isOwnTweet && (
                <button
                  onClick={handleDelete}
                  className="flex items-center w-full p-3 hover:bg-gray-100 dark:hover:bg-dark-200 text-red-500"
                >
                  <FaTrash className="mr-2" />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {tweet.replyToUser && (
        <div className="text-gray-500 text-sm mb-4">
          Replying to{' '}
          <Link 
            href={`/profile/${tweet.replyToUser.username}`}
            className="text-primary-500 hover:underline"
          >
            @{tweet.replyToUser.username}
          </Link>
        </div>
      )}
      
      <p className="text-xl mb-4 whitespace-pre-wrap">{tweet.content}</p>
      
      {tweet.image && (
        <div className="mb-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
          <Image
            src={tweet.image}
            alt="Tweet image"
            width={600}
            height={400}
            className="w-full object-cover"
          />
        </div>
      )}
      
      <div className="text-gray-500 mb-4">
        <time dateTime={tweet.createdAt}>
          {format(new Date(tweet.createdAt), 'h:mm a · MMM d, yyyy')}
        </time>
      </div>
      
      {(tweet.retweetsCount > 0 || tweet.likesCount > 0) && (
        <div className="flex border-y border-gray-200 dark:border-gray-800 py-3 mb-3">
          {tweet.retweetsCount > 0 && (
            <Link href={`/tweet/${tweet._id}/retweets`} className="mr-5">
              <span className="font-bold">{retweetsCount}</span>{' '}
              <span className="text-gray-500">Retweets</span>
            </Link>
          )}
          
          {tweet.likesCount > 0 && (
            <Link href={`/tweet/${tweet._id}/likes`}>
              <span className="font-bold">{likesCount}</span>{' '}
              <span className="text-gray-500">Likes</span>
            </Link>
          )}
        </div>
      )}
      
      <div className="flex justify-around text-gray-500">
        <button className="flex items-center hover:text-primary-500 group">
          <div className="p-2 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30">
            <FaRegComment className="text-xl" />
          </div>
        </button>
        
        <button 
          onClick={toggleRetweet}
          className={`flex items-center group ${isRetweeted ? 'text-green-500' : ''}`}
        >
          <div className={`p-2 rounded-full ${
            isRetweeted 
              ? 'bg-green-50 dark:bg-green-900/30' 
              : 'group-hover:bg-green-50 dark:group-hover:bg-green-900/30'
          }`}>
            <FaRetweet className="text-xl" />
          </div>
        </button>
        
        <button 
          onClick={toggleLike}
          className={`flex items-center group ${isLiked ? 'text-red-500' : ''}`}
        >
          <div className={`p-2 rounded-full ${
            isLiked 
              ? 'bg-red-50 dark:bg-red-900/30' 
              : 'group-hover:bg-red-50 dark:group-hover:bg-red-900/30'
          }`}>
            {isLiked ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
          </div>
        </button>
        
        <button className="flex items-center hover:text-primary-500 group">
          <div className="p-2 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30">
            <FaShare className="text-xl" />
          </div>
        </button>
      </div>
    </article>
  )
}
