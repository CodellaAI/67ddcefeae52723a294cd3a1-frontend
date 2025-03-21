
'use client'

import { useState } from 'react'
import TweetForm from '@/components/tweet/TweetForm'
import TweetList from '@/components/tweet/TweetList'
import PageHeader from '@/components/layout/PageHeader'

export default function HomePage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const refreshTweets = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div>
      <PageHeader title="Home" />
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <TweetForm onTweetSuccess={refreshTweets} />
      </div>
      <TweetList refreshTrigger={refreshTrigger} />
    </div>
  )
}
