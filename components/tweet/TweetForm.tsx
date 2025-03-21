
'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { FaImage, FaSmile, FaPoll, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '@/context/AuthContext'

interface TweetFormProps {
  replyToId?: string
  onTweetSuccess?: () => void
  placeholder?: string
}

export default function TweetForm({ replyToId, onTweetSuccess, placeholder = "What's happening?" }: TweetFormProps) {
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showImageInput, setShowImageInput] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { user } = useAuth()

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) return
    
    setIsSubmitting(true)
    
    try {
      const tweetData: any = { content }
      
      if (imageUrl) {
        tweetData.image = imageUrl
      }
      
      if (replyToId) {
        tweetData.replyToId = replyToId
      }
      
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tweets`,
        tweetData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      
      setContent('')
      setImageUrl('')
      setShowImageInput(false)
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
      
      if (onTweetSuccess) {
        onTweetSuccess()
      }
      
      toast.success(replyToId ? 'Reply posted!' : 'Tweet posted!')
    } catch (error) {
      toast.error('Failed to post tweet')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex">
      <div className="mr-4 flex-shrink-0">
        <Image
          src={user?.profileImage || 'https://via.placeholder.com/48'}
          alt={user?.name || 'User'}
          width={48}
          height={48}
          className="rounded-full"
        />
      </div>
      
      <form onSubmit={handleSubmit} className="flex-grow">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          placeholder={placeholder}
          className="w-full resize-none bg-transparent border-none focus:outline-none text-lg mb-3"
          rows={2}
        />
        
        {showImageInput && (
          <div className="mb-3">
            <input
              type="text"
              value={imageUrl}
              onChange={handleImageUrlChange}
              placeholder="Paste image URL here"
              className="input"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex text-primary-500 space-x-2">
            <button 
              type="button" 
              onClick={() => setShowImageInput(!showImageInput)}
              className="p-2 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/30"
            >
              <FaImage />
            </button>
            <button type="button" className="p-2 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/30">
              <FaSmile />
            </button>
            <button type="button" className="p-2 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/30">
              <FaPoll />
            </button>
            <button type="button" className="p-2 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/30">
              <FaCalendarAlt />
            </button>
            <button type="button" className="p-2 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/30">
              <FaMapMarkerAlt />
            </button>
          </div>
          
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className={`btn btn-primary ${
              !content.trim() || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Posting...' : replyToId ? 'Reply' : 'Tweet'}
          </button>
        </div>
      </form>
    </div>
  )
}
