import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getAllVideos } from '../api/video.api'
import VideoCard from '../components/video/VideoCard'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'

const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const search = async () => {
      setLoading(true)
      try {
        const res = await getAllVideos({ query, limit: 20 })
        setVideos(res.data.data?.docs || [])
      } catch {
        setVideos([])
      } finally {
        setLoading(false)
      }
    }
    search()
  }, [query])

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {query ? `Results for "${query}"` : 'Explore Videos'}
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{videos.length} results</p>
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : videos.length === 0 ? (
        <EmptyState icon="bi-search" title="No results found" message="Try different keywords or browse all videos." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video) => <VideoCard key={video._id} video={video} />)}
        </div>
      )}
    </div>
  )
}

export default SearchPage
