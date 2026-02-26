import { useState, useEffect } from 'react'
import { getWatchHistory } from '../api/auth.api'
import VideoCard from '../components/video/VideoCard'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'

const WatchHistoryPage = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getWatchHistory()
      .then((res) => setVideos(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
        <i className="bi bi-clock-history text-purple-500"></i> Watch History
      </h1>
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : videos.length === 0 ? (
        <EmptyState icon="bi-clock" title="No watch history" message="Videos you watch will appear here." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video) => <VideoCard key={video._id} video={video} />)}
        </div>
      )}
    </div>
  )
}

export default WatchHistoryPage
