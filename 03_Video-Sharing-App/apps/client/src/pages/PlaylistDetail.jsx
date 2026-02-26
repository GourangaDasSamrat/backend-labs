import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { playlistService } from '../services/api'
import VideoCard from '../components/video/VideoCard'
import { PageLoader } from '../components/ui/Spinner'
import { timeAgo } from '../utils/helpers'
import toast from 'react-hot-toast'

const PlaylistDetail = () => {
  const { playlistId } = useParams()
  const [playlist, setPlaylist] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    playlistService.getById(playlistId)
      .then(res => setPlaylist(res.data.data))
      .catch(() => toast.error('Playlist not found'))
      .finally(() => setLoading(false))
  }, [playlistId])

  if (loading) return <PageLoader />
  if (!playlist) return <div className="text-center py-20 text-gray-400">Playlist not found</div>

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Playlist info */}
      <div className="lg:w-72 flex-shrink-0">
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 text-white sticky top-24">
          <div className="aspect-video rounded-xl overflow-hidden bg-black/20 mb-4">
            {playlist.videos?.[0]?.thumbnail ? (
              <img src={playlist.videos[0].thumbnail} alt={playlist.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <i className="bi bi-collection-play text-4xl text-white/50" />
              </div>
            )}
          </div>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>{playlist.name}</h1>
          {playlist.description && (
            <p className="text-white/70 text-sm mt-2">{playlist.description}</p>
          )}
          <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between text-sm text-white/70">
            <span>{playlist.videos?.length || 0} videos</span>
            <span>{timeAgo(playlist.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Video list */}
      <div className="flex-1">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Videos
        </h2>
        {!playlist.videos?.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <i className="bi bi-camera-video text-5xl mb-3" />
            <p>No videos in this playlist</p>
          </div>
        ) : (
          <div className="space-y-3">
            {playlist.videos.map((video, i) => (
              <div key={video._id} className="flex gap-3 items-start">
                <span className="text-sm text-gray-400 dark:text-gray-500 w-5 flex-shrink-0 pt-1">{i + 1}</span>
                <div className="flex-1">
                  <VideoCard video={video} horizontal />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PlaylistDetail
