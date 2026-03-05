import { useState, useEffect } from 'react'
import { userService } from '../services/api'
import VideoCard from '../components/video/VideoCard'
import { PageLoader } from '../components/ui/Spinner'

const WatchHistory = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    userService.getWatchHistory()
      .then(res => setVideos(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <i className="bi bi-clock-history text-purple-500 mr-3" />Watch History
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{videos.length} videos</p>
      </div>
      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <i className="bi bi-clock-history text-6xl mb-4" />
          <p className="text-lg">No watch history yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {videos.map(v => <VideoCard key={v._id} video={v} />)}
        </div>
      )}
    </div>
  )
}

export default WatchHistory
