import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getUserChannelProfile } from '../api/auth.api'
import { toggleSubscription } from '../api/subscription.api'
import { getUserPosts } from '../api/post.api'
import { getUserPlaylists } from '../api/playlist.api'
import VideoCard from '../components/video/VideoCard'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import { useAuth } from '../context/AuthContext'
import { formatViews, formatTimeAgo } from '../utils/formatters'
import toast from 'react-hot-toast'
import api from '../api/axios'

const TABS = ['Videos', 'Playlists', 'Community']

const ChannelPage = () => {
  const { userName } = useParams()
  const { user: currentUser } = useAuth()
  const [channel, setChannel] = useState(null)
  const [videos, setVideos] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [posts, setPosts] = useState([])
  const [tab, setTab] = useState('Videos')
  const [loading, setLoading] = useState(true)
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await getUserChannelProfile(userName)
        const ch = res.data.data
        setChannel(ch)
        setSubscribed(ch.isSubscribed)
        const [vRes, pRes, posRes] = await Promise.all([
          api.get(`/videos?userId=${ch._id}&limit=12`),
          getUserPlaylists(ch._id),
          getUserPosts(ch._id),
        ])
        setVideos(vRes.data.data?.docs || [])
        setPlaylists(pRes.data.data || [])
        setPosts(posRes.data.data || [])
      } catch {
        toast.error('Failed to load channel')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [userName])

  const handleSubscribe = async () => {
    if (!currentUser) return toast.error('Please login to subscribe')
    try {
      await toggleSubscription(channel._id)
      setSubscribed(!subscribed)
      setChannel((prev) => ({
        ...prev,
        subscribersCount: subscribed ? prev.subscribersCount - 1 : prev.subscribersCount + 1,
      }))
    } catch {
      toast.error('Failed to toggle subscription')
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  if (!channel) return <div className="text-center py-20 text-gray-500">Channel not found</div>

  return (
    <div className="max-w-5xl mx-auto">
      {/* Banner */}
      <div className="h-40 md:h-56 rounded-2xl overflow-hidden bg-gradient-to-r from-purple-600 to-blue-500 mb-0">
        {channel.coverImage && (
          <img src={channel.coverImage} alt="cover" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Channel info */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-purple-100 dark:border-purple-900/30 mb-6 -mt-6 mx-0">
        <div className="flex flex-wrap items-end gap-4">
          <img
            src={channel.avatar || `https://ui-avatars.com/api/?name=${channel.fullname}&background=7c3aed&color=fff`}
            alt={channel.fullname}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white dark:ring-gray-900 -mt-10 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">{channel.fullname}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">@{channel.userName}</p>
            <div className="flex gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
              <span><strong className="text-gray-800 dark:text-gray-200">{channel.subscribersCount}</strong> subscribers</span>
              <span><strong className="text-gray-800 dark:text-gray-200">{channel.subscribedToCount}</strong> subscriptions</span>
            </div>
          </div>
          {currentUser && currentUser._id !== channel._id && (
            <button
              onClick={handleSubscribe}
              className={`px-5 py-2 rounded-xl font-medium transition-all ${subscribed
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                : 'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:opacity-90'}`}
            >
              <i className={`bi ${subscribed ? 'bi-bell-slash' : 'bi-bell'} mr-2`}></i>
              {subscribed ? 'Unsubscribe' : 'Subscribe'}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-800 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-xl transition-colors ${tab === t
              ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Videos' && (
        videos.length === 0 ? (
          <EmptyState icon="bi-camera-video" title="No videos" message="This channel hasn't uploaded any videos yet." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((v) => <VideoCard key={v._id} video={v} />)}
          </div>
        )
      )}

      {tab === 'Playlists' && (
        playlists.length === 0 ? (
          <EmptyState icon="bi-collection" title="No playlists" message="No playlists created yet." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((pl) => (
              <div key={pl._id} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-purple-100 dark:border-purple-900/30">
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl mb-3 flex items-center justify-center">
                  <i className="bi bi-collection-play text-4xl text-purple-400"></i>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">{pl.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{pl.description}</p>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'Community' && (
        posts.length === 0 ? (
          <EmptyState icon="bi-chat-square-text" title="No posts" message="No community posts yet." />
        ) : (
          <div className="max-w-2xl space-y-4">
            {posts.map((post) => (
              <div key={post._id} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-purple-100 dark:border-purple-900/30">
                <div className="flex items-center gap-3 mb-3">
                  <img src={post.owner?.avatar || `https://ui-avatars.com/api/?name=${post.owner?.fullname}&background=7c3aed&color=fff`} alt="" className="w-8 h-8 rounded-xl object-cover" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{post.owner?.fullname}</p>
                    <p className="text-xs text-gray-400">{formatTimeAgo(post.createdAt)}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{post.content}</p>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}

export default ChannelPage
