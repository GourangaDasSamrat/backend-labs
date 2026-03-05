import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import VideoCard from '../components/video/VideoCard'
import { PageLoader } from '../components/ui/Spinner'
import { videoService } from '../services/api'

const categories = [
  { label: 'All', value: '' },
  { label: '🔥 Trending', query: { sortBy: 'views', sortType: 'desc' } },
  { label: '✨ New', query: { sortBy: 'createdAt', sortType: 'desc' } },
  { label: '👁️ Most Viewed', query: { sortBy: 'views', sortType: 'desc' } },
]

const Home = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query') || ''
  const sortBy = searchParams.get('sortBy') || 'createdAt'
  const sortType = searchParams.get('sortType') || 'desc'

  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  const fetchVideos = useCallback(async (reset = false) => {
    setLoading(true)
    try {
      const res = await videoService.getAll({
        page: reset ? 1 : page,
        limit: 16,
        query,
        sortBy,
        sortType,
      })
      const data = res.data.data
      if (reset) {
        setVideos(data.docs || [])
        setPage(2)
      } else {
        setVideos(p => [...p, ...(data.docs || [])])
        setPage(p => p + 1)
      }
      setHasMore(data.hasNextPage || false)
    } catch {
      setVideos([])
    } finally {
      setLoading(false)
    }
  }, [query, sortBy, sortType, page])

  useEffect(() => {
    fetchVideos(true)
    // eslint-disable-next-line
  }, [query, sortBy, sortType])

  return (
    <div>
      {/* Hero banner */}
      {!query && (
        <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 p-8 md:p-12">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-8 w-32 h-32 rounded-full bg-white/30 blur-2xl" />
            <div className="absolute bottom-4 right-16 w-48 h-48 rounded-full bg-blue-300/30 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full bg-purple-300/30 blur-xl" />
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Discover Amazing Content
            </h1>
            <p className="text-purple-200 text-base md:text-lg">Watch, share and connect with creators worldwide</p>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === i
                ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md shadow-purple-500/20'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search results header */}
      {query && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Search results for <span className="gradient-text">"{query}"</span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{videos.length} videos found</p>
        </div>
      )}

      {/* Videos grid */}
      {loading && videos.length === 0 ? (
        <PageLoader />
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-600">
          <i className="bi bi-camera-video-off text-6xl mb-4" />
          <p className="text-lg font-medium">No videos found</p>
          <p className="text-sm mt-1">Try a different search term</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {videos.map(video => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => fetchVideos(false)}
                disabled={loading}
                className="btn-secondary flex items-center gap-2 px-8 py-3"
              >
                {loading ? <><i className="bi bi-arrow-repeat animate-spin" /> Loading...</> : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Home
