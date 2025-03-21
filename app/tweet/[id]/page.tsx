
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaArrowLeft } from 'react-icons/fa'
import Link from 'next/link'
import TweetDetail from '@/components/tweet/TweetDetail'
import TweetForm from '@/components/tweet/TweetForm'
import TweetList from '@/components/tweet/TweetList'
import Spinner from '@/components/ui/Spinner'

export default function TweetPage() {
  const { id } = useParams()
  const router = useRouter()
  const [tweet, setTweet] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const fetchTweet = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tweets/${id}`)
        setTweet(response.data.tweet)
      } catch (error) {
        toast.error('Failed to load tweet')
        router.push('/home')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTweet()
  }, [id, router, refreshTrigger])

  const refreshTweet = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!tweet) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Tweet not found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This tweet doesn't exist or may have been removed.
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
        <h1 className="text-xl font-bold">Tweet</h1>
      </div>

      <TweetDetail tweet={tweet} onActionComplete={refreshTweet} />

      {!tweet.replyToId && (
        <div className="p-4 border-t border-b border-gray-200 dark:border-gray-800">
          <TweetForm replyToId={tweet._id} onTweetSuccess={refreshTweet} placeholder="Tweet your reply" />
        </div>
      )}

      <div className="border-t border-gray-200 dark:border-gray-800">
        <h2 className="p-4 font-bold">Replies</h2>
        <TweetList replyToId={tweet._id} refreshTrigger={refreshTrigger} />
      </div>
    </div>
  )
}
