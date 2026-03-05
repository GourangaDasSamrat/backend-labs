import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getSubscribedChannels } from '../api/subscription.api'
import VideoCard from '../components/video/VideoCard'
import EmptyState from '../components/common/EmptyState'
import Spinner from '../components/common/Spinner'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const SubscriptionsPage = () => {
  const { user } = useAuth()
  const [channels, setChannels] = useState([])
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        const cRes = await getSubscribedChannels(user._id)
        const channelList = cRes.data.data || []
        setChannels(channelList)
        // Fetch recent videos from subscribed channels
        if (channelList.length > 0) {
          const vPromises = channelList.slice(0, 5).map((ch) => api.get(`/videos?userId=${ch._id}&limit=4`))
          const vResults = await Promise.all(vPromises)
          const allVideos = vResults.flatMap((r) => r.data.data?.docs || [])
          setVideos(allVideos)
        }
      } catch {
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">Subscriptions</h1>

      {channels.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-4 mb-8">
          {channels.map((ch) => (
            <Link key={ch._id} to={`/channel/${ch.userName}`} className="flex-shrink-0 flex flex-col items-center gap-2 group">
              <img
                src={ch.avatar || `https://ui-avatars.com/api/?name=${ch.fullname}&background=7c3aed&color=fff`}
                alt={ch.fullname}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-purple-400 transition-all"
              />
              <span className="text-xs text-gray-600 dark:text-gray-400 max-w-14 truncate text-center">{ch.fullname}</span>
            </Link>
          ))}
        </div>
      )}

      {videos.length === 0 ? (
        <EmptyState icon="bi-collection-play" title="No subscription videos" message="Subscribe to channels to see their latest videos here." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((v) => <VideoCard key={v._id} video={v} />)}
        </div>
      )}
    </div>
  )
}

export default SubscriptionsPage
