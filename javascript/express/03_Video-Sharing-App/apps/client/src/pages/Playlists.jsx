import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { playlistService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/ui/Modal'
import { PageLoader } from '../components/ui/Spinner'
import { timeAgo } from '../utils/helpers'
import toast from 'react-hot-toast'

const PlaylistCard = ({ playlist, isOwn, onDelete }) => (
  <Link to={`/playlist/${playlist._id}`} className="block bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden card-hover group">
    <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 relative">
      {playlist.videos?.[0]?.thumbnail ? (
        <img src={playlist.videos[0].thumbnail} alt={playlist.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-purple-400 dark:text-purple-600">
          <i className="bi bi-collection-play text-4xl" />
        </div>
      )}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <i className="bi bi-play-circle-fill text-white text-4xl" />
      </div>
      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
        {playlist.videos?.length || 0} videos
      </span>
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{playlist.name}</h3>
      {playlist.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{playlist.description}</p>
      )}
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{timeAgo(playlist.createdAt)}</p>
    </div>
  </Link>
)

const Playlists = () => {
  const { userId } = useParams()
  const { user } = useAuth()
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })

  const targetId = userId || user?._id
  const isOwn = user?._id === targetId

  useEffect(() => {
    if (!targetId) return
    playlistService.getUserPlaylists(targetId)
      .then(res => setPlaylists(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [targetId])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const res = await playlistService.create(form)
      setPlaylists(p => [res.data.data, ...p])
      setShowCreate(false)
      setForm({ name: '', description: '' })
      toast.success('Playlist created!')
    } catch {
      toast.error('Failed to create playlist')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this playlist?')) return
    try {
      await playlistService.delete(id)
      setPlaylists(p => p.filter(pl => pl._id !== id))
      toast.success('Playlist deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  if (loading) return <PageLoader />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Playlists
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{playlists.length} playlists</p>
        </div>
        {isOwn && (
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
            <i className="bi bi-plus-lg" /> New Playlist
          </button>
        )}
      </div>

      {playlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <i className="bi bi-collection-play text-6xl mb-4" />
          <p className="text-lg">No playlists yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {playlists.map(pl => (
            <PlaylistCard key={pl._id} playlist={pl} isOwn={isOwn} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Playlist">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
            <input type="text" placeholder="My Playlist" className="input-field" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <textarea placeholder="Describe your playlist" className="input-field resize-none" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex-1">Create</button>
            <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Playlists
