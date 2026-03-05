import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getChannelStats, getChannelVideos } from '../api/dashboard.api'
import { togglePublishStatus, deleteVideo } from '../api/video.api'
import Spinner from '../components/common/Spinner'
import { formatViews, formatTimeAgo } from '../utils/formatters'
import toast from 'react-hot-toast'

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-purple-100 dark:border-purple-900/30">
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-3`}>
      <i className={`bi ${icon} text-xl text-white`}></i>
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
  </div>
)

const DashboardPage = () => {
  const [stats, setStats] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [sRes, vRes] = await Promise.all([getChannelStats(), getChannelVideos()])
        setStats(sRes.data.data)
        setVideos(vRes.data.data || [])
      } catch {
        toast.error('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleTogglePublish = async (videoId) => {
    try {
      const res = await togglePublishStatus(videoId)
      setVideos(videos.map((v) => v._id === videoId ? { ...v, isPublished: res.data.data.isPublished } : v))
    } catch {
      toast.error('Failed to update video')
    }
  }

  const handleDelete = async (videoId) => {
    if (!window.confirm('Delete this video?')) return
    try {
      await deleteVideo(videoId)
      setVideos(videos.filter((v) => v._id !== videoId))
      toast.success('Video deleted')
    } catch {
      toast.error('Failed to delete video')
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your channel</p>
        </div>
        <Link
          to="/upload"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity"
        >
          <i className="bi bi-plus-circle"></i> Upload Video
        </Link>
      </div>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon="bi-play-circle-fill" label="Total Videos" value={stats.totalVideos} color="bg-gradient-to-br from-purple-500 to-purple-700" />
          <StatCard icon="bi-eye-fill" label="Total Views" value={formatViews(stats.totalViews)} color="bg-gradient-to-br from-blue-500 to-blue-700" />
          <StatCard icon="bi-heart-fill" label="Total Likes" value={formatViews(stats.totalLikes)} color="bg-gradient-to-br from-pink-500 to-red-500" />
          <StatCard icon="bi-people-fill" label="Subscribers" value={formatViews(stats.totalSubscribers)} color="bg-gradient-to-br from-green-500 to-emerald-600" />
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-purple-100 dark:border-purple-900/30 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">Your Videos</h2>
        </div>
        {videos.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No videos yet. <Link to="/upload" className="text-purple-500 hover:underline">Upload one!</Link></div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {videos.map((video) => (
              <div key={video._id} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-24 h-14 rounded-xl object-cover flex-shrink-0"
                  onError={(e) => { e.target.src = `https://picsum.photos/seed/${video._id}/240/135` }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{video.title}</p>
                  <div className="flex gap-4 mt-1 text-xs text-gray-400">
                    <span><i className="bi bi-eye mr-1"></i>{formatViews(video.views)}</span>
                    <span><i className="bi bi-heart mr-1"></i>{video.likesCount}</span>
                    <span>{formatTimeAgo(video.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${video.isPublished ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'}`}>
                    {video.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <button onClick={() => handleTogglePublish(video._id)} className="p-1.5 rounded-lg text-gray-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 transition-colors">
                    <i className="bi bi-toggle-on"></i>
                  </button>
                  <Link to={`/video/${video._id}/edit`} className="p-1.5 rounded-lg text-gray-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors">
                    <i className="bi bi-pencil"></i>
                  </Link>
                  <button onClick={() => handleDelete(video._id)} className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors">
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
