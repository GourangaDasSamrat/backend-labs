import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dashboardService, videoService } from '../services/api'
import { PageLoader } from '../components/ui/Spinner'
import { formatViews, timeAgo } from '../utils/helpers'
import toast from 'react-hot-toast'

const StatCard = ({ icon, label, value, color }) => (
  <div className={`bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm`}>
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
      <i className={`bi ${icon} text-xl text-white`} />
    </div>
    <p className="text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
  </div>
)

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, videosRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getVideos(),
      ])
      setStats(statsRes.data.data)
      setVideos(videosRes.data.data || [])
    } catch {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePublish = async (videoId, currentStatus) => {
    try {
      await videoService.togglePublish(videoId)
      setVideos(p => p.map(v => v._id === videoId ? { ...v, isPublished: !currentStatus } : v))
      toast.success(`Video ${!currentStatus ? 'published' : 'unpublished'}`)
    } catch {
      toast.error('Failed to update video')
    }
  }

  const handleDelete = async (videoId) => {
    if (!confirm('Delete this video?')) return
    try {
      await videoService.delete(videoId)
      setVideos(p => p.filter(v => v._id !== videoId))
      toast.success('Video deleted')
    } catch {
      toast.error('Failed to delete video')
    }
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Manage your channel</p>
        </div>
        <Link to="/upload" className="btn-primary flex items-center gap-2">
          <i className="bi bi-plus-lg" /> New Video
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="bi-camera-video" label="Total Videos" value={stats?.totalVideos || 0} color="bg-gradient-to-br from-purple-500 to-purple-700" />
        <StatCard icon="bi-eye" label="Total Views" value={formatViews(stats?.totalViews)} color="bg-gradient-to-br from-blue-500 to-blue-700" />
        <StatCard icon="bi-heart-fill" label="Total Likes" value={formatViews(stats?.totalLikes)} color="bg-gradient-to-br from-pink-500 to-rose-600" />
        <StatCard icon="bi-people-fill" label="Subscribers" value={formatViews(stats?.totalSubscribers)} color="bg-gradient-to-br from-emerald-500 to-teal-600" />
      </div>

      {/* Videos table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Your Videos</h2>
        </div>

        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <i className="bi bi-camera-video text-5xl mb-3" />
            <p>No videos yet</p>
            <Link to="/upload" className="btn-primary mt-4 text-sm">Upload your first video</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Video</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Views</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Likes</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {videos.map(video => (
                  <tr key={video._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <Link to={`/video/${video._id}`} className="font-medium text-sm text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 line-clamp-2 transition-colors">
                            {video.title}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <button
                        onClick={() => handleTogglePublish(video._id, video.isPublished)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          video.isPublished
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${video.isPublished ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        {video.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">
                      {formatViews(video.views)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                      {formatViews(video.likesCount)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                      {timeAgo(video.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <Link to={`/video/${video._id}/edit`} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-blue-500 transition-colors">
                          <i className="bi bi-pencil text-sm" />
                        </Link>
                        <button onClick={() => handleDelete(video._id)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-red-500 transition-colors">
                          <i className="bi bi-trash text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
