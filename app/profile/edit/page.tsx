
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { FaArrowLeft } from 'react-icons/fa'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import Spinner from '@/components/ui/Spinner'

export default function EditProfilePage() {
  const { user, updateUser } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
    profileImage: '',
    coverImage: ''
  })

  useEffect(() => {
    if (!user) return

    const fetchProfile = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/${user.username}`)
        const userData = response.data.user
        setProfile({
          name: userData.name || '',
          bio: userData.bio || '',
          location: userData.location || '',
          website: userData.website || '',
          profileImage: userData.profileImage || '',
          coverImage: userData.coverImage || ''
        })
      } catch (error) {
        toast.error('Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
        profile,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      if (response.data.success) {
        toast.success('Profile updated successfully')
        updateUser(response.data.user)
        router.push(`/profile/${user?.username}`)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-dark-100/80 backdrop-blur-md p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href={`/profile/${user?.username}`} className="mr-6">
            <FaArrowLeft className="text-xl" />
          </Link>
          <h1 className="text-xl font-bold">Edit profile</h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="btn btn-primary"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Profile Image</label>
          <div className="flex items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mr-4">
              <Image
                src={profile.profileImage || 'https://via.placeholder.com/128'}
                alt="Profile"
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
            <input
              type="text"
              name="profileImage"
              value={profile.profileImage}
              onChange={handleChange}
              placeholder="Profile image URL"
              className="input"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Cover Image</label>
          <div className="h-32 bg-gray-200 mb-2 rounded-md overflow-hidden">
            {profile.coverImage && (
              <Image
                src={profile.coverImage}
                alt="Cover"
                width={600}
                height={200}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <input
            type="text"
            name="coverImage"
            value={profile.coverImage}
            onChange={handleChange}
            placeholder="Cover image URL"
            className="input"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={profile.name}
            onChange={handleChange}
            className="input"
            maxLength={50}
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            {profile.name.length}/50
          </p>
        </div>

        <div className="mb-6">
          <label htmlFor="bio" className="block text-sm font-medium mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            className="input min-h-[100px]"
            maxLength={160}
          />
          <p className="text-sm text-gray-500 mt-1">
            {profile.bio.length}/160
          </p>
        </div>

        <div className="mb-6">
          <label htmlFor="location" className="block text-sm font-medium mb-1">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={profile.location}
            onChange={handleChange}
            className="input"
            maxLength={30}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="website" className="block text-sm font-medium mb-1">
            Website
          </label>
          <input
            id="website"
            name="website"
            type="url"
            value={profile.website}
            onChange={handleChange}
            className="input"
            placeholder="https://example.com"
          />
        </div>
      </form>
    </div>
  )
}
