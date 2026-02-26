import { useState, useEffect } from 'react'
import { getLikedVideos } from '../api/like.api'
import VideoCard from '../components/video/VideoCard'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'

const LikedVideosPage = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLikedVideos()
      .then((res) => setVideos(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
        <i className="bi bi-heart-fill text-red-500"></i> Liked Videos
      </h1>
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : videos.length === 0 ? (
        <EmptyState icon="bi-heart" title="No liked videos" message="Like videos to see them here." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video) => <VideoCard key={video._id} video={video} />)}
        </div>
      )}
    </div>
  )
}

export default LikedVideosPage
