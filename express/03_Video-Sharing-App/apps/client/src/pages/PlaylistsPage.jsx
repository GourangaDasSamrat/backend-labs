import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getUserPlaylists, createPlaylist, deletePlaylist } from '../api/playlist.api'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import toast from 'react-hot-toast'

const PlaylistsPage = () => {
  const { user } = useAuth()
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newPl, setNewPl] = useState({ name: '', description: '' })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!user) return
    getUserPlaylists(user._id)
      .then((res) => setPlaylists(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newPl.name.trim()) return
    setCreating(true)
    try {
      const res = await createPlaylist(newPl)
      setPlaylists([...playlists, res.data.data])
      setNewPl({ name: '', description: '' })
      setShowCreate(false)
      toast.success('Playlist created!')
    } catch {
      toast.error('Failed to create playlist')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this playlist?')) return
    try {
      await deletePlaylist(id)
      setPlaylists(playlists.filter((p) => p._id !== id))
      toast.success('Playlist deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <i className="bi bi-collection-fill text-purple-500"></i> My Playlists
        </h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <i className="bi bi-plus"></i> New Playlist
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-purple-200 dark:border-purple-800 mb-6 space-y-4">
          <input
            value={newPl.name}
            onChange={(e) => setNewPl({ ...newPl, name: e.target.value })}
            placeholder="Playlist name"
            required
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-400 text-gray-800 dark:text-gray-200 outline-none text-sm"
          />
          <input
            value={newPl.description}
            onChange={(e) => setNewPl({ ...newPl, description: e.target.value })}
            placeholder="Description (optional)"
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-400 text-gray-800 dark:text-gray-200 outline-none text-sm"
          />
          <div className="flex gap-3">
            <button type="submit" disabled={creating} className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white text-sm font-medium hover:opacity-90 disabled:opacity-50">
              Create
            </button>
            <button type="button" onClick={() => setShowCreate(false)} className="px-5 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium">
              Cancel
            </button>
          </div>
        </form>
      )}

      {playlists.length === 0 ? (
        <EmptyState icon="bi-collection" title="No playlists" message="Create your first playlist to organize videos." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((pl) => (
            <div key={pl._id} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-600 transition-all group">
              <Link to={`/playlist/${pl._id}`}>
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 flex items-center justify-center">
                  <i className="bi bi-collection-play text-5xl text-purple-400"></i>
                </div>
              </Link>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <Link to={`/playlist/${pl._id}`}>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 hover:text-purple-600 transition-colors">{pl.name}</h3>
                    {pl.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{pl.description}</p>}
                    <p className="text-xs text-gray-400 mt-2">{pl.videos?.length || 0} videos</p>
                  </Link>
                  <button onClick={() => handleDelete(pl._id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PlaylistsPage
