
'use client'

import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import PageHeader from '@/components/layout/PageHeader'
import TweetList from '@/components/tweet/TweetList'
import UserList from '@/components/user/UserList'

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('tweets')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is handled by the components below
  }

  return (
    <div>
      <PageHeader title="Explore" />
      
      <div className="p-4 sticky top-0 bg-white dark:bg-dark-100 z-10 border-b border-gray-200 dark:border-gray-800">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search for tweets, people, or topics"
            className="input pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </form>
        
        <div className="flex mt-4 border-b border-gray-200 dark:border-gray-800">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'tweets'
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('tweets')}
          >
            Tweets
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'people'
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('people')}
          >
            People
          </button>
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'tweets' ? (
          <TweetList query={searchQuery} />
        ) : (
          <UserList query={searchQuery} />
        )}
      </div>
    </div>
  )
}
