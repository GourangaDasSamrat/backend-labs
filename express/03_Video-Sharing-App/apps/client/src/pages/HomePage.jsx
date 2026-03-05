import { useState, useEffect, useCallback } from 'react'
import { getAllVideos } from '../api/video.api'
import VideoCard from '../components/video/VideoCard'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'

const CATEGORIES = ['All', 'Gaming', 'Music', 'Education', 'Technology', 'Sports', 'Cooking', 'Travel', 'Science']

const HomePage = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [category, setCategory] = useState('All')

  const fetchVideos = useCallback(async (pageNum = 1, reset = false) => {
    setLoading(true)
    try {
      const res = await getAllVideos({ page: pageNum, limit: 12 })
      const data = res.data.data
      const newVideos = data.docs || []
      setVideos(reset ? newVideos : (prev) => [...prev, ...newVideos])
      setHasMore(data.hasNextPage || false)
      setPage(pageNum)
    } catch {
      // silently handle
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVideos(1, true)
  }, [fetchVideos])

  return (
    <div>
      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-xl text-sm font-medium transition-all
              ${category === cat
                ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md shadow-purple-200 dark:shadow-purple-900/30'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-600'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Videos grid */}
      {loading && videos.length === 0 ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : videos.length === 0 ? (
        <EmptyState icon="bi-camera-video" title="No videos yet" message="Be the first to upload a video!" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => fetchVideos(page + 1)}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Spinner size="sm" /> : <><i className="bi bi-arrow-down-circle"></i> Load more</>}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default HomePage
