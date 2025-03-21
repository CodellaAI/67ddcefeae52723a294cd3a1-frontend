
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
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
import { useAuth } from '@/context/AuthContext'

interface TweetCardProps {
  tweet: any
  onAction?: (action: string) => void
}

export default function TweetCard({ tweet, onAction }: TweetCardProps) {
  const [isLiked, setIsLiked] = useState(tweet.isLiked)
  const [likesCount, setLikesCount] = useState(tweet.likesCount)
  const [isRetweeted, setIsRetweeted] = useState(tweet.isRetweeted)
  const [retweetsCount, setRetweetsCount] = useState(tweet.retweetsCount)
  const [showActions, setShowActions] = useState(false)
  const { user } = useAuth()
  
  const isOwnTweet = user?._id === tweet.user._id

  const toggleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
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
    } catch (error) {
      toast.error('Failed to like tweet')
    }
  }

  const toggleRetweet = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
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
    } catch (error) {
      toast.error('Failed to retweet')
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
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
      if (onAction) {
        onAction('delete')
      }
    } catch (error) {
      toast.error('Failed to delete tweet')
    } finally {
      setShowActions(false)
    }
  }

  const toggleActions = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowActions(!showActions)
  }

  return (
    <Link href={`/tweet/${tweet._id}`} className="block hover:bg-gray-50 dark:hover:bg-dark-300/50 transition-colors">
      <article className="p-4 relative">
        {tweet.retweetedBy && (
          <div className="flex items-center text-sm text-gray-500 mb-2 ml-6">
            <FaRetweet className="mr-2" />
            <span>Retweeted by {tweet.retweetedBy.name}</span>
          </div>
        )}
        
        <div className="flex">
          <Link 
            href={`/profile/${tweet.user.username}`} 
            className="flex-shrink-0 mr-3"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={tweet.user.profileImage || 'https://via.placeholder.com/48'}
              alt={tweet.user.name}
              width={48}
              height={48}
              className="rounded-full"
            />
          </Link>
          
          <div className="flex-grow">
            <div className="flex items-center mb-1">
              <Link 
                href={`/profile/${tweet.user.username}`}
                className="font-bold hover:underline mr-1"
                onClick={(e) => e.stopPropagation()}
              >
                {tweet.user.name}
              </Link>
              <Link 
                href={`/profile/${tweet.user.username}`}
                className="text-gray-500 hover:underline mr-1"
                onClick={(e) => e.stopPropagation()}
              >
                @{tweet.user.username}
              </Link>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500 ml-1">
                {formatDistanceToNow(new Date(tweet.createdAt), { addSuffix: true })}
              </span>
              
              <button
                onClick={toggleActions}
                className="ml-auto text-gray-500 hover:text-primary-500 p-2 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/30"
              >
                <FaEllipsisH />
              </button>
              
              {showActions && (
                <div className="absolute right-4 top-12 bg-white dark:bg-dark-100 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 z-10">
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
            
            {tweet.replyToUser && (
              <div className="text-gray-500 text-sm mb-2">
                Replying to{' '}
                <Link 
                  href={`/profile/${tweet.replyToUser.username}`}
                  className="text-primary-500 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  @{tweet.replyToUser.username}
                </Link>
              </div>
            )}
            
            <p className="mb-3 whitespace-pre-wrap">{tweet.content}</p>
            
            {tweet.image && (
              <div className="mb-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <Image
                  src={tweet.image}
                  alt="Tweet image"
                  width={500}
                  height={300}
                  className="w-full object-cover"
                />
              </div>
            )}
            
            <div className="flex justify-between text-gray-500 max-w-md">
              <button 
                onClick={(e) => e.preventDefault()}
                className="flex items-center hover:text-primary-500 group"
              >
                <div className="p-2 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 mr-1">
                  <FaRegComment />
                </div>
                <span>{tweet.commentsCount || 0}</span>
              </button>
              
              <button 
                onClick={toggleRetweet}
                className={`flex items-center group ${isRetweeted ? 'text-green-500' : ''}`}
              >
                <div className={`p-2 rounded-full ${
                  isRetweeted 
                    ? 'bg-green-50 dark:bg-green-900/30' 
                    : 'group-hover:bg-green-50 dark:group-hover:bg-green-900/30'
                } mr-1`}>
                  <FaRetweet />
                </div>
                <span>{retweetsCount || 0}</span>
              </button>
              
              <button 
                onClick={toggleLike}
                className={`flex items-center group ${isLiked ? 'text-red-500' : ''}`}
              >
                <div className={`p-2 rounded-full ${
                  isLiked 
                    ? 'bg-red-50 dark:bg-red-900/30' 
                    : 'group-hover:bg-red-50 dark:group-hover:bg-red-900/30'
                } mr-1`}>
                  {isLiked ? <FaHeart /> : <FaRegHeart />}
                </div>
                <span>{likesCount || 0}</span>
              </button>
              
              <button 
                onClick={(e) => e.preventDefault()}
                className="flex items-center hover:text-primary-500 group"
              >
                <div className="p-2 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 mr-1">
                  <FaShare />
                </div>
              </button>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
