
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import TweetCard from './TweetCard'
import Spinner from '@/components/ui/Spinner'

interface TweetListProps {
  username?: string
  query?: string
  type?: string
  replyToId?: string
  refreshTrigger?: number
}

export default function TweetList({ 
  username, 
  query, 
  type = 'tweets',
  replyToId,
  refreshTrigger = 0
}: TweetListProps) {
  const [tweets, setTweets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    setTweets([])
    setPage(1)
    setHasMore(true)
    fetchTweets(1, true)
  }, [username, query, type, replyToId, refreshTrigger])

  const fetchTweets = async (pageNum: number, reset: boolean = false) => {
    if (reset) {
      setIsLoading(true)
    } else {
      setLoadingMore(true)
    }

    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/tweets?page=${pageNum}`
      
      if (username) {
        url += `&username=${username}`
      }
      
      if (query) {
        url += `&query=${encodeURIComponent(query)}`
      }
      
      if (type && type !== 'tweets') {
        url += `&type=${type}`
      }
      
      if (replyToId) {
        url += `&replyToId=${replyToId}`
      }
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      const newTweets = response.data.tweets
      
      if (reset) {
        setTweets(newTweets)
      } else {
        setTweets(prev => [...prev, ...newTweets])
      }
      
      setHasMore(newTweets.length === 10) // Assuming 10 is the page size
    } catch (error) {
      toast.error('Failed to load tweets')
    } finally {
      setIsLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = () => {
    if (loadingMore || !hasMore) return
    const nextPage = page + 1
    setPage(nextPage)
    fetchTweets(nextPage)
  }

  const handleTweetAction = (tweetId: string, action: string) => {
    if (action === 'delete') {
      setTweets(tweets.filter(tweet => tweet._id !== tweetId))
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner size="lg" />
      </div>
    )
  }

  if (tweets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">No tweets found</h2>
        <p className="text-gray-500 mb-6">
          {username 
            ? `@${username} hasn't posted any tweets yet`
            : query
            ? `No results found for "${query}"`
            : replyToId
            ? "No replies yet. Be the first to reply!"
            : "Your timeline is empty. Follow some users to see their tweets!"}
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {tweets.map(tweet => (
          <TweetCard 
            key={tweet._id} 
            tweet={tweet} 
            onAction={(action) => handleTweetAction(tweet._id, action)} 
          />
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
