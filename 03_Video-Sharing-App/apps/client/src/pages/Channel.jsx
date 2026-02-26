import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { userService, subscriptionService, videoService, postService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/ui/Avatar'
import VideoCard from '../components/video/VideoCard'
import PostCard from '../components/post/PostCard'
import { PageLoader } from '../components/ui/Spinner'
import toast from 'react-hot-toast'

const tabs = ['Videos', 'Posts']

const Channel = () => {
  const { userName } = useParams()
  const { user } = useAuth()
  const [channel, setChannel] = useState(null)
  const [videos, setVideos] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    fetchChannel()
  }, [userName])

  const fetchChannel = async () => {
    setLoading(true)
    try {
      const res = await userService.getProfile(userName)
      const ch = res.data.data
      setChannel(ch)
      setSubscribed(ch.isSubscribed)
      fetchVideos(ch._id)
      fetchPosts(ch._id)
    } catch {
      toast.error('Channel not found')
    } finally {
      setLoading(false)
    }
  }

  const fetchVideos = async (channelId) => {
    try {
      const res = await videoService.getAll({ userId: channelId, limit: 20 })
      setVideos(res.data.data.docs || [])
    } catch {}
  }

  const fetchPosts = async (channelId) => {
    try {
      const res = await postService.getUserPosts(channelId)
      setPosts(res.data.data || [])
    } catch {}
  }

  const handleSubscribe = async () => {
    if (!user) return toast.error('Sign in to subscribe')
    try {
      const res = await subscriptionService.toggle(channel._id)
      setSubscribed(res.data.data.subscribed)
      setChannel(p => ({
        ...p,
        subscribersCount: p.subscribersCount + (res.data.data.subscribed ? 1 : -1)
      }))
      toast.success(res.data.data.subscribed ? 'Subscribed!' : 'Unsubscribed')
    } catch {}
  }

  if (loading) return <PageLoader />
  if (!channel) return <div className="text-center py-20 text-gray-400">Channel not found</div>

  const isOwn = user?._id === channel._id || user?.userName === channel.userName

  return (
    <div>
      {/* Cover image */}
      <div className="relative h-40 md:h-56 rounded-3xl overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 mb-4">
        {channel.coverImage && (
          <img src={channel.coverImage} alt="cover" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Channel info */}
      <div className="px-4 md:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-6">
          <Avatar src={channel.avatar} name={channel.fullname} size="2xl" className="border-4 border-white dark:border-gray-950 shadow-xl" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>{channel.fullname}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">@{channel.userName}</p>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
              <span><strong className="text-gray-900 dark:text-white">{channel.subscribersCount || 0}</strong> subscribers</span>
              <span><strong className="text-gray-900 dark:text-white">{channel.subscribedToCount || 0}</strong> subscribed</span>
              <span><strong className="text-gray-900 dark:text-white">{videos.length}</strong> videos</span>
            </div>
          </div>
          {isOwn ? (
            <a href="/settings" className="btn-secondary flex items-center gap-2 text-sm self-start sm:self-auto">
              <i className="bi bi-gear" /> Edit channel
            </a>
          ) : user ? (
            <button
              onClick={handleSubscribe}
              className={`self-start sm:self-auto px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                subscribed
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  : 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md shadow-purple-500/20'
              }`}
            >
              {subscribed ? <><i className="bi bi-bell-fill mr-2" />Subscribed</> : 'Subscribe'}
            </button>
          ) : null}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-200 dark:border-gray-800 mb-6">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                activeTab === i
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 0 && (
          videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <i className="bi bi-camera-video text-5xl mb-3" />
              <p>No videos yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {videos.map(v => <VideoCard key={v._id} video={v} />)}
            </div>
          )
        )}

        {activeTab === 1 && (
          <div className="max-w-2xl space-y-4">
            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <i className="bi bi-chat-left-text text-5xl mb-3" />
                <p>No posts yet</p>
              </div>
            ) : (
              posts.map(p => <PostCard key={p._id} post={p} />)
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Channel
